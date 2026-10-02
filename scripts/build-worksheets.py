"""Build the three printable worksheets shipped with the Prompt builder."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'downloads'
OUT.mkdir(exist_ok=True)
pdfmetrics.registerFont(TTFont('Chinese', '/Library/Fonts/Arial Unicode.ttf'))
W, H = A4
LEFT, RIGHT = 36, W - 36
WIDTH = RIGHT - LEFT
INK = HexColor('#1b2027')
MUTED = HexColor('#626872')
LINE = HexColor('#c9cdd2')
GOLD = HexColor('#987238')
PALE = HexColor('#f4f1ea')
BODY = ParagraphStyle('body', fontName='Chinese', fontSize=9, leading=14,
                      textColor=INK, wordWrap='CJK')


def text(c, x, y, value, size=10, color=INK):
    c.setFillColor(color)
    c.setFont('Chinese', size)
    c.drawString(x, y, value)


def paragraph(c, x, top, width, value, size=9, color=INK):
    style = ParagraphStyle('p', parent=BODY, fontSize=size, leading=size + 5,
                           textColor=color)
    p = Paragraph(escape(value), style)
    _, height = p.wrap(width, 1000)
    p.drawOn(c, x, top - height)
    return height


def base(filename, title, code, subtitle):
    c = canvas.Canvas(str(OUT / filename), pagesize=A4)
    c.setTitle(title + ' | witflow 威特流')
    c.setAuthor('witflow 威特流')
    text(c, LEFT, H - 43, 'witflow 威特流', 15)
    text(c, RIGHT - 122, H - 42, code, 9, GOLD)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.line(LEFT, H - 58, RIGHT, H - 58)
    text(c, LEFT, H - 94, title, 24)
    paragraph(c, LEFT, H - 111, WIDTH, subtitle, 10, MUTED)
    c.setStrokeColor(LINE)
    c.setLineWidth(.5)
    c.line(LEFT, 48, RIGHT, 48)
    text(c, LEFT, 32, 'witflow.trade  /  外贸实战工作表', 8, MUTED)
    text(c, RIGHT - 135, 32, 'v1.0 · 2026-10-02 · 1 / 1', 8, MUTED)
    return c


def field(c, x, y, label, width):
    text(c, x, y, label, 9, MUTED)
    c.setStrokeColor(LINE)
    c.line(x, y - 22, x + width, y - 22)


def table(c, top, widths, headers, rows, height):
    x = LEFT
    c.setFillColor(PALE)
    c.rect(LEFT, top - 29, WIDTH, 29, fill=1, stroke=0)
    for width, header in zip(widths, headers):
        text(c, x + 8, top - 19, header, 9)
        x += width
    bottom = top - 29 - len(rows) * height
    c.setLineWidth(.5)
    c.setStrokeColor(LINE)
    c.rect(LEFT, bottom, WIDTH, top - bottom, stroke=1, fill=0)
    x = LEFT
    for width in widths[:-1]:
        x += width
        c.line(x, top, x, bottom)
    c.line(LEFT, top - 29, RIGHT, top - 29)
    for i, row in enumerate(rows):
        row_top = top - 29 - i * height
        x = LEFT
        for width, cell in zip(widths, row):
            if cell:
                used = paragraph(c, x + 8, row_top - 8, width - 16, cell)
                assert used < height - 12, f'Cell overflows: {cell}'
            x += width
        c.line(LEFT, row_top - height, RIGHT, row_top - height)
    return bottom


def notes(c, top, title, prompt, lines=2):
    text(c, LEFT, top, title, 11)
    paragraph(c, LEFT, top - 13, WIDTH, prompt, 8, MUTED)
    c.setStrokeColor(LINE)
    for i in range(lines):
        y = top - 48 - i * 27
        c.line(LEFT, y, RIGHT, y)


c = base('pre-quote-clarification.pdf', '报价前澄清清单', '01 / CLARIFICATION',
         '先记录客户要求与原文依据，再确认负责人和回复。未收到确认的事项继续保留在清单中。')
field(c, LEFT, 678, '客户／项目', 240)
field(c, LEFT + 270, 678, '产品／询盘编号', WIDTH - 270)
field(c, LEFT, 628, '整理人／日期', 240)
field(c, LEFT + 270, 628, '资料版本／来源', WIDTH - 270)
widths = [84, 190, 169, WIDTH - 443]
rows = [
    ['产品与规格', '型号、材质、尺寸、公差及使用条件', '', ''],
    ['数量与计划', '首单数量、批次安排、后续预测', '', ''],
    ['测试与认证', '依据、适用范围、机构及费用承担方', '', ''],
    ['包装与标识', '包装方式、标签、运输限制', '', ''],
    ['交期与交付', '交期起算点、交货地点、贸易条件', '', ''],
    ['检验与文件', '验货安排、验收标准、所需单证', '', ''],
    ['付款与币种', '付款比例、时间基准、币种与主体', '', ''],
    ['履约条款', '客户原文中的责任、赔偿或罚则', '', ''],
    ['报价范围', '包含项、排除项、有效期与假设', '', '']
]
bottom = table(c, 588, widths, ['检查项目', '要确认什么', '客户要求／原文位置', '负责人／状态'], rows, 40)
notes(c, bottom - 25, '报价前仍需确认的关键事项',
      '记录待确认项、下一步负责人和回复期限；技术、付款及合同条件由相应负责人审核。', 2)
c.save()

c = base('negotiation-planner.pdf', '谈判筹码表', '02 / NEGOTIATION',
         '把每个可讨论选项写清楚。区分客户请求、我方边界与批准状态，避免把待评估项写成承诺。')
field(c, LEFT, 678, '客户／产品／报价编号', 240)
field(c, LEFT + 270, 678, '整理人／日期', WIDTH - 270)
field(c, LEFT, 628, '客户目标（注明币种、单位、数量）', WIDTH)
widths = [70, 146, 153, WIDTH - 369]
rows = [
    ['价格', '', '', ''], ['订单数量', '', '', ''], ['交期／批次', '', '', ''],
    ['规格／包装', '', '', ''], ['付款条件', '', '', ''], ['其他条件', '', '', '']
]
bottom = table(c, 588, widths,
               ['筹码', '客户请求／可交换条件', '我方边界／成本待核实项', '确认人／批准状态'], rows, 49)
notes(c, bottom - 27, '本次沟通方案',
      '列出已获批准的方案与对应前提；客户需提供什么？我方还需谁确认？', 2)
notes(c, 133, '下一步', '负责人、联系时间、需要补充的资料或内部审批。', 1)
c.save()

c = base('quote-follow-up.pdf', '报价后跟进记录表', '03 / FOLLOW-UP',
         '每次联系围绕一个具体问题。记录事实与下一步日期，按客户节奏调整；不设置虚假的期限。')
field(c, LEFT, 678, '客户／联系人', 240)
field(c, LEFT + 270, 678, '产品／报价编号', WIDTH - 270)
field(c, LEFT, 628, '报价日期／有效期', 240)
field(c, LEFT + 270, 628, '当前阶段／负责人', WIDTH - 270)
widths = [67, 68, 117, 151, WIDTH - 403]
rows = [['', '', '', '', ''] for _ in range(7)]
bottom = table(c, 588, widths,
               ['联系日期', '渠道／人员', '本次目的', '客户反馈／已确认事实', '下一步／日期'], rows, 48)
notes(c, bottom - 27, '当前待解决的问题',
      '如规格、预算或项目时间表尚不明确，请标记为待确认；客户要求暂停联系时记录其要求。', 2)
paragraph(c, LEFT, 99, WIDTH,
          '沟通参考：确认收到 → 澄清问题或提供已核实选项 → 确认项目进度与下次联系时间。', 9, MUTED)
c.save()
print('Generated 3 one-page PDFs in', OUT)
