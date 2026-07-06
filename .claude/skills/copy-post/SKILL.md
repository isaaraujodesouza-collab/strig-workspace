---
name: copy-post
description: >
  Gera a copy completa de um post de social media para um cliente da Strig Lab.
  Produz texto para artes gráficas, legendas, roteiros de Reels ou stories,
  aplicando o framework N3 ou a letra CRESCER correta para o post.
  Use quando o usuário pedir "escreve o copy do post", "faz o texto do carrossel",
  "roteiro do reels", "legenda do post de [tema]", "produz o conteúdo de [data]".
---

# /copy-post — Copy de Post de Social Media

## Dependências

- `clientes/[nome-do-cliente]/briefing.md` — dados e tom do cliente
- `clientes/[nome-do-cliente]/planejamento-[mes]-[ano].md` — tema e formato do post (se existir)
- `clientes/[nome-do-cliente]/banco-crescer.md` — banco de ideias do cliente (se existir)
- `conteudo/redes-sociais/CRESCER.md` — referência de método e formatos

---

## Workflow

### Passo 1 — Identificar o post

Coletar (do planejamento ou do usuário):
- **Cliente**
- **Tema do post**
- **Formato:** Reel / Carrossel / Estático / Story
- **Letra CRESCER** (se vier do planejamento)
- **Objetivo de funil:** Topo / Meio / Fundo

Se não tiver planejamento, perguntar o tema e o formato. Identificar a letra CRESCER mais adequada automaticamente com base no tema.

### Passo 2 — Ler contexto do cliente

Ler `clientes/[nome-do-cliente]/briefing.md` para extrair:
- Tom de voz do cliente
- Público-alvo
- Serviços/produtos principais
- Diferenciais

Se o briefing não existir, perguntar: "Qual é o tom de voz do cliente e o que ele vende?"

### Passo 3 — Produzir o copy

#### Para Reel (roteiro de até 60s usando N3):

**Estrutura N3:**
- **Gancho (0-3s):** frase que para o scroll — foco na dor, no erro ou na surpresa
- **Diagnóstico (4-15s):** contextualiza o problema, por que acontece
- **Mecanismo (16-35s):** a solução, o passo a passo, o como
- **Prova (36-45s):** dado, resultado, case rápido
- **Objeção (46-52s):** responde a principal dúvida antes do CTA
- **CTA (53-60s):** ação específica (link na bio, comentar, salvar)

Entregar linha a linha com marcação de tempo aproximada.

#### Para Carrossel (7 a 10 telas):

- **Capa:** headline da dor ou transformação (curta, escaneável)
- **Telas 2-3:** contexto, por que isso importa
- **Telas 4-7:** conteúdo principal (dica, passo a passo, dados)
- **Tela penúltima:** resumo ou insight principal
- **Última tela:** CTA + conta do cliente

Entregar tela a tela com texto sugerido para cada slide.

#### Para post estático:

- **Texto da arte:** até 15 palavras, foco em dor ou desejo
- **Legenda:** gancho nas 2 primeiras linhas (antes do "ver mais") + desenvolvimento em parágrafos curtos + CTA
- **Hashtags:** 5 a 8 hashtags relevantes para o nicho e localização

#### Para Story:

- **Sequência de até 5 frames**
- Cada frame: texto curto + sugestão de visual
- Último frame: CTA com sticker de link, enquete ou pergunta

### Passo 4 — Entregar e salvar

Entregar a copy formatada na conversa.

Perguntar se quer salvar:
> "Quer que eu salve esse copy em `clientes/[nome]/copies/`?"

Se sim, salvar em `clientes/[nome-do-cliente]/copies/copy-[tema]-[YYYY-MM-DD].md`.

---

## Regras

- **O tom é do cliente, não da Strig.** Não usar linguagem anti-guru ou provocativa em clientes que têm tom mais neutro ou institucional
- O gancho nunca começa com pergunta retórica — sempre afirmação, dado ou afirmação polêmica
- Não usar travessão (—)
- Não usar "mergulhe", "transforme sua vida", "fórmula", "passo a passo infalível"
- CTA deve ser específico: não "me siga", mas "clica no link da bio para agendar"
- Se o post for de fundo de funil, incluir elemento de urgência ou escassez real (não forçada)
- Legenda de estático: 3 a 5 parágrafos curtos, não bloco único de texto
