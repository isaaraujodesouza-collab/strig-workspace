---
name: apresentacao-aprovacao
description: >
  Monta a apresentação de aprovação mensal de social media no Canva para um cliente da Strig Lab.
  Localiza as artes no Google Drive, combina com as legendas dos copies e popula o design no Canva.
  Use quando o usuário pedir "monta a aprovação do cliente X", "prepara a apresentação de aprovação",
  "faz a apresentação do mês de [mês]".
---

# /apresentacao-aprovacao — Apresentação de Aprovação Mensal

## Dependências

- `clientes/[nome-do-cliente]/planejamento-[mes]-[ano].md` — calendário do mês
- `clientes/[nome-do-cliente]/copies/` — legendas de cada post
- Google Drive MCP — para acessar as artes enviadas pela Marina
- Canva MCP — para criar e popular a apresentação

---

## Workflow

### Passo 1 — Identificar cliente e mês

Se não informado, perguntar em bloco único:
> "Para qual cliente e qual mês é a apresentação de aprovação?"

Ler `clientes/[nome-do-cliente]/planejamento-[mes]-[ano].md` para ter o calendário completo.

---

### Passo 2 — Localizar artes no Google Drive

Buscar a pasta do mês no Drive conforme o padrão do cliente:

**Clientes padrão (social media geral):**
```
Strig Lab > Clientes > [nome do cliente] > Fábrica de Conteúdo > [ano] > [mm.aa]
```
Dentro: subpastas `dd/mm - tema da postagem`, cada uma com:
- `estáticos/` — posts estáticos
- `carrosseis/` — slides do carrossel
- `stories/` — frames de story

**Quatá Confidence Capital (LinkedIn):**
```
Strig Lab > Clientes > Quatá Confidence Capital > 01_share cliente > Conteúdo - Materiais Gráficos > gestão linkedin > [ano] > mm_nome do mês ano
```
Dentro: subpastas `dd/mm - tema da postagem` com a mesma estrutura.

Listar todas as subpastas do mês para saber quais posts têm artes prontas.

Se algum post do planejamento não tiver pasta de arte no Drive, informar:
> "Os seguintes posts ainda não têm arte no Drive: [lista]. Posso continuar com os que têm."

---

### Passo 3 — Coletar legendas

Para cada post com arte disponível:
1. Buscar o arquivo de copy correspondente em `clientes/[nome-do-cliente]/copies/`
2. Extrair: legenda completa (sem hashtags) + CTA

Se não houver copy salvo para algum post, sinalizar e perguntar se quer gerar agora com `/copy-post` antes de continuar.

---

### Passo 4 — Localizar ou criar o design no Canva

Buscar no Canva um design existente com o nome do cliente + mês:
- Padrão: `[Nome do cliente] - [MÊS]` (ex: `IBR - JUNHO`)
- Variação: `[Nome do cliente]_[MÊS] [ano]` (ex: `Quatá Confidence_JUNHO 26`)

Se encontrar: abrir e usar como base.

Se não encontrar: buscar nos brand templates um modelo de "Apresentação de Aprovação" e criar um novo design a partir dele com o nome `[Nome do cliente] - [MÊS]`.

---

### Passo 5 — Popular o design no Canva

Estrutura da apresentação (baseada no padrão IBR):

**Slide 1 — Capa**
- Fundo escuro
- Logo Strig + logo do cliente
- Título: `[Nome do cliente] — [Mês/Ano]`
- Subtítulo: "Aprovação de Conteúdo"

**Slide 2 — Grade do calendário mensal**
- Tabela/grid com os dias do mês
- Cada célula com: data + tema resumido + formato (Reel / Carrossel / Estático / Story)
- Destaque visual para posts de fundo de funil (conversão)

**Slides individuais de post — um por post:**
Para cada post com arte pronta:
- Upload da arte (ou referência à imagem do Drive)
- Data e tema do post
- Editoria CRESCER
- Legenda completa
- Plataforma(s): Instagram / Facebook / LinkedIn

Ordem: cronológica pela data do post.

---

### Passo 6 — Exportar ou compartilhar

Após popular todos os slides:
1. Exportar como PDF ou gerar link de visualização do Canva
2. Informar o link ou caminho do arquivo exportado

---

## Regras

- Apresentar legendas sem hashtags nos slides de aprovação — hashtags ficam só no arquivo de copy
- Se o design já existir no Canva (de mês anterior), criar uma cópia renomeada — nunca sobrescrever o anterior
- Avisar sobre posts sem arte ou sem copy antes de montar, não depois
- A ordem dos slides segue a ordem cronológica do calendário
- Não incluir stories na grade do calendário — stories ficam como slides separados no final, agrupados por semana
