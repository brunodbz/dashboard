from tenable.io import TenableIO
from typing import List, Dict, Any
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class TenableIntegration:
    def __init__(self):
        self.client = TenableIO(
            access_key=settings.TENABLE_ACCESS_KEY,
            secret_key=settings.TENABLE_SECRET_KEY
        )
    
    def get_critical_vulnerabilities(self, days: int = 7) -> List[Dict[str, Any]]:
        """Busca vulnerabilidades críticas e de alta severidade"""
        try:
            # Filtro para severidade Critical (4) e High (3)
            vulnerabilities = self.client.exports.vulns(
                severity=['critical', 'high'],
                num_assets=1000
            )
            
            critical_vulns = []
            for vuln in vulnerabilities:
                # Filtrar por CVSS >= 7.0 ou VPR >= 7.0
                cvss_score = vuln.get('cvss3_base_score', vuln.get('cvss_base_score', 0))
                vpr_score = vuln.get('vpr_score', 0)
                
                if cvss_score >= settings.CVSS_HIGH_THRESHOLD or vpr_score >= 7.0:
                    critical_vulns.append({
                        "id": f"tenable_{vuln.get('plugin_id')}_{vuln.get('asset', {}).get('uuid', '')}",
                        "source": "tenable",
                        "severity": vuln.get('severity', 'unknown'),
                        "title": vuln.get('plugin_name', 'Unknown Vulnerability'),
                        "description": vuln.get('plugin_description', ''),
                        "asset": vuln.get('asset', {}).get('fqdn') or vuln.get('asset', {}).get('ipv4'),
                        "cvss_score": cvss_score,
                        "vpr_score": vpr_score,
                        "exploit_available": vuln.get('exploit_available', False),
                        "cve": vuln.get('cve', []),
                        "timestamp": vuln.get('last_found'),
                        "raw_data": vuln
                    })
            
            logger.info(f"Retrieved {len(critical_vulns)} critical vulnerabilities from Tenable")
            return critical_vulns
            
        except Exception as e:
            logger.error(f"Error fetching Tenable vulnerabilities: {str(e)}")
            return []
    
    def get_asset_exposure_scores(self) -> Dict[str, float]:
        """Obtém scores de exposição de ativos"""
        try:
            assets = self.client.exports.assets()
            
            exposure_scores = {}
            for asset in assets:
                asset_id = asset.get('fqdn', [asset.get('ipv4', ['unknown'])[0]])[0]
                exposure_score = asset.get('exposure_score', 0)
                if exposure_score:
                    exposure_scores[asset_id] = exposure_score
            
            return exposure_scores
            
        except Exception as e:
            logger.error(f"Error fetching asset exposure scores: {str(e)}")
            return {}
