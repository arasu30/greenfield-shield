import os
import tempfile
from datetime import datetime
from fpdf import FPDF

class CropReportPDF(FPDF):
    def header(self):
        # Logo placeholder or branding
        self.set_font('helvetica', 'B', 20)
        self.set_text_color(30, 58, 138) # Dark blue
        self.cell(0, 10, 'CropSure Health Report', ln=True, align='C')
        self.set_font('helvetica', 'I', 10)
        self.set_text_color(100, 116, 139) # Slate
        self.cell(0, 10, f'Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', ln=True, align='C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 10, f'Page {self.page_no()} | AI-Powered Agriculture Resilience', align='C')

def generate_crop_report_pdf(assessment_data: dict) -> str:
    """
    Generates a PDF report from assessment data.
    
    Args:
        assessment_data: dict containing farm_id, farm_name, crop_type, 
                         area_acres, damage_prediction, nasnet_predictions, etc.
    
    Returns:
        Path to the generated temporary PDF file.
    """
    pdf = CropReportPDF()
    pdf.add_page()
    
    # Farm Information Section
    pdf.set_font('helvetica', 'B', 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, 'Farm Details', ln=True)
    pdf.line(pdf.get_x(), pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)
    
    pdf.set_font('helvetica', '', 11)
    pdf.cell(50, 8, 'Farm Name:', border=0)
    pdf.set_font('helvetica', 'B', 11)
    pdf.cell(0, 8, str(assessment_data.get('farm_name', 'N/A')), ln=True)
    
    pdf.set_font('helvetica', '', 11)
    pdf.cell(50, 8, 'Crop Type:', border=0)
    pdf.set_font('helvetica', 'B', 11)
    pdf.cell(0, 8, str(assessment_data.get('crop_type', 'N/A')), ln=True)
    
    pdf.set_font('helvetica', '', 11)
    pdf.cell(50, 8, 'Total Area:', border=0)
    pdf.set_font('helvetica', 'B', 11)
    pdf.cell(0, 8, f"{assessment_data.get('area_acres', 0.0):.2f} Acres", ln=True)
    
    pdf.ln(10)
    
    # Analysis Summary Section
    pdf.set_font('helvetica', 'B', 14)
    pdf.cell(0, 10, 'Assessment Summary', ln=True)
    pdf.line(pdf.get_x(), pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)
    
    damage_pred = assessment_data.get('damage_prediction', 0)
    status_text = "DAMAGE DETECTED" if damage_pred == 1 else "HEALTHY / NO SIGNIFICANT DAMAGE"
    status_color = (220, 38, 38) if damage_pred == 1 else (22, 163, 74) # Red or Green
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(*status_color)
    pdf.cell(0, 10, f"Status: {status_text}", ln=True)
    pdf.set_text_color(0, 0, 0)
    
    pdf.ln(5)
    pdf.set_font('helvetica', '', 11)
    pdf.multi_cell(0, 8, assessment_data.get('message', 'No specific message provided.'))
    
    pdf.ln(10)
    
    # Satellite Data / AI Insights
    pdf.set_font('helvetica', 'B', 14)
    pdf.cell(0, 10, 'AI Insights & Satellite Analysis', ln=True)
    pdf.line(pdf.get_x(), pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)
    
    nasnet_results = assessment_data.get('nasnet_predictions', [])
    if nasnet_results:
        pdf.set_font('helvetica', 'B', 11)
        pdf.cell(0, 8, 'Detailed Damage Classifications (AI Vision):', ln=True)
        pdf.set_font('helvetica', '', 10)
        for res in nasnet_results:
            label = res.get('label', 'Unknown')
            prob = res.get('probability', 0.0)
            desc = res.get('description', '')
            pdf.cell(0, 7, f"- {label}: {prob:.1%} confidence", ln=True)
            if desc:
                pdf.set_x(pdf.get_x() + 5)
                pdf.set_font('helvetica', 'I', 9)
                pdf.multi_cell(0, 6, desc)
                pdf.set_font('helvetica', '', 10)
    else:
        pdf.set_font('helvetica', 'I', 11)
        pdf.cell(0, 8, 'No detailed visual analysis available for this report.', ln=True)
    
    pdf.ln(10)
    
    # Disclaimer
    pdf.set_y(-40)
    pdf.set_font('helvetica', 'I', 8)
    pdf.set_text_color(100, 116, 139)
    disclaimer = ("Disclaimer: This report is generated using AI analysis of satellite imagery. "
                  "Results should be used as a supplementary tool and verified with ground assessment "
                  "whenever possible. CropSure is not liable for decisions made solely based on this report.")
    pdf.multi_cell(0, 4, disclaimer, align='C')
    
    # Save to temp file
    temp_dir = tempfile.gettempdir()
    filename = f"crop_report_{assessment_data.get('farm_id', 'unknown')}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    file_path = os.path.join(temp_dir, filename)
    
    pdf.output(file_path)
    return file_path
