---
name: feedback-relatorio-social-turbinado
description: Relatório de social (orgânico) deve sempre avisar quando o período tiver posts impulsionados
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4c992646-2ac3-495e-ae3b-e12bd34342b9
  modified: 2026-07-22T19:01:03.215Z
---

Quando o cliente tiver posts impulsionados (turbinado) no período do relatório de social media orgânico, sempre incluir um aviso no `kpi_note` do config em vez de tentar separar orgânico de pago.

**Why:** O Instagram nativo (aba Insights) agrega alcance e interações orgânicas com as pagas assim que um post é impulsionado, e não existe forma de filtrar isso na tela de insights. Tentar apresentar os números como 100% orgânicos nesse cenário seria enganoso. A usuária confirmou essa regra ao montar o relatório do Kit Lanche Express (período 29/06 a 21/07/2026, quase todo o conteúdo publicado no período era turbinado).

**How to apply:**
- Regra já está documentada em `.claude/skills/relatorio-social/SKILL.md`, seção Regras.
- Ao montar o config.json de qualquer cliente, se a usuária mencionar ou os prints mostrarem a tag "Turbinado" nos posts, adicionar o aviso no `kpi_note` (ex: "Quase todas as publicações do período foram impulsionadas...").
- Não tentar excluir os posts turbinados do slide de melhores publicações — eles continuam sendo o conteúdo real do período, só o número de alcance/interação pode estar inflado pelo pago.
