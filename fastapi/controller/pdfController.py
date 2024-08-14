from fastapi import Response
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph
from io import BytesIO
from controller.services import get_process_by_numprocess_db
from controller.audioController import get_audios_by_process_id_db
from sqlalchemy.orm import Session

def format_num_process(num_process: str) -> str:
    return f"{num_process[:7]}-{num_process[7:9]}.{num_process[9:13]}.{num_process[13:14]}.{num_process[14:16]}.{num_process[16:]}"

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
        leftIndent=40,  # Indenta com 40 pontos
        spaceAfter=5
    )

    # Adicionando o título
    title = Paragraph(f"Análise do processo {process.title}", title_style)
    elements.append(title)
    elements.append(Paragraph("<br/><br/>", normal_style))  # Espaço após o título

    # Adicionando informações do processo
    formatted_num_process = format_num_process(process.num_process)
    elements.append(Paragraph(f"Processo: {formatted_num_process}", label_style))
    elements.append(Paragraph(f"Responsável: {process.responsible}", normal_style))
    elements.append(Paragraph(f"Data de Criação do processo: {process.created_at.strftime('%d/%m/%Y')}", normal_style))
    elements.append(Paragraph(f"Última vez atualizado: {process.updated_at.strftime('%d/%m/%Y')}", normal_style))
    elements.append(Paragraph("<br/><br/>", normal_style))  # Margem de 40 após informações do processo

    # Adicionando cada áudio e seus detalhes
    for i, audio in enumerate(audios):
        model_version = audio['trained_model_id']
        elements.append(Paragraph(f"Áudio {i+1}:", label_style))
        elements.append(Paragraph(f"Nome: {audio['title']}", tab_style))
        resultado = "Humano" if audio['classification'] else "Sintético"
        elements.append(Paragraph(f"Resultado: {resultado}", tab_style))
        elements.append(Paragraph(f"Model version: {model_version}", tab_style))
        elements.append(Paragraph(f"Acurácia: {audio['accuracy']}", tab_style))
        elements.append(Paragraph(f"Duração do áudio: {audio['audio_duration']}", tab_style))
        elements.append(Paragraph(f"Taxa de amostragem: {audio['sample_rate']}", tab_style))
        elements.append(Paragraph(f"Razão Sinal-Ruído(SNR): {audio['snr']}", tab_style))
        elements.append(Paragraph(f"Data de criação: {audio['created_at']}", tab_style))
        elements.append(Paragraph("<br/><br/>", normal_style))  # Espaço extra entre áudios

    doc.build(elements)
    
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