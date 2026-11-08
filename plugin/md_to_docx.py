# -*- coding: utf-8 -*-
"""markdown → 律所模板级 .docx（A4 公文版式：页边距/仿宋三号/首行缩进/页码/可选红头）。

用法: python md_to_docx.py <input.md> <output.docx> [firmName]
"""
import sys
import re

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

BODY_FONT = "仿宋"
HEAD_FONT = "黑体"
TITLE_FONT = "方正小标宋简体"
BODY_SIZE = Pt(16)      # 三号
LINE_PT = Pt(28)        # 固定 28 磅行距


def set_run_font(run, name, size=None, bold=None, color=None):
    run.font.name = name
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    rfonts.set(qn("w:eastAsia"), name)
    rfonts.set(qn("w:ascii"), name)
    rfonts.set(qn("w:hAnsi"), name)
    if size is not None:
        run.font.size = size
    if bold is not None:
        run.bold = bold
    if color is not None:
        run.font.color.rgb = color


def add_inline(paragraph, text, size=BODY_SIZE, font=BODY_FONT, bold=False, color=None):
    parts = re.split(r"(\*\*[^*]+\*\*|`[^`]+`)", text)
    for part in parts:
        if not part:
            continue
        if part.startswith("**") and part.endswith("**") and len(part) > 4:
            run = paragraph.add_run(part[2:-2])
            set_run_font(run, font, size, True, color)
        elif part.startswith("`") and part.endswith("`") and len(part) > 2:
            run = paragraph.add_run(part[1:-1])
            set_run_font(run, "Consolas", Pt(10.5), bold, color)
        else:
            run = paragraph.add_run(part)
            set_run_font(run, font, size, bold, color)


def body_paragraph(doc, text, indent=True, size=BODY_SIZE, font=BODY_FONT, align=None, bold=False, color=None):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.line_spacing_rule = WD_LINE_SPACING.EXACTLY
    pf.line_spacing = LINE_PT
    pf.space_before = Pt(0)
    pf.space_after = Pt(0)
    if indent:
        pf.first_line_indent = Pt(size.pt * 2)
    if align is not None:
        p.alignment = align
    add_inline(p, text, size, font, bold, color)
    return p


def split_row(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def add_page_number(section):
    footer = section.footer
    p = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("— ")
    set_run_font(run, BODY_FONT, Pt(10.5))
    fld = OxmlElement("w:fldSimple")
    fld.set(qn("w:instr"), "PAGE")
    r = OxmlElement("w:r")
    t = OxmlElement("w:t")
    t.text = "1"
    r.append(t)
    fld.append(r)
    p._p.append(fld)
    run2 = p.add_run(" —")
    set_run_font(run2, BODY_FONT, Pt(10.5))


def convert(md_path, docx_path, firm_name=""):
    text = open(md_path, encoding="utf-8").read().replace("\ufeff", "")
    lines = text.replace("\r", "").split("\n")
    doc = Document()

    section = doc.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(3.7)
    section.bottom_margin = Cm(3.5)
    section.left_margin = Cm(2.8)
    section.right_margin = Cm(2.6)
    add_page_number(section)

    normal = doc.styles["Normal"]
    normal.font.name = BODY_FONT
    normal.font.size = BODY_SIZE
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), BODY_FONT)

    if firm_name:
        head = doc.add_paragraph()
        head.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = head.add_run(firm_name)
        set_run_font(run, HEAD_FONT, Pt(16), True, RGBColor(0xC0, 0x00, 0x00))

    i = 0
    in_code = False
    code_buf = []
    first_h1 = True
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith("```"):
            if in_code:
                p = body_paragraph(doc, "\n".join(code_buf), indent=False, size=Pt(10.5), font="Consolas")
                code_buf = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue
        if in_code:
            code_buf.append(line)
            i += 1
            continue
        stripped = line.strip()
        if not stripped:
            i += 1
            continue
        m = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if m:
            level = len(m.group(1))
            title = m.group(2)
            p = doc.add_paragraph()
            pf = p.paragraph_format
            pf.line_spacing_rule = WD_LINE_SPACING.EXACTLY
            pf.line_spacing = LINE_PT
            if level == 1 and first_h1:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                pf.space_before = Pt(0)
                pf.space_after = Pt(18)
                add_inline(p, title, Pt(22), TITLE_FONT, False)
                first_h1 = False
            elif level <= 2:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                pf.space_before = Pt(12)
                pf.space_after = Pt(6)
                add_inline(p, title, Pt(16), HEAD_FONT, True)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                pf.space_before = Pt(8)
                pf.space_after = Pt(4)
                add_inline(p, title, Pt(14), HEAD_FONT, True)
            i += 1
            continue
        if re.match(r"^(-{3,}|\*{3,})$", stripped):
            body_paragraph(doc, "— — —", indent=False, align=WD_ALIGN_PARAGRAPH.CENTER, color=RGBColor(0x88, 0x88, 0x88))
            i += 1
            continue
        if stripped.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip().lstrip(">").strip())
                i += 1
            p = body_paragraph(doc, "  ".join(buf), indent=False, size=Pt(12), font="楷体", color=RGBColor(0x55, 0x55, 0x55))
            p.paragraph_format.left_indent = Pt(24)
            continue
        if stripped.startswith("|") and i + 1 < len(lines) and re.match(r"^\|[\s:|-]+\|?\s*$", lines[i + 1].strip()):
            header = split_row(stripped)
            i += 2
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append(split_row(lines[i].strip()))
                i += 1
            table = doc.add_table(rows=1, cols=len(header))
            table.style = "Table Grid"
            table.alignment = WD_TABLE_ALIGNMENT.CENTER
            for idx, cell in enumerate(header):
                cell_para = table.rows[0].cells[idx].paragraphs[0]
                cell_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
                add_inline(cell_para, cell, Pt(10.5), BODY_FONT, True)
            for row in rows:
                cells = table.add_row().cells
                for idx in range(len(header)):
                    cell_para = cells[idx].paragraphs[0]
                    add_inline(cell_para, row[idx] if idx < len(row) else "", Pt(10.5), BODY_FONT)
            spacer = doc.add_paragraph()
            spacer.paragraph_format.line_spacing_rule = WD_LINE_SPACING.EXACTLY
            spacer.paragraph_format.line_spacing = Pt(8)
            continue
        if re.match(r"^[-*]\s+", stripped):
            body_paragraph(doc, "· " + re.sub(r"^[-*]\s+", "", stripped))
            i += 1
            continue
        if re.match(r"^\d+\.\s+", stripped):
            body_paragraph(doc, stripped)
            i += 1
            continue
        body_paragraph(doc, stripped)
        i += 1

    doc.save(docx_path)
    print(docx_path)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("usage: md_to_docx.py <input.md> <output.docx> [firmName]")
        sys.exit(2)
    convert(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "")
