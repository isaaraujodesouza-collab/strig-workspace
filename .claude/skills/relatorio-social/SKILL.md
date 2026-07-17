---
name: relatorio-social
description: >
  Gera o relatório de social media ORGÂNICO de um cliente da Strig Lab como dashboard visual
  (HTML + PDF) no padrão premium da agência — mesmo visual do relatório de tráfego, com métricas
  de orgânico: alcance, seguidores, engajamento, audiência, melhores posts e stories. Nunca tráfego pago.
  Serve Instagram e LinkedIn (a plataforma é definida no config). A usuária traz os dados (export do
  Metricool / prints dos insights) e a skill monta o config e roda o gerador.
  Use quando o usuário pedir "relatório do cliente X", "relatório de social", "fecha o mês do cliente X",
  "monta o relatório de [mês]", "analisa os insights do cliente X".
---

# /relatorio-social — Relatório de Social Media (Orgânico)

Este relatório é **só de orgânico**. Nenhum número de tráfego pago entra aqui. O entregável é um
dashboard de slides (paisagem 1920x1080) em HTML + PDF, no visual da Strig (roxo #7F00FF, header
preto, cards brancos, fonte Poppins). O relatório de tráfego é a skill irmã; este segue o mesmo motor.

## Como funciona (visão geral)

Um script Python (`scripts/build_relatorio_social.py`) lê um `config.json` com os dados do período e
gera o HTML + PDF. A skill preenche o config a partir dos dados que a usuária trouxer.

```
dados do Metricool  →  config.json  →  build_relatorio_social.py  →  relatório.html + .pdf
```

## Dependências

- `_contexto/preferencias.md` — tom de voz (para o resumo e os insights)
- Python 3.12 + `playwright` + `pillow` + o chromium do playwright (já instalados nesta máquina)
- Logo em `marca/logo-strig/logo branco.png` (se não existir, o script usa o texto "strig lab")

**Rodar o gerador nesta máquina** (Python está fora do PATH, use o caminho completo):

```
"C:\Users\isaar\AppData\Local\Programs\Python\Python312\python.exe" ^
  .claude\skills\relatorio-social\scripts\build_relatorio_social.py ^
  --config <config.json> --out-dir <pasta de saída>
```

Adicionar `--no-pdf` para gerar só o HTML (mais rápido, útil pra revisar antes de renderizar o PDF).
No outro computador da agência, onde o Python está no PATH, basta trocar por `python`.

---

## Workflow

### Passo 1 — Identificar cliente, período e plataforma

Se não informado, perguntar em bloco único:
> "Para qual cliente é o relatório, qual o período e qual plataforma (Instagram, LinkedIn ou os dois)?"

O período **varia por cliente** — sempre confirmar, não assumir mensal. Perguntar também o período
anterior de comparação (o Metricool já traz "comparado com").

### Passo 2 — Receber os dados

A usuária traz o export do Metricool (PDF/print) ou os prints dos insights nativos. Ler e extrair.

Se ela ainda não mandou, pedir de forma objetiva pra ela não ficar perdida:

> "Me manda o relatório do Metricool (ou os prints dos insights) do período. Preciso de:
> - Os KPIs do topo com a variação vs. período anterior (alcance, seguidores, interações, curtidas, taxa de engajamento...)
> - Alcance por dia (pro gráfico de evolução)
> - Audiência: gênero, idade e principais cidades
> - As melhores publicações (alcance, visualizações, curtidas, comentários, salvos, compart.)
> - Os stories, se houver (alcance, saídas, respostas, toques)
> Manda o que tiver que eu trabalho com isso."

**Nunca inventar número.** Se um dado não veio, deixar de fora e registrar (ver Regras).

### Passo 3 — Montar o config.json

Usar `exemplos/config-exemplo-social.json` como base. Preencher com os dados do cliente.
Salvar o config em `clientes/[cliente]/relatorio-[periodo]-config.json`.

Ver **Schema do config** abaixo. Pontos de atenção:
- `plataforma` define o texto do header ("Instagram", "LinkedIn", "Instagram + Facebook").
- Cada KPI tem `delta` com `dir` (up/down) e `good` (true/false). A **cor segue `good`, não a direção**:
  taxa de engajamento caindo é ruim (bad/vermelho) mesmo sendo uma queda; alcance subindo é bom (verde).
- `audiencia` é flexível: para LinkedIn troca gênero/idade/cidade por função/setor/senioridade
  (mesmos blocos `tipo: "pie"` ou `tipo: "bar"`). É isso que faz a skill servir qualquer cliente.
- Slides são condicionais: só aparece o slide de audiência se houver `audiencia`, o de posts se houver
  `posts`, etc. Cliente sem stories não gera slide de stories.

### Passo 4 — Escrever o resumo e os insights

Esta é a parte que dá valor. Não é só listar número.

- **Resumo do período:** 2-3 frases factuais do que aconteceu, com os números principais em negrito.
- **Insights (3 a 5):** leitura estratégica. Cruzar métricas (ex: alcance subiu mas taxa caiu = chegou
  gente nova, foco agora é converter em salvamento). Ligar audiência ao perfil do cliente. Sugerir ação.

Tom: direto, embasado no dado, sem clichê. Dado é resposta, não decoração. Nada de "seu perfil está
bombando". Adaptar a linguagem ao cliente (não usar a voz combativa da Strig no relatório de outro negócio).

### Passo 5 — Rodar o gerador

Rodar o comando do bloco Dependências apontando pro config. Salvar a saída em
`clientes/[cliente]/`. Conferir o PDF antes de entregar.

### Passo 6 — Entregar

Informar o caminho do HTML e do PDF, e um resumo de 2 linhas do que os números mostraram.

---

## Schema do config

```jsonc
{
  "cliente": "IBR",                    // nome exibido no header
  "cliente_slug": "ibr",               // usado no nome do arquivo
  "plataforma": "Instagram",           // "LinkedIn", "Instagram + Facebook"...
  "periodo": "01/06/2026 - 30/06/2026",
  "periodo_slug": "junho-2026",
  "comparado": "02/05/2026 - 31/05/2026",   // opcional
  "kpi_note": "texto do aviso amarelo (opcional)",
  "kpis": [                            // grid da visão geral
    { "lbl": "Alcance", "val": "157.130", "delta": { "txt": "98,91%", "dir": "up", "good": true } }
  ],
  "daily": [ ["01/06", 3200, 12] ],    // [data, alcance, novos_seguidores(opcional)]
  "resumo": "texto com <strong>negritos</strong>",   // opcional
  "audiencia": [                       // opcional; cada bloco vira um card
    { "titulo": "Gênero", "tipo": "pie", "items": [["Masculino", 53.4]] },
    { "titulo": "Principais cidades", "tipo": "bar", "items": [["São Paulo", 164]] }
  ],
  "posts": [                           // opcional; slide de melhores publicações
    { "titulo": "...", "taxa": "—", "alcance": 136, "visualizacoes": 179,
      "curtidas": 3, "comentarios": 0, "salvos": 0, "compart": 0, "seguir": 0 }
  ],
  "stories": [                         // opcional
    { "titulo": "Story 1", "alcance": 62, "saidas": 9, "respostas": 0, "avancar": 38, "voltar": 2 }
  ],
  "insights": [ "<strong>...</strong> ..." ],   // opcional
  "rodape": [ { "strong": "+289", "text": "começaram a seguir" } ]   // opcional
}
```

---

## Regras

- **Só orgânico.** Nenhum número de tráfego pago entra. Se a usuária mandar dados de anúncios junto,
  separar e avisar que ficam de fora deste relatório.
- **Nunca inventar número.** Se um dado não veio, não estimar. Deixar o campo de fora do config.
- **Sem travessões (—)** no texto do resumo/insights. Sem clichê, sem framing aspiracional vago.
  Dado é a resposta, não a decoração. Entregar a conclusão antes de detalhar.
- A cor do delta segue `good`, não a direção da seta.
- Adaptar tom e linguagem ao cliente — não usar a voz da Strig no relatório de outro negócio.
- Conferir o PDF renderizado antes de entregar (não confiar só no HTML).
- Nunca sobrescrever o config/relatório de um mês anterior — salvar com o período no nome.
