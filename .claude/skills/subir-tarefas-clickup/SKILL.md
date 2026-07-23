---
name: subir-tarefas-clickup
description: >
  Sobe as tasks de posts de social media pro ClickUp, na lista "Produção de conteúdo"
  do espaço do cliente, depois que o planejamento editorial e as copies já foram validados.
  Título = tema do post, descrição = direcionamento criativo do planejamento, copy completa
  como comentário, campos personalizados Cliente/Responsável/Status/Formato preenchidos,
  status nativo "design & edição". Adaptável a qualquer cliente com espaço dedicado no ClickUp.
  Use quando o usuário pedir "sobe as tarefas no clickup", "sobe os posts no clickup",
  "cria as tasks do planejamento de [cliente]", "manda o mês pro clickup".
---

# /subir-tarefas-clickup — Subir Tasks de Social Media pro ClickUp

## Quando usar

Só depois que o planejamento editorial E as copies do mês já estão validados pela usuária.
Essa skill não gera conteúdo, ela pega o que já existe em disco e sobe pro ClickUp.

## Dependências

- `clientes/[nome-do-cliente]/planejamento-[mes]-[ano].md` — calendário e direcionamento criativo de cada post
- `clientes/[nome-do-cliente]/copies/copies-[mes]-[ano].md` — copy completa de cada post
- MCP ClickUp — para localizar o espaço do cliente e criar as tasks

---

## Workflow

### Passo 1 — Identificar cliente e mês

Se não informado, perguntar em bloco único:
> "Qual cliente e qual mês? E quem fica como responsável pelas tasks desse lote (Isa, Chrys, Marina ou Ryan)?"

Ler `clientes/[nome-do-cliente]/planejamento-[mes]-[ano].md` e `clientes/[nome-do-cliente]/copies/copies-[mes]-[ano].md` por completo (arquivos longos, usar offset/limit se necessário — nunca sumir com posts por falta de leitura).

Se algum dos dois arquivos não existir, avisar e parar:
> "Não encontrei [arquivo]. Preciso do planejamento e das copies validados antes de subir pro ClickUp."

### Passo 2 — Localizar a estrutura do cliente no ClickUp

Cada cliente da Strig Lab tem um **espaço dedicado** no ClickUp (ex: "Kit Lanches Express", "IBR Soluções Financeiras", "Quatá Confidence"). Dentro dele, uma pasta de social media (nome varia: "Social Media 3.0 - [Cliente]", "3.0 Social Media [Cliente]", "[CLIENTE] - Projetos e Produção de conteúdo"), e dentro dela a lista **"Produção de conteúdo"** (ou "3.0 Produção de conteúdo").

1. Rodar `clickup_get_workspace_hierarchy` (ou usar cache da conversa se já tiver sido chamado antes).
2. Encontrar o espaço cujo nome corresponde ao cliente (aceitar variação de grafia: "Kit Lanches Express" ≈ "kit-lanche-express").
3. Dentro do espaço, achar a pasta de social media e, dentro dela, a lista com "produção de conteúdo" no nome.
4. Se não achar com confiança, listar as opções encontradas e perguntar qual é a lista certa, em vez de chutar.

### Passo 3 — Resolver os campos personalizados da lista

Rodar `clickup_get_custom_fields` no `list_id` encontrado. A lista deve ter (nomes exatos podem variar levemente por cliente, mas a lógica é a mesma):

| Campo | Tipo | O que fazer |
|---|---|---|
| **Cliente** | drop_down | Achar a opção cujo nome bate com o cliente atual (ex: "Kit Lanches Express") |
| **Responsável** | labels | Achar a opção cujo label bate com o nome informado no Passo 1 (Isa, Chrys, Marina, Ryan) |
| **Status** | drop_down | Sempre usar a opção **"A FAZER"** (task recém-criada) |
| **Formato** | labels | Mapear o formato do post pro label correspondente (ver tabela abaixo) |

**Mapeamento de formato (planejamento → label ClickUp):**

| Planejamento | Label ClickUp |
|---|---|
| Carrossel | CARROSSEL |
| Reel | REELS |
| Estático | POST |
| Story | STORY |

Se um formato do planejamento não bater com nenhum label existente, perguntar em vez de inventar valor novo.

### Passo 4 — Checar tasks já existentes (evitar duplicata)

Rodar `clickup_filter_tasks` com `list_ids: [lista]` pra pegar os nomes de tasks já criadas. Comparar com os temas do planejamento do mês.

Se algum tema já existir como task, pular esse post e avisar no resumo final. Nunca criar duplicata.

### Passo 5 — Criar as tasks

Para cada post do planejamento que ainda não tem task:

1. **Nome:** o tema do post, exatamente como está no planejamento
2. **Descrição (markdown_description):** o "Direcionamento criativo" completo do post no planejamento (incluir também Público/Restrição/Material para criação quando o post for um criativo de tráfego pago já roteirizado)
3. **Status nativo do ClickUp:** `design & edição`
4. **Due date:** a data do post no planejamento (DD/MM), no ano correto — usar o ano do nome do arquivo do planejamento; se o calendário virar de mês (ex: agosto→setembro) sem virar de ano, manter o mesmo ano; só incrementar o ano se o calendário virar dezembro→janeiro
5. **Custom fields:** Cliente (dropdown), Responsável (labels), Status (dropdown = "A FAZER"), Formato (labels)
6. **Assignee nativo do ClickUp:** a mesma pessoa do campo personalizado "Responsável" — sempre preencher os dois, nunca só um
7. Depois de criar a task, postar a copy completa do post (do arquivo de copies) como **comentário** na task, no mesmo formato usado no arquivo (títulos de seção, tela a tela, legenda, hashtags, stories)

Criar as tasks e comentários em lotes paralelos quando possível, pra não travar em uma chamada por vez.

### Passo 6 — Resumir

Ao final, informar:
- Quantas tasks foram criadas (com link de cada uma)
- Quantos posts foram pulados por já existir, com os nomes
- Qualquer post que não tinha copy correspondente no arquivo de copies (avisar antes de pular)

---

## Regras

- Nunca criar task sem a copy correspondente já existir no arquivo de copies — se faltar, avisar e perguntar se segue sem comentário ou espera a copy
- Nunca usar etiqueta (tag) nativa do ClickUp nem adivinhar campos — o campo "Cliente" personalizado é quem carrega essa informação
- Sempre preencher assignee nativo E o campo personalizado "Responsável" com a mesma pessoa
- Se a estrutura do espaço do cliente no ClickUp não seguir o padrão esperado (sem pasta de social media, sem lista de produção), parar e perguntar em vez de criar em lugar errado
- Datas de posts sem ano explícito no planejamento: inferir pelo nome do arquivo, nunca perguntar ano a ano
- Se o cliente ainda não tiver espaço ou lista no ClickUp, avisar e não criar nada
