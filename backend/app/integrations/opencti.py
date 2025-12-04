from pycti import OpenCTIApiClient
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class OpenCTIIntegration:
    def __init__(self):
        self.client = OpenCTIApiClient(
            url=settings.OPENCTI_URL,
            token=settings.OPENCTI_TOKEN
        )
    
    def get_critical_indicators(self, days: int = 7) -> List[Dict[str, Any]]:
        """Busca indicadores de ameaça críticos e de alta confiança"""
        try:
            # Buscar indicators com alta confidence e severity
            filters = {
                "mode": "and",
                "filters": [
                    {
                        "key": "confidence",
                        "values": [str(settings.CONFIDENCE_THRESHOLD)],
                        "operator": "gte"
                    },
                    {
                        "key": "created_at",
                        "values": [(datetime.now() - timedelta(days=days)).isoformat()],
                        "operator": "gte"
                    }
                ],
                "filterGroups": []
            }
            
            indicators = self.client.indicator.list(
                filters=filters,
                first=1000
            )
            
            critical_indicators = []
            for indicator in indicators:
                # Filtrar por severity crítico ou alto
                severity = indicator.get('x_opencti_score', 0)
                confidence = indicator.get('confidence', 0)
                
                if confidence >= settings.CONFIDENCE_THRESHOLD:
                    critical_indicators.append({
                        "id": f"opencti_{indicator.get('id')}",
                        "source": "opencti",
                        "type": indicator.get('pattern_type', 'unknown'),
                        "value": indicator.get('name', ''),
                        "description": indicator.get('description', ''),
                        "confidence": confidence,
                        "score": severity,
                        "labels": indicator.get('labels', []),
                        "kill_chain_phases": indicator.get('killChainPhases', []),
                        "timestamp": indicator.get('created'),
                        "raw_data": indicator
                    })
            
            logger.info(f"Retrieved {len(critical_indicators)} critical indicators from OpenCTI")
            return critical_indicators
            
        except Exception as e:
            logger.error(f"Error fetching OpenCTI indicators: {str(e)}")
            return []
    
    def get_threats(self, days: int = 7) -> List[Dict[str, Any]]:
        """Busca threat actors e campanhas recentes"""
        try:
            filters = {
                "mode": "and",
                "filters": [
                    {
                        "key": "created_at",
                        "values": [(datetime.now() - timedelta(days=days)).isoformat()],
                        "operator": "gte"
                    }
                ],
                "filterGroups": []
            }
            
            threats = self.client.threat_actor.list(filters=filters, first=100)
            return threats
            
        except Exception as e:
            logger.error(f"Error fetching OpenCTI threats: {str(e)}")
            return []
