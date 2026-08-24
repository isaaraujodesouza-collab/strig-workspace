---
name: feedback-pautas-escolhidas-clickup
description: "Como popular a task \"Pautas escolhidas - DD/MM\" no ClickUp toda segunda-feira, no fluxo da Strig News"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0a6cda11-e70c-4ba1-839e-20b3dcfad238
  modified: 2026-08-24T14:25:37.189Z
---

Toda segunda-feira, ao consolidar as pautas escolhidas da Strig News na task "Pautas escolhidas - DD/MM" (lista Produção Newsletter, espaço STRIG LAB), a task já vem com **7 subtarefas pré-existentes**, uma por editoria, cada uma com o campo customizado EDITORIA (dropdown) já preenchido corretamente.

**O fluxo correto é:**
1. Buscar a task com `include: ["subtasks"]` (sem isso a API retorna subtasks_count sem listar as subtasks).
2. Identificar a editoria de cada subtask pelo campo dropdown EDITORIA (não confiar no texto da descrição antiga, que pode ser lixo de ciclo anterior — o valor do dropdown é a fonte confiável).
3. **Renomear o título de cada subtask** (`name`) pra refletir a pauta escolhida daquela semana pra aquela editoria.
4. **Nunca alterar o campo EDITORIA** — ele já vem certo, só o título muda.
5. **O conteúdo de apuração da notícia (título provisório, tema central, linha editorial, objetivo, fontes e dados, observações) vai sempre como COMENTÁRIO na subtask**, nunca na descrição da subtask nem como comentário único na task-mãe.

**Por quê:** a Isa corrigiu isso depois de eu ter postado um comentário único gigante na task-mãe em vez de usar a estrutura de subtasks que já existia. A lógica de "notícia sempre em comentário" evita sobrescrever a descrição (que seguia um padrão de ciclos anteriores) e mantém histórico rastreável por subtask.

**Como aplicar:** sempre que rodar o fluxo de pauta escolhida da Strig News (skill `pesquisa-strignews`, Passo 6 em diante), seguir esse padrão sem perguntar de novo.
