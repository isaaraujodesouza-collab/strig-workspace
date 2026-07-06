---
name: pesquisa-social
description: >
  Produz a pesquisa estratégica de mercado e posicionamento digital para um cliente da Strig Lab.
  Gera documento completo com cenário de mercado, palavras-chave, personas, benchmarking de concorrentes,
  diagnóstico de posicionamento, funil de marketing e banco de perguntas para conteúdo.
  Use quando o usuário pedir "pesquisa do cliente X", "faz a análise de mercado", "estuda os concorrentes",
  "monta a persona", "pesquisa de social do cliente X".
---

# /pesquisa-social — Análise Estratégica de Mercado e Posicionamento Digital

## Dependências

- `_contexto/empresa.md` — contexto da Strig
- `clientes/[nome-do-cliente]/briefing.md` — dados do cliente (se existir)
- WebSearch — para dados de mercado, concorrentes e palavras-chave

---

## Workflow

### Passo 1 — Identificar o cliente

Se o usuário não informou o cliente, perguntar:
> "Para qual cliente é essa pesquisa?"

Ler `clientes/[nome-do-cliente]/briefing.md` se existir. Se não existir, perguntar em bloco único:

> "Não encontrei briefing para esse cliente. Me passe: (1) nome e segmento da empresa, (2) cidade/região de atuação, (3) público-alvo principal, (4) 2 a 3 concorrentes diretos, (5) objetivo com redes sociais (leads, autoridade, vendas?)."

### Passo 2 — Pesquisa com fontes citáveis

Usar WebSearch para coletar dados reais. Buscar em etapas:

**2a. Cenário do mercado:**
- `[nicho] mercado brasil [ano atual] crescimento dados`
- `[nicho] setor tendências [ano atual] site:gov.br OR site:sebrae.com.br OR site:statista.com`
- Buscar: volume do mercado, crescimento % ao ano, dados de demanda ou comportamento do consumidor

**2b. Comportamento digital e palavras-chave:**
- `[serviço principal] mais buscado [cidade/região]`
- `[serviço] como [verbo de intenção]` — variações de intenção de busca
- `"[serviço]" perguntas frequentes google`
- `[nicho] tendências redes sociais linkedin instagram [ano]`

**2c. Concorrentes:**
- Para cada concorrente: `[nome concorrente] site` + `[nome concorrente] instagram` + `[nome concorrente] linkedin`
- Buscar: presença digital, conteúdo publicado, palavras-chave usadas, pontos fortes visíveis

**Regra:** nunca inventar dados. Se não encontrar, informar "dado não localizado" e continuar. Citar a fonte (URL ou nome da publicação) para todo dado numérico.

### Passo 3 — Montar o documento completo

Gerar o documento nas seções abaixo e salvar em `clientes/[nome-do-cliente]/pesquisa-social.md`.

---

## Estrutura do documento de saída

```
# Análise Estratégica de Mercado e Posicionamento Digital — [Nome do Cliente]

Elaborado por: Strig Lab
Data: [data]
Segmento: [nicho]
Objetivo do estudo: [objetivo com redes sociais]
```

---

### 1. Resumo Executivo

Parágrafo de 5 a 7 linhas resumindo: quem é o cliente, o que o mercado mostra, como está o comportamento digital do público, qual é a oportunidade de posicionamento identificada.

---

### 2. Introdução e Metodologia

**Propósito:** orientar a estratégia de social media do cliente com base em dados reais de mercado.

**Metodologia:** listar as fontes e ferramentas usadas:
- Pesquisa de tendências de mercado (Google Trends, relatórios setoriais, publicações especializadas)
- Análise de comportamento de busca (Google Search, Also Asked)
- Análise de concorrentes (Instagram, LinkedIn, site institucional)
- [outras fontes consultadas na sessão]

---

### 3. Cenário do Mercado

**3.1 Panorama geral do setor**
- Tamanho do mercado e crescimento (com fonte citada)
- Principais movimentos recentes
- Dados relevantes de volume, demanda ou comportamento do consumidor

**3.2 Comportamento do público no digital**
- Como esse público busca e consome informação
- Plataformas mais usadas (Instagram, LinkedIn, YouTube, Google)
- Tipo de conteúdo que consome (educativo, cases, bastidores, dados)

**3.3 Oportunidade identificada**
- Gap no mercado digital do nicho: o que ninguém está fazendo bem e o cliente pode ocupar

---

### 4. Comportamento de Busca e Palavras-Chave

**4.1 Análise de buscas e termos relevantes**
- Volume e tendência dos principais termos
- Regionalizações relevantes (se aplicável)
- Intenção de busca predominante (informacional, transacional, navegacional)

**4.2 Inventário de palavras-chave estratégicas**

| Palavra-chave | Categoria | Intenção do usuário | Relevância | Sugestão de conteúdo |
|---|---|---|---|---|
| [termo] | [ex: serviço, dúvida, concorrência] | [o que o usuário quer saber/fazer] | Alta/Média/Baixa | [formato e tema sugerido] |

Incluir de 10 a 15 palavras-chave, priorizando as de maior relevância estratégica para social media.

---

### 5. Perfil dos Decisores: Público-Alvo e Personas

**Público-alvo geral:**
- Faixa etária
- Perfil profissional/socioeconômico
- Localização
- Momento de busca (sabe que tem o problema / está pesquisando solução / pronto para comprar)
- Onde está presente digitalmente

**Persona 1 — [Nome fictício + perfil principal do nicho]**

| Campo | Descrição |
|---|---|
| Perfil | Cargo, faixa etária, localização, situação de vida |
| Objetivos | O que quer alcançar relacionado ao serviço do cliente |
| Problemas e dores | Desafios concretos que enfrenta hoje |
| Como o cliente resolve | Como o serviço endereça cada dor |
| Possíveis objeções | Por que pode hesitar em contratar |
| Respostas às objeções | Argumentos para superar cada objeção |

**Persona 2 — [Nome fictício + perfil complementar]**

(mesma estrutura da Persona 1 — usar quando o cliente tem dois perfis de público distintos)

---

### 6. Arena Competitiva Digital: Análise de Concorrentes

Para cada concorrente, montar ficha:

**[Nome do concorrente]**

| Item | Dados |
|---|---|
| Presença digital | Site: [URL] / Instagram: [@] / LinkedIn: [URL] |
| Porte estimado | seguidores / tamanho percebido |
| Frequência de post | estimativa semanal |
| Formatos predominantes | Reels / carrossel / estático / artigo |
| Temas recorrentes | o que mais publicam |
| Tom de voz | formal / técnico / inspiracional / informal |
| Palavras-chave usadas | termos que aparecem no conteúdo |
| Pontos fortes | o que fazem bem |
| Pontos fracos / gaps | o que não fazem ou fazem mal |

**Tabela comparativa**

| Atributo | [Concorrente 1] | [Concorrente 2] | [Concorrente 3] | [Cliente] |
|---|---|---|---|---|
| Presença no Instagram | | | | |
| Presença no LinkedIn | | | | |
| Produção de conteúdo | | | | |
| Autoridade percebida | | | | |
| Tom de voz | | | | |
| Estratégia de conteúdo | | | | |

---

### 7. Diagnóstico de Posicionamento

**7.1 Posição atual do cliente no digital**
- O que já existe (se houver) e qual a percepção atual
- Lacunas frente aos concorrentes analisados

**7.2 Posicionamento digital proposto**
- Como o cliente deve se posicionar para se diferenciar
- Qual atributo deve comunicar com mais força
- Tom de voz sugerido para o digital

**7.3 Pilares de autoridade**
- 3 a 4 temas nos quais o cliente deve construir autoridade de conteúdo

---

### 8. Funil de Marketing Ideal

| Etapa | Objetivo | Ações recomendadas | Métricas de sucesso |
|---|---|---|---|
| Topo (Atrair) | [o que quer gerar] | [formatos e temas] | [ex: alcance, impressões] |
| Meio (Engajar) | [o que quer gerar] | [formatos e temas] | [ex: salvamentos, compartilhamentos] |
| Fundo (Converter) | [o que quer gerar] | [formatos e temas] | [ex: cliques no link, DMs, leads] |

---

### 9. Banco de Perguntas para Estratégia de Conteúdo

**9.1 Conteúdo que sana dores**
Perguntas que o público faz quando tem o problema que o cliente resolve.
(8 a 10 perguntas)

**9.2 Conteúdo educacional do mercado**
Perguntas sobre o setor, conceitos, como funciona.
(6 a 8 perguntas)

**9.3 Conteúdo de diferenciação**
Perguntas que destacam os diferenciais do cliente frente aos concorrentes.
(6 a 8 perguntas)

---

### 10. Calendário de Conteúdo Sugerido (Amostra)

| Tema | Etapa do funil | Formato sugerido | Palavra-chave | CTA |
|---|---|---|---|---|
| [tema específico do nicho] | Topo/Meio/Fundo | Reel / Carrossel / Estático | [termo] | [ação esperada] |

Incluir 8 a 12 sugestões de pautas baseadas nos achados da pesquisa.

---

### 11. Recomendações Estratégicas

Lista numerada de 5 a 8 recomendações práticas para os primeiros 90 dias. Cada recomendação: uma frase de ação + uma linha de justificativa.

---

### 12. Referências

Listar todas as fontes consultadas:
- [Nome da publicação / URL / data de acesso]

---

## Ao salvar

Informar:
> "Pesquisa salva em `clientes/[nome]/pesquisa-social.md`. Quer que eu já monte o planejamento editorial com base nisso? Chama `/planejamento-editorial`."

---

## Regras

- Usar dados reais com fontes. Nunca inventar métricas, dados de mercado ou perfis de concorrentes
- Se não encontrar dado de algum concorrente, informar "dado não localizado via pesquisa" e continuar
- Personas com nomes fictícios mas perfis baseados na realidade do nicho, não genéricos
- As objeções e respostas das personas são a parte mais estratégica: não deixar superficial
- O banco de perguntas da seção 9 vira insumo direto para o `/planejamento-editorial`
- Métricas realistas para o porte do cliente
- Tom do documento: profissional, direto, com dados. Não usar linguagem de guru ou clichês de marketing
