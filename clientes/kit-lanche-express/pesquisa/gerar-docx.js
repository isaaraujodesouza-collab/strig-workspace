const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType, convertInchesToTwip,
  TableLayoutType, VerticalAlign, PageBreak
} = require("docx");
const fs = require("fs");

const md = fs.readFileSync("pesquisa-social.md", "utf8");
const lines = md.split("\n");

// Colors
const COLOR_PRIMARY = "1a2f4a";
const COLOR_ACCENT = "c9a227";
const COLOR_BG_HEADER = "1a2f4a";
const COLOR_BG_ALT = "f2f2f2";
const COLOR_WHITE = "FFFFFF";

function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1
      ? new TextRun({ text: p, bold: true })
      : new TextRun({ text: p })
  ).filter(r => r._data?.text !== "");
}

function makeHeading1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, color: COLOR_WHITE, size: 32 })],
    heading: HeadingLevel.HEADING_1,
    shading: { type: ShadingType.SOLID, color: COLOR_PRIMARY },
    spacing: { before: 400, after: 200 },
    indent: { left: convertInchesToTwip(0.1) },
  });
}

function makeHeading2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, color: COLOR_PRIMARY, size: 26 })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 120 },
    border: { bottom: { color: COLOR_ACCENT, size: 12, style: BorderStyle.SINGLE } },
  });
}

function makeHeading3(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, color: COLOR_ACCENT, size: 22 })],
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 280, after: 80 },
  });
}

function makeParagraph(text) {
  if (!text.trim()) return new Paragraph({ text: "", spacing: { after: 80 } });
  return new Paragraph({
    children: parseBold(text),
    spacing: { after: 120 },
  });
}

function makeBullet(text, level = 0) {
  const cleaned = text.replace(/^[-*] /, "").replace(/^\d+\. /, "");
  return new Paragraph({
    children: parseBold(cleaned),
    bullet: { level },
    spacing: { after: 80 },
  });
}

function makeHorizontalRule() {
  return new Paragraph({
    children: [],
    border: { bottom: { color: COLOR_ACCENT, size: 6, style: BorderStyle.SINGLE } },
    spacing: { before: 200, after: 200 },
  });
}

function makeCover() {
  return [
    new Paragraph({
      children: [new TextRun({ text: "", size: 48 })],
      spacing: { before: 1200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "ANÁLISE ESTRATÉGICA DE MERCADO", bold: true, size: 52, color: COLOR_WHITE })],
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: COLOR_PRIMARY },
      spacing: { before: 200, after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "E POSICIONAMENTO DIGITAL", bold: true, size: 52, color: COLOR_WHITE })],
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: COLOR_PRIMARY },
      spacing: { before: 0, after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Kit Lanche Express", bold: true, size: 40, color: COLOR_ACCENT })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Elaborado por Strig Lab  ·  Junho 2026", size: 24, color: "666666" })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 800 },
    }),
  ];
}

function parseTable(tableLines) {
  const rows = tableLines.filter(l => !l.match(/^\|[-: |]+\|$/));
  const tableRows = rows.map((row, rowIdx) => {
    const cells = row.split("|").filter((_, i, arr) => i > 0 && i < arr.length - 1);
    const isHeader = rowIdx === 0;
    return new TableRow({
      tableHeader: isHeader,
      children: cells.map(cell =>
        new TableCell({
          children: [
            new Paragraph({
              children: parseBold(cell.trim()),
              alignment: AlignmentType.LEFT,
              spacing: { before: 60, after: 60 },
            }),
          ],
          shading: isHeader ? { type: ShadingType.SOLID, color: COLOR_PRIMARY } : undefined,
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
        })
      ),
    });
  });

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    margins: { top: 120, bottom: 120 },
  });
}

// Parse the document
const children = [...makeCover()];
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  // Skip YAML-like metadata and empty covers
  if (line.match(/^# Análise Estratégica/)) { i++; continue; }

  // Headings
  if (line.startsWith("### ")) {
    children.push(makeHeading3(line.replace("### ", "")));
    i++; continue;
  }
  if (line.startsWith("## ")) {
    children.push(makeHeading2(line.replace("## ", "")));
    i++; continue;
  }
  if (line.startsWith("# ")) {
    children.push(makeHeading1(line.replace("# ", "")));
    i++; continue;
  }

  // Horizontal rule
  if (line.match(/^---+$/)) {
    children.push(makeHorizontalRule());
    i++; continue;
  }

  // Table detection
  if (line.startsWith("|")) {
    const tableLines = [];
    while (i < lines.length && lines[i].startsWith("|")) {
      tableLines.push(lines[i]);
      i++;
    }
    children.push(parseTable(tableLines));
    children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    continue;
  }

  // Bullet list
  if (line.match(/^[-*] /)) {
    children.push(makeBullet(line));
    i++; continue;
  }

  // Numbered list
  if (line.match(/^\d+\. /)) {
    children.push(makeBullet(line));
    i++; continue;
  }

  // Sub-bullet (indented)
  if (line.match(/^   [-*] /)) {
    children.push(makeBullet(line.trim(), 1));
    i++; continue;
  }

  // Normal paragraph / metadata lines
  children.push(makeParagraph(line));
  i++;
}

const doc = new Document({
  creator: "Strig Lab",
  title: "Análise Estratégica de Mercado — Kit Lanche Express",
  description: "Pesquisa de mercado e posicionamento digital elaborada pela Strig Lab",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22, color: "333333" },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("pesquisa-social-kit-lanche-express.docx", buffer);
  console.log("Arquivo gerado: pesquisa-social-kit-lanche-express.docx");
});
