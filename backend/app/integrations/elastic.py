from elasticsearch import AsyncElasticsearch
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class ElasticIntegration:
    def __init__(self):
        self.client = AsyncElasticsearch(
            [settings.ELASTICSEARCH_URL],
            basic_auth=(settings.ELASTICSEARCH_USERNAME, settings.ELASTICSEARCH_PASSWORD) if settings.ELASTICSEARCH_USERNAME else None
        )
    
    async def get_critical_alerts(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Busca alertas críticos e de alta severidade do Elastic SIEM"""
        try:
            query = {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "@timestamp": {
                                        "gte": f"now-{hours}h",
                                        "lte": "now"
                                    }
                                }
                            }
                        ],
                        "should": [
                            {"match": {"event.severity": "critical"}},
                            {"match": {"event.severity": "high"}},
                            {"range": {"event.risk_score": {"gte": settings.RISK_SCORE_HIGH_THRESHOLD}}},
                            {"match": {"host.risk.calculated_level": "Critical"}},
                            {"match": {"host.risk.calculated_level": "High"}},
                            {"match": {"user.risk.calculated_level": "Critical"}},
                            {"match": {"user.risk.calculated_level": "High"}}
                        ],
                        "minimum_should_match": 1
                    }
                },
                "size": 1000,
                "sort": [{"event.risk_score": {"order": "desc"}}]
            }
            
            response = await self.client.search(
                index="logs-*,alerts-*",
                body=query
            )
            
            alerts = []
            for hit in response['hits']['hits']:
                source = hit['_source']
                alerts.append({
                    "id": hit['_id'],
                    "source": "elastic",
                    "severity": source.get('event', {}).get('severity', 'unknown'),
                    "title": source.get('rule', {}).get('name', 'Unknown Alert'),
                    "description": source.get('message', ''),
                    "asset": source.get('host', {}).get('name', source.get('source', {}).get('ip')),
                    "risk_score": source.get('event', {}).get('risk_score', 0),
                    "timestamp": source.get('@timestamp'),
                    "raw_data": source
                })
            
            logger.info(f"Retrieved {len(alerts)} critical alerts from Elastic")
            return alerts
            
        except Exception as e:
            logger.error(f"Error fetching Elastic alerts: {str(e)}")
            return []
    
    async def get_host_risk_scores(self) -> Dict[str, int]:
        """Obtém risk scores de hosts"""
        try:
            query = {
                "query": {"match_all": {}},
                "size": 1000,
                "aggs": {
                    "hosts": {
                        "terms": {"field": "host.name.keyword", "size": 1000},
                        "aggs": {
                            "max_risk": {"max": {"field": "host.risk.calculated_score_norm"}}
                        }
                    }
                }
            }
            
            response = await self.client.search(
                index="risk-score.risk-score-*",
                body=query
            )
            
            risk_scores = {}
            for bucket in response.get('aggregations', {}).get('hosts', {}).get('buckets', []):
                host = bucket['key']
                score = bucket.get('max_risk', {}).get('value', 0)
                if score:
                    risk_scores[host] = int(score)
            
            return risk_scores
            
        except Exception as e:
            logger.error(f"Error fetching host risk scores: {str(e)}")
            return {}
    
    async def close(self):
        await self.client.close()
