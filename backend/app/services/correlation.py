from typing import List, Dict, Any
from collections import defaultdict
from app.schemas import CriticalAlert, CorrelationResult
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class CorrelationEngine:
    """Motor de correlação de eventos críticos entre múltiplas fontes"""
    
    def __init__(self):
        self.weight_factors = {
            "vulnerability_exploit": 3.0,
            "multiple_sources": 2.5,
            "critical_asset": 2.0,
            "threat_intelligence": 2.0,
            "mitre_technique": 1.5
        }
    
    def correlate_events(
        self,
        elastic_alerts: List[Dict],
        tenable_vulns: List[Dict],
        defender_alerts: List[Dict],
        opencti_indicators: List[Dict]
    ) -> List[CorrelationResult]:
        """Correlaciona eventos de todas as fontes por ativo"""
        
        # Agrupar eventos por ativo
        asset_events = defaultdict(lambda: {
            "elastic": [],
            "tenable": [],
            "defender": [],
            "opencti": []
        })
        
        for alert in elastic_alerts:
            asset = self._normalize_asset_name(alert.get('asset', ''))
            if asset:
                asset_events[asset]["elastic"].append(alert)
        
        for vuln in tenable_vulns:
            asset = self._normalize_asset_name(vuln.get('asset', ''))
            if asset:
                asset_events[asset]["tenable"].append(vuln)
        
        for alert in defender_alerts:
            asset = self._normalize_asset_name(alert.get('asset', ''))
            if asset:
                asset_events[asset]["defender"].append(alert)
        
        # Correlacionar indicators com assets (baseado em IPs/domains)
        for indicator in opencti_indicators:
            # Lógica de matching de indicators com assets seria implementada aqui
            pass
        
        # Calcular scores de correlação
        correlations = []
        for asset, events in asset_events.items():
            correlation = self._calculate_correlation_score(asset, events, opencti_indicators)
            if correlation["risk_score"] >= settings.RISK_SCORE_HIGH_THRESHOLD:
                correlations.append(CorrelationResult(**correlation))
        
        # Ordenar por risk score decrescente
        correlations.sort(key=lambda x: x.risk_score, reverse=True)
        
        logger.info(f"Correlated {len(correlations)} high-risk assets")
        return correlations
    
    def _calculate_correlation_score(
        self,
        asset: str,
        events: Dict[str, List],
        indicators: List[Dict]
    ) -> Dict[str, Any]:
        """Calcula score de correlação para um ativo"""
        
        base_score = 0
        alerts = []
        mitre_techniques = set()
        threat_indicators = []
        
        # Processar alertas Elastic
        for alert in events["elastic"]:
            risk_score = alert.get("risk_score", 0)
            base_score += risk_score * 0.3
            
            alerts.append(CriticalAlert(
                id=alert["id"],
                source="elastic",
                severity=alert["severity"],
                title=alert["title"],
                description=alert.get("description", ""),
                asset=asset,
                score=risk_score,
                timestamp=alert["timestamp"]
            ))
        
        # Processar vulnerabilidades Tenable
        vuln_count = len(events["tenable"])
        has_exploit = any(v.get("exploit_available", False) for v in events["tenable"])
        
        for vuln in events["tenable"]:
            cvss = vuln.get("cvss_score", 0)
            vpr = vuln.get("vpr_score", 0)
            score = max(cvss, vpr) * 10  # Normalizar para 0-100
            
            if has_exploit:
                score *= self.weight_factors["vulnerability_exploit"]
            
            base_score += score * 0.4
            
            alerts.append(CriticalAlert(
                id=vuln["id"],
                source="tenable",
                severity=vuln["severity"],
                title=vuln["title"],
                description=vuln.get("description", ""),
                asset=asset,
                score=score,
                timestamp=vuln["timestamp"]
            ))
        
        # Processar alertas Defender
        for alert in events["defender"]:
            severity_score = {"critical": 100, "high": 80, "medium": 50}.get(alert.get("severity", "").lower(), 30)
            base_score += severity_score * 0.3
            
            # Coletar técnicas MITRE
            techniques = alert.get("mitre_techniques", [])
            mitre_techniques.update(techniques)
            if techniques:
                base_score *= self.weight_factors["mitre_technique"]
            
            alerts.append(CriticalAlert(
                id=alert["id"],
                source="defender",
                severity=alert["severity"],
                title=alert["title"],
                description=alert.get("description", ""),
                asset=asset,
                score=severity_score,
                timestamp=alert["timestamp"]
            ))
        
        # Aplicar multiplicador de múltiplas fontes
        active_sources = sum(1 for events_list in events.values() if events_list)
        if active_sources >= 3:
            base_score *= self.weight_factors["multiple_sources"]
        
        # Adicionar indicadores OpenCTI relevantes
        for indicator in indicators:
            threat_indicators.append(indicator.get("value", ""))
        
        if threat_indicators:
            base_score *= self.weight_factors["threat_intelligence"]
        
        # Normalizar score final (0-100)
        final_score = min(int(base_score), 100)
        
        return {
            "asset": asset,
            "risk_score": final_score,
            "alerts": alerts,
            "vulnerability_count": vuln_count,
            "threat_indicators": threat_indicators[:10],
            "mitre_techniques": list(mitre_techniques)
        }
    
    def _normalize_asset_name(self, asset: str) -> str:
        """Normaliza nomes de assets para matching"""
        if not asset or asset == "unknown":
            return ""
        
        # Remover domínio, converter para lowercase
        asset = asset.lower().split('.')[0]
        return asset
