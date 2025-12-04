import pandas as pd
from io import BytesIO
from typing import List
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime
from app.schemas import CorrelationResult

class ExportService:
    
    @staticmethod
    def export_to_excel(correlations: List[CorrelationResult]) -> BytesIO:
        """Exporta dados de correlação para Excel"""
        
        # Preparar dados
        data = []
        for corr in correlations:
            for alert in corr.alerts:
                data.append({
                    "Asset": corr.asset,
                    "Risk Score": corr.risk_score,
                    "Alert Source": alert.source,
                    "Severity": alert.severity,
                    "Title": alert.title,
                    "Description": alert.description or "",
                    "Alert Score": alert.score,
                    "Timestamp": alert.timestamp,
                    "Vulnerability Count": corr.vulnerability_count,
                    "MITRE Techniques": ", ".join(corr.mitre_techniques),
                    "Threat Indicators": ", ".join(corr.threat_indicators)
                })
        
        df = pd.DataFrame(data)
        
        # Criar arquivo Excel em memória
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Critical Alerts', index=False)
            
            # Formatar planilha
            worksheet = writer.sheets['Critical Alerts']
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(cell.value)
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        output.seek(0)
        return output
    
    @staticmethod
    def export_to_pdf(correlations: List[CorrelationResult]) -> BytesIO:
        """Exporta dados de correlação para PDF"""
        
        output = BytesIO()
        doc = SimpleDocTemplate(output, pagesize=landscape(A4))
        elements = []
        styles = getSampleStyleSheet()
        
        # Título
        title = Paragraph(f"<b>SOC Dashboard - Critical Alerts Report</b><br/>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 20))
        
        # Tabela de dados
        table_data = [["Asset", "Risk Score", "Alerts", "Vulns", "MITRE Techniques"]]
        
        for corr in correlations[:50]:  # Limitar a 50 para caber no PDF
            table_data.append([
                corr.asset,
                str(corr.risk_score),
                str(len(corr.alerts)),
                str(corr.vulnerability_count),
                ", ".join(corr.mitre_techniques[:3]) if corr.mitre_techniques else "N/A"
            ])
        
        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        doc.build(elements)
        
        output.seek(0)
        return output
