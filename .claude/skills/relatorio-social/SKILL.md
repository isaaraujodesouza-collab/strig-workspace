---
name: relatorio-social
description: >
  Gera o relatório de performance de social media orgânico para um cliente da Strig Lab.
  Foco em conteúdo orgânico (alcance, seguidores, engajamento, melhores posts) — nunca tráfego pago.
  A usuária traz os dados (prints/PDF/export dos insights) e a skill produz um documento .md
  com resumo executivo, números comparados ao período anterior, destaques e recomendações.
  Use quando o usuário pedir "relatório do cliente X", "relatório de social", "fecha o mês do cliente X",
  "monta o relatório de [mês]", "analisa os insights do cliente X".
---

# /relatorio-social — Relatório de Social Media (Orgânico)

Este relatório é **só de orgânico**. Se o cliente também tem tráfego pago, os números de anúncios não entram aqui — este documento cobre alcance, seguidores, engajamento e conteúdo.

## Dependências

- `_contexto/empresa.md` — contexto da Strig
- `_contexto/preferencias.md` — tom de voz
- `clientes/[nome-do-cliente]/briefing.md` — objetivo do cliente no social (se existir)
- `clientes/[nome-do-cliente]/planejamento-[mes]-[ano].md` — o que foi planejado no período (pra cruzar com o resultado)
- Relatórios anteriores salvos em `clientes/[nome-do-cliente]/` — pra comparar a evolução

---

## Workflow

### Passo 1 — Identificar cliente, período e plataformas

Se não informado, perguntar em bloco único:
> "Para qual cliente é o relatório, qual o período (ex: junho/26, ou 01/06 a 15/06) e quais plataformas (Instagram, LinkedIn, Facebook, TikTok)?"

O período **varia por cliente** — sempre confirmar. Não assumir mensal.

### Passo 2 — Receber e ler os dados

A usuária vai enviar os dados dos insights (prints, PDF ou export da ferramenta). Ler os documentos e extrair os números de cada plataforma.

**Se ela ainda não mandou os dados**, pedir exatamente o que precisa, pra ela não ficar perdida:

> "Me manda os insights do período. Do Instagram, o ideal é ter:
> - Contas alcançadas (e quantas eram seguidores vs. não seguidores)
> - Contas com engajamento
> - Crescimento de seguidores (novos, deixaram de seguir, saldo)
> - Visitas ao perfil e cliques no link
> - Os posts com melhor desempenho do período (alcance, salvamentos, compartilhamentos)
>
> Pode ser print da aba Insights do próprio Instagram ou export do Metricool. Manda o que tiver que eu trabalho com isso."

Adaptar a lista à plataforma:
- **LinkedIn (Quatá):** impressões, visualizações da página, novos seguidores, taxa de engajamento, principais publicações.
- **TikTok:** visualizações, alcance, seguidores, tempo médio de exibição, vídeos com melhor desempenho.

**Nunca inventar número.** Se um dado não veio, trabalhar com o que tem e sinalizar no relatório o que ficou de fora (ver Regras).

### Passo 3 — Buscar o período anterior

Procurar em `clientes/[nome-do-cliente]/` um relatório anterior (`relatorio-*.md`). Se existir, usar os números dele como base de comparação.

Se não existir relatório anterior, perguntar:
> "Tem os números do período anterior pra eu comparar a evolução? Se não tiver, faço o relatório só com o período atual e a comparação entra a partir do próximo."

### Passo 4 — Calcular variações

Para cada métrica que tenha período anterior, calcular a variação:
- Variação absoluta (ex: +312 seguidores)
- Variação percentual (ex: +8,4%)

Marcar visualmente a direção: ▲ subiu / ▼ caiu / ▬ estável.

Calcular a **taxa de engajamento** quando houver dados:
`interações totais ÷ alcance × 100` (ou ÷ seguidores, deixar explícito qual base foi usada).

### Passo 5 — Analisar (esta é a parte que dá valor)

Não é só listar número. Cruzar os dados com o conteúdo do período:

1. **O que funcionou:** quais posts/formatos/temas puxaram alcance e engajamento. Se houver `planejamento-[mes].md`, cruzar com as editorias CRESCER — qual letra performou melhor.
2. **O que não funcionou:** onde o alcance ou engajamento caiu, formato que não engajou.
3. **Leitura estratégica:** o que os números dizem sobre a fase do cliente (topo/meio/fundo de funil), e o que isso sugere pro próximo período.

Tom: direto, embasado no dado, sem enrolação. Dado é resposta, não decoração. Nada de "seu perfil está bombando" — falar o que aconteceu e por quê.

### Passo 6 — Montar o relatório

Gerar o documento seguindo a **Estrutura do relatório** abaixo.

### Passo 7 — Salvar e informar

Salvar em `clientes/[nome-do-cliente]/relatorio-[periodo]-[ano].md`
(ex: `relatorio-junho-26.md` ou `relatorio-01a15-junho-26.md`).

Ao salvar, informar o caminho e um resumo de 2 linhas do que os números mostraram. Se ela quiser, oferecer levar pro Canva depois (a skill entrega o .md; o Canva é passo separado).

---

## Métricas de referência por plataforma

Use como checklist do que buscar nos dados. Nem todo cliente terá tudo.

**Instagram (orgânico)**
- Contas alcançadas (seguidores vs. não seguidores)
- Impressões / visualizações
- Contas com engajamento
- Interações: curtidas, comentários, salvamentos, compartilhamentos
- Crescimento de seguidores (novos − deixaram de seguir = saldo)
- Visitas ao perfil
- Cliques no link / toques no botão
- Desempenho por formato: Reels, Carrossel, Estático, Stories
- Top posts do período

**LinkedIn**
- Impressões
- Visualizações da página / do perfil
- Novos seguidores
- Taxa de engajamento
- Principais publicações

**TikTok**
- Visualizações de vídeo
- Alcance
- Seguidores (saldo)
- Tempo médio de exibição / taxa de conclusão
- Top vídeos

---

## Estrutura do relatório

```
# Relatório de Social Media — [Cliente] — [Período]

**Plataformas:** [Instagram / LinkedIn / ...]
**Período:** [data inicial a data final]
**Comparado com:** [período anterior, ou "primeiro relatório — sem base de comparação"]

## Resumo executivo

[3 a 4 frases diretas. O que aconteceu no período, o número que mais importa,
e a leitura principal. Sem clichê, sem "bombando". Entrega a conclusão primeiro.]

## Números do período

| Métrica | [Período atual] | [Período anterior] | Variação |
|---|---|---|---|
| Contas alcançadas | ... | ... | ▲ +X (+Y%) |
| Contas com engajamento | ... | ... | ... |
| Saldo de seguidores | ... | ... | ... |
| Visitas ao perfil | ... | ... | ... |
| Cliques no link | ... | ... | ... |
| Taxa de engajamento | ...% | ...% | ... |

## Destaques do período

**Melhores posts:**
1. [Data] — [Tema] — [formato] — [número que justifica: X salvamentos / Y alcance]
2. ...

[Por que performaram: tema, formato, timing.]

## Leitura estratégica

**O que funcionou:** [...]
**O que não funcionou:** [...]
**Editoria que mais performou:** [letra CRESCER, se houver planejamento cruzado]

## Recomendações para o próximo período

- [Ação concreta 1 — ligada ao que o dado mostrou]
- [Ação concreta 2]
- [Ação concreta 3]

---
*Dados extraídos dos insights nativos / [ferramenta]. Métricas não fornecidas neste ciclo: [se houver].*
```

---

## Regras

- **Só orgânico.** Nenhum número de tráfego pago entra neste relatório. Se a usuária mandar dados de anúncios junto, separar e avisar que ficam de fora deste documento.
- **Nunca inventar número.** Se um dado não veio, não estimar. Registrar no rodapé quais métricas ficaram de fora.
- **Sem travessões (—)** no texto do relatório. Sem clichê, sem framing aspiracional vago, sem "leve seu perfil ao próximo nível".
- Dado é a resposta, não o argumento de abertura. Toda seção entrega a conclusão antes de detalhar.
- Variações sempre com número absoluto **e** percentual, e a direção (▲▼▬).
- Deixar explícita a base de cálculo da taxa de engajamento (sobre alcance ou sobre seguidores).
- Adaptar tom e nível de linguagem ao cliente — não usar a voz combativa da Strig no relatório de outro negócio; usar linguagem clara e profissional.
- Se não houver período anterior, fazer o relatório mesmo assim e marcar como base zero para os próximos.
- O entregável é o `.md`. Canva é passo opcional posterior, nunca parte obrigatória desta skill.
