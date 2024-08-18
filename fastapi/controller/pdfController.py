from fastapi import Response
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from io import BytesIO
from controller.services import get_process_by_numprocess_db
from controller.audioController import get_audios_by_process_id_db
from sqlalchemy.orm import Session
from reportlab.lib.units import mm

import os

import controller.trainedModelsController as trainedModelsController

def format_num_process(num_process: str) -> str:
    return f"{num_process[:7]}-{num_process[7:9]}.{num_process[9:13]}.{num_process[13:14]}.{num_process[14:16]}.{num_process[16:]}"

def add_page_number(canvas, doc):
    page_num = canvas.getPageNumber()
    text = f"{page_num}"
    canvas.drawRightString(200 * mm, 15 * mm, text)  # Adiciona o número da página no canto inferior direito

def create_pdf(process, audios: list, db):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)

    elements = []

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Title'],
        fontSize=16,
        fontName='Helvetica-Bold',
        alignment=1
    )
    label_style = ParagraphStyle(
        'Label',
        parent=styles['Normal'],
        fontSize=12,
        fontName='Helvetica-Bold',
        spaceAfter=10
    )
    normal_style = ParagraphStyle(
        'Normal',
        parent=styles['Normal'],
        fontSize=12,
        fontName='Helvetica',
        spaceAfter=10
    )
    tab_style = ParagraphStyle(
        'Tab',
        parent=styles['Normal'],
        fontSize=12,
        fontName='Helvetica',
        leftIndent=40,
        spaceAfter=5
    )

    # Adicionando o cabeçalho com o logo e o título

    logo_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'tre-pb-icon.png')
    logo_path = os.path.abspath(logo_path)

    logo = Image(logo_path, width=50, height=50)
    
    uIAra_style = ParagraphStyle(
        'uIAra',
        parent=styles['Title'],
        fontSize=24,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#1B305A'),
        alignment=2
    )
    
    uIAra = Paragraph("uIAra", uIAra_style)
    
    header_table = Table([[logo, uIAra]], colWidths=[20, 455])
    header_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (0, 0), 0),
        ('RIGHTPADDING', (1, 0), (1, 0), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT')
    ]))
    
    elements.append(header_table)
    elements.append(Spacer(1, 40))  

    report_title = Paragraph(f"Análise Técnica do Processo '{process.title}'", title_style)
    elements.append(report_title)
    elements.append(Paragraph("<br/><br/>", normal_style))

    formatted_num_process = format_num_process(process.num_process)
    elements.append(Paragraph(f"Processo Nº: {formatted_num_process}", label_style))
    elements.append(Paragraph(f"Responsável: {process.responsible}", normal_style))
    elements.append(Paragraph("<br/><br/>", normal_style))

    for i, audio in enumerate(audios):
        model_version_id = audio['trained_model_id']
        model_version = trainedModelsController.get_model_by_id(model_version_id, db)

        elements.append(Paragraph(f"Áudio {i + 1}:", label_style))
        elements.append(Paragraph(f"Nome: {audio['title']}", tab_style))
        
        resultado = "Voz Humana" if audio['classification'] else "Voz Sintética"
        elements.append(Paragraph(f"Resultado da Análise: {resultado}", tab_style))
        
        elements.append(Paragraph(f"Versão do Modelo: {model_version.version}", tab_style))
        
        accuracy = f"{audio['accuracy']:.2f}%"
        elements.append(Paragraph(f"Acurácia: {accuracy}", tab_style))
        
        duration = f"{audio['audio_duration']:.2f} segundos"
        elements.append(Paragraph(f"Duração do Áudio: {duration}", tab_style))
        
        sample_rate = f"{audio['sample_rate']} Hz"
        elements.append(Paragraph(f"Taxa de Amostragem: {sample_rate}", tab_style))
        
        snr = f"{audio['snr']:.2f} dB"
        elements.append(Paragraph(f"Razão Sinal-Ruído (SNR): {snr}", tab_style))
        
        elements.append(Paragraph(f"Data de Criação do Áudio: {audio['created_at'].strftime('%d/%m/%Y %H:%M:%S')}", tab_style))
        elements.append(Paragraph("<br/><br/>", normal_style))
    
    doc.build(elements, onFirstPage=add_page_number, onLaterPages=add_page_number)
    
    buffer.seek(0)
    return buffer

def generate_pdf_file(num_process: str, db: Session):
    process = get_process_by_numprocess_db(num_process, db)
    audios = get_audios_by_process_id_db(process.id, db)

    pdf_buffer = create_pdf(process, audios, db)
    
    headers = {
        'Content-Disposition': f'attachment; filename="process_{num_process}.pdf"',
        'Content-Type': 'application/pdf',
    }

    return Response(pdf_buffer.getvalue(), media_type='application/pdf', headers=headers)