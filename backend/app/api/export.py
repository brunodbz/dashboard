from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from app.auth import get_current_user
from app.models import User
from app.integrations.elastic import ElasticIntegration
from app.integrations.tenable import TenableIntegration
from app.integrations.defender import DefenderIntegration
from app.integrations.opencti import OpenCTIIntegration
from app.services.correlation import CorrelationEngine
from app.services.export_service import ExportService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/excel")
async def export_to_excel(
    hours: int = Query(24, ge=1, le=168),
    current_user: User = Depends(get_current_user)
):
    """Exportar dados para Excel"""
    
    try:
        # Buscar dados correlacionados
        elastic = ElasticIntegration()
        tenable = TenableIntegration()
        defender = DefenderIntegration()
        opencti = OpenCTIIntegration()
        
        elastic_alerts = await elastic.get_critical_alerts(hours=hours)
        tenable_vulns = tenable.get_critical_vulnerabilities(days=hours//24 or 1)
        defender_alerts = await defender.get_critical_alerts(hours=hours)
        opencti_indicators = opencti.get_critical_indicators(days=hours//24 or 1)
        
        await elastic.close()
        
        correlation_engine = CorrelationEngine()
        correlations = correlation_engine.correlate_events(
            elastic_alerts=elastic_alerts,
            tenable_vulns=tenable_vulns,
            defender_alerts=defender_alerts,
            opencti_indicators=opencti_indicators
        )
        
        # Gerar arquivo Excel
        excel_file = ExportService.export_to_excel(correlations)
        
        return StreamingResponse(
            excel_file,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=soc_critical_alerts.xlsx"}
        )
        
    except Exception as e:
        logger.error(f"Error exporting to Excel: {str(e)}")
        raise

@router.get("/pdf")
async def export_to_pdf(
    hours: int = Query(24, ge=1, le=168),
    current_user: User = Depends(get_current_user)
):
    """Exportar dados para PDF"""
    
    try:
        # Buscar dados correlacionados
        elastic = ElasticIntegration()
        tenable = TenableIntegration()
        defender = DefenderIntegration()
        opencti = OpenCTIIntegration()
        
        elastic_alerts = await elastic.get_critical_alerts(hours=hours)
        tenable_vulns = tenable.get_critical_vulnerabilities(days=hours//24 or 1)
        defender_alerts = await defender.get_critical_alerts(hours=hours)
        opencti_indicators = opencti.get_critical_indicators(days=hours//24 or 1)
        
        await elastic.close()
        
        correlation_engine = CorrelationEngine()
        correlations = correlation_engine.correlate_events(
            elastic_alerts=elastic_alerts,
            tenable_vulns=tenable_vulns,
            defender_alerts=defender_alerts,
            opencti_indicators=opencti_indicators
        )
        
        # Gerar arquivo PDF
        pdf_file = ExportService.export_to_pdf(correlations)
        
        return StreamingResponse(
            pdf_file,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=soc_critical_alerts.pdf"}
        )
        
    except Exception as e:
        logger.error(f"Error exporting to PDF: {str(e)}")
        raise
