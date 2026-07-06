---
name: planejamento-editorial
description: >
  Gera o planejamento editorial mensal de social media para um cliente da Strig Lab,
  aplicando o método CRESCER. Posts por semana variáveis por cliente.
  Use quando o usuário pedir "planejamento do mês", "cronograma de posts",
  "monta o editorial do cliente X", "planejamento de [mês]".
---

# /planejamento-editorial — Planejamento Editorial Mensal

## Dependências

- `_contexto/empresa.md` — contexto da Strig
- `clientes/[nome-do-cliente]/briefing.md` — dados do cliente
- `clientes/[nome-do-cliente]/pesquisa-social.md` — persona e OKRs (se existir)
- `conteudo/redes-sociais/CRESCER.md` — método editorial

---

## Workflow

### Passo 1 — Identificar cliente e mês

Se não informado, perguntar em bloco único:
> "Para qual cliente e qual mês é o planejamento? Quantos posts por semana estão no contrato dele?"

Se tiver briefing do cliente, ler e extrair:
- **Posts por semana** (campo "Serviço contratado" ou equivalente)
- **Objetivo principal** no social
- **Tom de voz** do cliente

### Passo 2 — Calcular volume

Com base nos posts por semana, calcular o total do mês:
- Identificar quantas semanas completas tem o mês
- Total de posts = semanas × posts por semana

Se o cliente posta menos que 7x por semana, a ordem das editorias CRESCER é sempre sequencial e contínua ao longo do mês — não há dias fixos por editoria. A sequência é: C (Crise), R (Receita), E (Evolução), S (Storytelling), C (Conteúdo), E (Essência), R (Resultado) — e volta ao início.

**Exemplo com 2x/semana (terça e quinta), mês de 4 semanas:**

| Post | Data | Editoria |
|---|---|---|
| 1 | Ter 1 | C — Crise |
| 2 | Qui 1 | R — Receita |
| 3 | Ter 2 | E — Evolução |
| 4 | Qui 2 | S — Storytelling |
| 5 | Ter 3 | C — Conteúdo |
| 6 | Qui 3 | E — Essência |
| 7 | Ter 4 | R — Resultado |
| 8 | Qui 4 | C — Crise (volta ao início) |

A mesma lógica vale para 3x, 4x, 5x e 6x por semana: os posts seguem a sequência CRESCER contínua, independente do dia da semana em que caem. Os dias da semana são definidos pelo contrato/preferência do cliente; a editoria segue a posição na sequência.

### Passo 3 — Gerar o calendário

Para cada post do mês, gerar:

| Campo | Conteúdo |
|---|---|
| Data | DD/MM |
| Dia da semana | Segunda, Terça... |
| Letra CRESCER | C / R / E / S / E / R |
| Tema do post | Título claro e específico (não genérico) |
| Formato sugerido | Reel / Carrossel / Estático / Story |
| Direcionamento criativo | O que mostrar visualmente, ângulo da copy |
| Objetivo | Topo / Meio / Fundo de funil |

**Regra de funil:** distribuir os posts proporcionalmente:
- ~40% topo (educar, atrair)
- ~35% meio (provar, engajar)
- ~25% fundo (converter, CTA direto)

**Formatos:** variar para não repetir o mesmo formato mais de 2x seguidas.

### Passo 4 — Datas especiais

Verificar se há datas comemorativas relevantes para o nicho do cliente no mês em questão. Se houver, sugerir post temático encaixado na letra CRESCER mais compatível.

### Passo 5 — Salvar

Salvar em `clientes/[nome-do-cliente]/planejamento-[mes]-[ano].md`.

Estrutura do arquivo:

```
# Planejamento Editorial — [Cliente] — [Mês/Ano]

**Posts por semana:** X
**Total do mês:** Y posts
**Objetivo principal:** [extraído do briefing/OKRs]

## Calendário

| Data | Dia | CRESCER | Tema | Formato | Direcionamento | Funil |
|...|

## Observações do mês
[datas especiais, campanhas específicas, eventos do cliente]
```

Ao salvar, informar:
> "Planejamento salvo. Para produzir os copies de cada post, chama `/copy-post` passando o tema e o cliente."

---

## Regras

- Temas devem ser específicos do nicho e persona do cliente — não usar temas genéricos de marketing
- Se não tiver pesquisa-social.md do cliente, avisar que a pesquisa aumenta a qualidade dos temas e perguntar se quer fazer antes
- Nunca repetir o mesmo tema em dois posts do mesmo mês
- Adaptar tom e temas ao cliente — não usar linguagem da Strig no planejamento de outro negócio
