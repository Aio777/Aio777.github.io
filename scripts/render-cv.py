from html import escape
import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate

ROOT = Path(__file__).resolve().parents[1]
CV = json.loads((ROOT / "src/data/cv.json").read_text(encoding="utf-8"))
OUTPUT = ROOT / "public/cv/aryan-lokesh-cv.pdf"
INK = colors.HexColor("#18212b")
MUTED = colors.HexColor("#495461")
styles = {
    "name": ParagraphStyle("Name", fontName="Helvetica-Bold", fontSize=21, leading=24, alignment=TA_CENTER, textColor=INK),
    "title": ParagraphStyle("Title", fontName="Helvetica", fontSize=10.5, leading=14, alignment=TA_CENTER, textColor=INK),
    "contact": ParagraphStyle("Contact", fontName="Helvetica", fontSize=8.5, leading=11, alignment=TA_CENTER, textColor=MUTED),
    "section": ParagraphStyle("Section", fontName="Helvetica-Bold", fontSize=10, leading=12, spaceBefore=7, spaceAfter=3, textColor=INK, keepWithNext=True),
    "body": ParagraphStyle("Body", fontName="Helvetica", fontSize=9.4, leading=11.5, spaceAfter=2, textColor=INK),
    "project": ParagraphStyle("Project", fontName="Helvetica-Bold", fontSize=9.8, leading=12, spaceBefore=5, spaceAfter=1, textColor=INK, keepWithNext=True),
    "context": ParagraphStyle("Context", fontName="Helvetica-Oblique", fontSize=8.8, leading=10.5, spaceAfter=2, textColor=MUTED, keepWithNext=True),
    "bullet": ParagraphStyle("Bullet", fontName="Helvetica", fontSize=9.4, leading=11.5, leftIndent=8, firstLineIndent=-8, spaceAfter=1.5, textColor=INK),
}
story = []


def paragraph(text, style="body"):
    return Paragraph(text, styles[style])


def section(title):
    story.append(paragraph(title.upper(), "section"))
    story.append(HRFlowable(width="100%", thickness=0.4, color=colors.HexColor("#bec5cc"), spaceAfter=4))


def link(contact):
    return f'<link href="{escape(contact["url"], quote=True)}">{escape(contact["label"])}</link>'


story.append(paragraph(escape(CV["name"]).upper(), "name"))
story.append(paragraph(escape(CV["title"]), "title"))
contacts = CV["contacts"]
story.append(paragraph(escape(CV["location"]) + " | " + " | ".join(link(contact) for contact in contacts[:3]), "contact"))
story.append(paragraph(" | ".join(link(contact) for contact in contacts[3:]), "contact"))
section("Profile")
story.append(paragraph(escape(CV["profile"])))
section("Education")
education = CV["education"]
story.append(paragraph(f'<b>{escape(education["degree"])}</b> | {escape(education["institution"])} | {education["period"]}'))
story.append(paragraph(escape(education["qualification"]) + ". " + escape(education["results"])))
story.append(paragraph(escape(education["earlier"])))
section("Technical skills")
for skill in CV["skills"]:
    story.append(paragraph(f'<b>{escape(skill["label"])}:</b> {escape(skill["text"])}'))
section("Selected university projects")
for project in CV["projects"]:
    block = [
        paragraph(f'<link href="https://aryanlokesh.me/work/{project["slug"]}/">{escape(project["name"])}</link> | {project["period"]}', "project"),
        paragraph(escape(project["context"]), "context"),
    ]
    block.extend(paragraph("- " + escape(bullet), "bullet") for bullet in project["bullets"])
    story.append(KeepTogether(block))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
document = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=33, leftMargin=33, topMargin=28, bottomMargin=28, title="Aryan Lokesh - CV", author=CV["name"], subject="Graduate software and AI engineer")


def check_page(canvas, document):
    if document.page > 1:
        raise ValueError("CV exceeds one page; revise layout before publishing.")


document.build(story, onFirstPage=check_page, onLaterPages=check_page)
print(OUTPUT)
