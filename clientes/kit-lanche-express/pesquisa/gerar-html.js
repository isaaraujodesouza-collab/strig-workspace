const fs = require('fs');
const path = require('path');

const md = fs.readFileSync(path.join(__dirname, 'pesquisa-social.md'), 'utf8');
const lines = md.split('\n');

// Inline styles em TODOS os elementos — Google Docs ignora <style>, só lê style=""
const FONT = 'Poppins,sans-serif';
const S = {
  h1:  `font-family:${FONT};font-size:20pt;font-weight:700;color:#000000;`,
  h2:  `font-family:${FONT};font-size:15pt;font-weight:700;color:#333333;`,
  h3:  `font-family:${FONT};font-size:12pt;font-weight:700;color:#666666;`,
  h4:  `font-family:${FONT};font-size:11pt;font-weight:700;color:#999999;`,
  p:   `font-family:${FONT};font-size:11pt;color:#000000;`,
  li:  `font-family:${FONT};font-size:11pt;color:#000000;`,
  th:  `font-family:${FONT};font-size:9pt;font-weight:700;color:#ffffff;background-color:#000000;padding:7px 10px;text-align:left;`,
  td:  `font-family:${FONT};font-size:9pt;color:#000000;background-color:#efefef;padding:6px 10px;vertical-align:top;`,
  bq:  `font-family:${FONT};font-size:11pt;color:#000000;font-style:italic;`,
  meta:`font-family:${FONT};font-size:10pt;color:#666666;`,
};

// CSS de fallback pra visualização no browser (não afeta Google Docs)
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  body { font-family: 'Poppins', sans-serif; font-size: 11pt; color: #000; line-height: 1.65; }
  h1 { font-size: 20pt; font-weight: 700; color: #000; margin: 36px 0 12px; }
  h2 { font-size: 15pt; font-weight: 700; color: #333333; border-bottom: 2px solid #000; margin: 32px 0 10px; padding-bottom: 5px; }
  h3 { font-size: 12pt; font-weight: 700; color: #666666; margin: 22px 0 8px; }
  h4 { font-size: 11pt; font-weight: 700; color: #999999; margin: 16px 0 6px; }
  p { margin: 0 0 10px; }
  ul, ol { margin: 0 0 10px; padding-left: 24px; }
  li { margin-bottom: 4px; }
  table { border-collapse: collapse; width: 100%; margin: 14px 0; }
  blockquote { border-left: 4px solid #000; margin: 14px 0; padding: 10px 18px; background: #f5f5f5; font-style: italic; }
  blockquote p { margin: 0; }
  hr { border: none; border-top: 1px solid #ccc; margin: 22px 0; }
  strong { font-weight: 700; }
  em { font-style: italic; }
`;

function escape(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(str) {
  str = str.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  str = str.replace(/\*(.*?)\*/g, '<em>$1</em>');
  str = str.replace(/`(.*?)`/g, '<code>$1</code>');
  str = str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return str;
}

function parseTable(tableLines) {
  const rows = tableLines.filter(l => !l.match(/^\|[-: |]+\|$/));
  if (!rows.length) return '';
  let html = '<table style="border-collapse:collapse;width:100%;margin:14px 0;">';
  rows.forEach((row, idx) => {
    const cells = row.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (idx === 0) {
      html += '<tr>' + cells.map(c => `<th style="${S.th}">${inline(c.trim())}</th>`).join('') + '</tr>';
    } else {
      html += '<tr>' + cells.map(c => `<td style="${S.td}">${inline(c.trim())}</td>`).join('') + '</tr>';
    }
  });
  html += '</table>';
  return html;
}

const output = [];
let i = 0;
let inUl = false;
let inOl = false;
let inBlockquote = false;
let coverDone = false;

function closeList() {
  if (inUl) { output.push('</ul>'); inUl = false; }
  if (inOl) { output.push('</ol>'); inOl = false; }
}

function closeBlockquote() {
  if (inBlockquote) { output.push('</blockquote>'); inBlockquote = false; }
}

while (i < lines.length) {
  const line = lines[i];

  // Table
  if (line.trim().startsWith('|')) {
    closeList(); closeBlockquote();
    const tableLines = [];
    while (i < lines.length && lines[i].trim().startsWith('|')) {
      tableLines.push(lines[i]);
      i++;
    }
    output.push(parseTable(tableLines));
    continue;
  }

  // HR
  if (line.match(/^---+$/)) {
    closeList(); closeBlockquote();
    output.push('<hr>');
    i++; continue;
  }

  // Headings — inline styles pra Google Docs
  if (line.startsWith('# ')) {
    closeList(); closeBlockquote();
    const text = inline(escape(line.replace(/^# /, '')));
    if (!coverDone) {
      output.push(`<div><h1 style="${S.h1}">${text}</h1>`);
      coverDone = true;
    } else {
      output.push(`<h1 style="${S.h1}">${text}</h1>`);
    }
    i++; continue;
  }
  if (line.startsWith('## ')) {
    closeList(); closeBlockquote();
    output.push(`<h2 style="${S.h2}">${inline(escape(line.replace(/^## /, '')))}</h2>`);
    i++; continue;
  }
  if (line.startsWith('### ')) {
    closeList(); closeBlockquote();
    output.push(`<h3 style="${S.h3}">${inline(escape(line.replace(/^### /, '')))}</h3>`);
    i++; continue;
  }
  if (line.startsWith('#### ')) {
    closeList(); closeBlockquote();
    output.push(`<h4 style="${S.h4}">${inline(escape(line.replace(/^#### /, '')))}</h4>`);
    i++; continue;
  }

  // Blockquote
  if (line.startsWith('> ')) {
    closeList();
    if (!inBlockquote) {
      output.push('<blockquote style="border-left:4px solid #000;margin:14px 0;padding:10px 18px;background:#f5f5f5;">');
      inBlockquote = true;
    }
    output.push(`<p style="${S.bq}">${inline(escape(line.replace(/^> /, '')))}</p>`);
    i++; continue;
  } else {
    closeBlockquote();
  }

  // Unordered list
  if (line.match(/^[-*] /)) {
    if (!inUl) { closeList(); output.push('<ul>'); inUl = true; }
    output.push(`<li style="${S.li}">${inline(escape(line.replace(/^[-*] /, '')))}</li>`);
    i++; continue;
  }

  // Numbered list
  if (line.match(/^\d+\. /)) {
    if (!inOl) { closeList(); output.push('<ol>'); inOl = true; }
    output.push(`<li style="${S.li}">${inline(escape(line.replace(/^\d+\. /, '')))}</li>`);
    i++; continue;
  }

  // Close lists on non-list line
  if (inUl || inOl) closeList();

  // Cover meta lines (before first ##)
  if (coverDone && line.trim() && !line.startsWith('#')) {
    const coverOpen = output.some(l => l.startsWith('<div>'));
    const coverClosed = output.includes('</div>');

    if (coverOpen && !coverClosed && !line.match(/^(##|###|#### )/)) {
      if (line.trim() === '') {
        // skip blank in cover
      } else {
        output.push(`<p style="${S.meta}">${inline(escape(line))}</p>`);
      }
      i++; continue;
    }
  }

  // Empty line — close cover if still open
  if (line.trim() === '') {
    if (coverDone && !output.includes('</div>') && output.some(l => l.startsWith('<div>'))) {
      output.push('</div>');
    }
    i++; continue;
  }

  // Normal paragraph
  output.push(`<p style="${S.p}">${inline(escape(line))}</p>`);
  i++;
}

closeList();
closeBlockquote();
// Close cover if never closed
if (coverDone && !output.includes('</div>')) {
  const idx = output.findIndex(l => l.startsWith('<div>'));
  if (idx > -1) output.splice(idx + 2, 0, '</div>');
}

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Análise Estratégica de Mercado e Posicionamento Digital — Kit Lanche Express</title>
<style>${css}</style>
</head>
<body>
${output.join('\n')}
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'pesquisa-social.html'), html, 'utf8');
console.log('HTML gerado: pesquisa-social.html');
console.log('Tamanho:', Math.round(Buffer.byteLength(html, 'utf8') / 1024) + ' KB');
