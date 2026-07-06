/**
 * Strig Lab — Padrão de formatação Google Docs
 * Aplica: Poppins, hierarquia de títulos, formatação de tabelas
 *
 * Como usar:
 * 1. Abra o Google Doc
 * 2. Menu: Extensões → Apps Script
 * 3. Cole esse código, substituindo qualquer código existente
 * 4. Clique em "Executar" com a função formatarDocumento selecionada
 * 5. Autorize o script quando solicitado
 */

// ─── Especificações de estilo ───────────────────────────────────────────────

var FONTE = 'Poppins';

var ESTILO = {
  H1:   { tamanho: 16, negrito: true,  cor: '#000000' },
  H2:   { tamanho: 14, negrito: true,  cor: '#333333' },
  H3:   { tamanho: 12, negrito: true,  cor: '#666666' },
  H4:   { tamanho: 11, negrito: true,  cor: '#999999' },
  TEXTO:{ tamanho: 11, negrito: false, cor: '#000000' },
};

// Cores de tabela (escala Google Docs)
var TABELA_HEADER_FUNDO   = '#000000'; // preto
var TABELA_HEADER_TEXTO   = '#FFFFFF'; // branco
var TABELA_CORPO_FUNDO    = '#EFEFEF'; // Cinza claro 3
var TABELA_DESTAQUE_FUNDO = '#CCCCCC'; // Cinza claro 1

// ─── Funções principais ─────────────────────────────────────────────────────

function formatarDocumento() {
  var doc  = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  // Fonte padrão do corpo
  body.setAttributes({
    [DocumentApp.Attribute.FONT_FAMILY]: FONTE,
    [DocumentApp.Attribute.FONT_SIZE]:   ESTILO.TEXTO.tamanho,
  });

  var total = body.getNumChildren();
  for (var i = 0; i < total; i++) {
    var filho = body.getChild(i);
    var tipo  = filho.getType();

    if (tipo === DocumentApp.ElementType.PARAGRAPH) {
      _formatarParagrafo(filho.asParagraph());
    } else if (tipo === DocumentApp.ElementType.TABLE) {
      _formatarTabela(filho.asTable());
    } else if (tipo === DocumentApp.ElementType.LIST_ITEM) {
      _formatarListItem(filho.asListItem());
    }
  }

  Logger.log('Formatação aplicada!');
}

// ─── Funções auxiliares ─────────────────────────────────────────────────────

function _formatarParagrafo(para) {
  var nivel = para.getHeading();
  var texto = para.editAsText();
  var cfg;

  switch (nivel) {
    case DocumentApp.ParagraphHeading.HEADING1: cfg = ESTILO.H1;    break;
    case DocumentApp.ParagraphHeading.HEADING2: cfg = ESTILO.H2;    break;
    case DocumentApp.ParagraphHeading.HEADING3: cfg = ESTILO.H3;    break;
    case DocumentApp.ParagraphHeading.HEADING4: cfg = ESTILO.H4;    break;
    default:                                    cfg = ESTILO.TEXTO; break;
  }

  texto.setFontFamily(FONTE);
  texto.setFontSize(cfg.tamanho);
  texto.setBold(cfg.negrito);
  texto.setForegroundColor(cfg.cor);
}

function _formatarListItem(item) {
  var texto = item.editAsText();
  texto.setFontFamily(FONTE);
  texto.setFontSize(ESTILO.TEXTO.tamanho);
  texto.setForegroundColor(ESTILO.TEXTO.cor);
}

function _formatarTabela(tabela) {
  var numLinhas = tabela.getNumRows();

  for (var l = 0; l < numLinhas; l++) {
    var linha = tabela.getRow(l);
    var numCols = linha.getNumCells();

    for (var c = 0; c < numCols; c++) {
      var celula = linha.getCell(c);
      var texto  = celula.editAsText();

      texto.setFontFamily(FONTE);
      texto.setFontSize(ESTILO.TEXTO.tamanho);

      if (l === 0) {
        // Cabeçalho: fundo preto + texto branco + negrito
        celula.setBackgroundColor(TABELA_HEADER_FUNDO);
        texto.setForegroundColor(TABELA_HEADER_TEXTO);
        texto.setBold(true);
      } else {
        // Corpo: cinza claro 3
        celula.setBackgroundColor(TABELA_CORPO_FUNDO);
        texto.setForegroundColor('#000000');
        texto.setBold(false);
      }
    }
  }
}

/**
 * Função auxiliar — marcar célula como destaque manualmente
 * Selecione uma célula e execute essa função para aplicar Cinza claro 1 + negrito
 */
function aplicarDestaqueCelula() {
  var doc      = DocumentApp.getActiveDocument();
  var cursor   = doc.getCursor();
  if (!cursor) { Logger.log('Posicione o cursor dentro de uma célula.'); return; }

  var elemento = cursor.getElement();
  while (elemento && elemento.getType() !== DocumentApp.ElementType.TABLE_CELL) {
    elemento = elemento.getParent();
  }

  if (!elemento) { Logger.log('Cursor não está dentro de uma célula.'); return; }

  var celula = elemento.asTableCell();
  celula.setBackgroundColor(TABELA_DESTAQUE_FUNDO);
  celula.editAsText().setBold(true);
  Logger.log('Destaque aplicado.');
}
