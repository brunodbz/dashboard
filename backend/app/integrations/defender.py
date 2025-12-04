from azure.identity import ClientSecretCredential
from msgraph.core import GraphClient
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.config import settings
import logging
import httpx

logger = logging.getLogger(__name__)

class DefenderIntegration:
    def __init__(self):
        self.credential = ClientSecretCredential(
            tenant_id=settings.DEFENDER_TENANT_ID,
            client_id=settings.DEFENDER_CLIENT_ID,
            client_secret=settings.DEFENDER_CLIENT_SECRET
        )
        self.graph_client = GraphClient(credential=self.credential)
        self.security_endpoint = "https://graph.microsoft.com/v1.0/security"
    
    async def get_critical_alerts(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Busca alertas críticos e de alta severidade do Microsoft Defender"""
        try:
            # Buscar token de acesso
            token = self.credential.get_token("https://graph.microsoft.com/.default")
            headers = {"Authorization": f"Bearer {token.token}"}
            
            # Calcular timestamp
            start_time = (datetime.utcnow() - timedelta(hours=hours)).isoformat() + "Z"
            
            # Query para alertas de alta severidade
            params = {
                "$filter": f"createdDateTime ge {start_time} and (severity eq 'high' or severity eq 'critical')",
                "$top": 1000,
                "$orderby": "createdDateTime desc"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.security_endpoint}/alerts_v2",
                    headers=headers,
                    params=params
                )
                response.raise_for_status()
                data = response.json()
            
            alerts = []
            for alert in data.get('value', []):
                alerts.append({
                    "id": f"defender_{alert.get('id')}",
                    "source": "defender",
                    "severity": alert.get('severity', 'unknown'),
                    "title": alert.get('title', 'Unknown Alert'),
                    "description": alert.get('description', ''),
                    "asset": self._extract_asset(alert),
                    "category": alert.get('category', ''),
                    "mitre_techniques": alert.get('mitreTechniques', []),
                    "threat_family": alert.get('threatFamilyName', ''),
                    "timestamp": alert.get('createdDateTime'),
                    "raw_data": alert
                })
            
            logger.info(f"Retrieved {len(alerts)} critical alerts from Defender")
            return alerts
            
        except Exception as e:
            logger.error(f"Error fetching Defender alerts: {str(e)}")
            return []
    
    async def get_incidents(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Busca incidentes de alta prioridade"""
        try:
            token = self.credential.get_token("https://graph.microsoft.com/.default")
            headers = {"Authorization": f"Bearer {token.token}"}
            
            start_time = (datetime.utcnow() - timedelta(hours=hours)).isoformat() + "Z"
            
            params = {
                "$filter": f"createdDateTime ge {start_time} and (severity eq 'high' or severity eq 'critical')",
                "$top": 500
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.security_endpoint}/incidents",
                    headers=headers,
                    params=params
                )
                response.raise_for_status()
                data = response.json()
            
            return data.get('value', [])
            
        except Exception as e:
            logger.error(f"Error fetching Defender incidents: {str(e)}")
            return []
    
    def _extract_asset(self, alert: Dict) -> str:
        """Extrai identificador do ativo do alerta"""
        devices = alert.get('devices', [])
        if devices:
            return devices[0].get('deviceDnsName', devices[0].get('ipAddresses', ['unknown'])[0])
        return "unknown"
