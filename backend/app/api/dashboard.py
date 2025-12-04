from fastapi import APIRouter, Depends, Query
from typing import List
from app.auth import get_current_user
from app.models import User
from app.schemas import CriticalAlert, CorrelationResult
from app.integrations.elastic import ElasticIntegration
from app.integrations.tenable import TenableIntegration
from app.integrations.defender import DefenderIntegration
from app.integrations.opencti import OpenCTIIntegration
from app.services.correlation import CorrelationEngine
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/critical-alerts", response_model=List[CorrelationResult])
async def get_critical_alerts(
    hours: int = Query(24, ge=1, le=168),
    current_user: User = Depends(get_current_user)
):
    """Obter alertas críticos correlacionados de todas as fontes"""
    
    try:
        # Inicializar integrações
        elastic = ElasticIntegration()
        tenable = TenableIntegration()
        defender = DefenderIntegration()
        opencti = OpenCTIIntegration()
        
        # Buscar dados de todas as fontes em paralelo
        elastic_alerts = await elastic.get_critical_alerts(hours=hours)
        tenable_vulns = tenable.get_critical_vulnerabilities(days=hours//24 or 1)
        defender_alerts = await defender.get_critical_alerts(hours=hours)
        opencti_indicators = opencti.get_critical_indicators(days=hours//24 or 1)
        
        # Fechar conexão Elastic
        await elastic.close()
        
        # Correlacionar eventos
        correlation_engine = CorrelationEngine()
        correlations = correlation_engine.correlate_events(
            elastic_alerts=elastic_alerts,
            tenable_vulns=tenable_vulns,
            defender_alerts=defender_alerts,
            opencti_indicators=opencti_indicators
        )
        
        logger.info(f"Returned {len(correlations)} correlated critical alerts")
        return correlations
        
    except Exception as e:
        logger.error(f"Error getting critical alerts: {str(e)}")
        raise

@router.get("/statistics")
async def get_dashboard_statistics(
    hours: int = Query(24, ge=1, le=168),
    current_user: User = Depends(get_current_user)
):
    """Obter estatísticas do dashboard"""
    
    try:
        elastic = ElasticIntegration()
        tenable = TenableIntegration()
        defender = DefenderIntegration()
        opencti = OpenCTIIntegration()
        
        # Buscar dados
        elastic_alerts = await elastic.get_critical_alerts(hours=hours)
        tenable_vulns = tenable.get_critical_vulnerabilities(days=hours//24 or 1)
        defender_alerts = await defender.get_critical_alerts(hours=hours)
        opencti_indicators = opencti.get_critical_indicators(days=hours//24 or 1)
        
        await elastic.close()
        
        # Calcular estatísticas
        stats = {
            "total_critical_alerts": len(elastic_alerts) + len(defender_alerts),
            "total_vulnerabilities": len(tenable_vulns),
            "total_threat_indicators": len(opencti_indicators),
            "critical_count": sum(1 for a in elastic_alerts if a.get("severity") == "critical"),
            "high_count": sum(1 for a in elastic_alerts if a.get("severity") == "high"),
            "exploitable_vulns": sum(1 for v in tenable_vulns if v.get("exploit_available")),
            "sources_status": {
                "elasticsearch": "active" if elastic_alerts is not None else "error",
                "tenable": "active" if tenable_vulns is not None else "error",
                "defender": "active" if defender_alerts is not None else "error",
                "opencti": "active" if opencti_indicators is not None else "error"
            }
        }
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting statistics: {str(e)}")
        raise

@router.get("/timeline")
async def get_threat_timeline(
    hours: int = Query(24, ge=1, le=168),
    current_user: User = Depends(get_current_user)
):
    """Obter timeline de ameaças"""
    
    try:
        elastic = ElasticIntegration()
        defender = DefenderIntegration()
        
        elastic_alerts = await elastic.get_critical_alerts(hours=hours)
        defender_alerts = await defender.get_critical_alerts(hours=hours)
        
        await elastic.close()
        
        # Combinar e ordenar eventos por timestamp
        all_events = []
        
        for alert in elastic_alerts:
            all_events.append({
                "timestamp": alert.get("timestamp"),
                "source": "elastic",
                "severity": alert.get("severity"),
                "title": alert.get("title"),
                "asset": alert.get("asset")
            })
        
        for alert in defender_alerts:
            all_events.append({
                "timestamp": alert.get("timestamp"),
                "source": "defender",
                "severity": alert.get("severity"),
                "title": alert.get("title"),
                "asset": alert.get("asset")
            })
        
        # Ordenar por timestamp
        all_events.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        return all_events[:100]  # Limitar a 100 eventos
        
    except Exception as e:
        logger.error(f"Error getting timeline: {str(e)}")
        raise
