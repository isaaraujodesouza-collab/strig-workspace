# Relatório de Benchmarking Estratégico — GEO/AEO para M&A
## Como aparecer nas respostas do ChatGPT, Gemini e Claude

**Escopo:** Consolidação de 3 análises de IA (ChatGPT, Gemini, Claude) sobre 5 boutiques de M&A brasileiras — IGC Partners, G5 Partners, BR Partners, Fortezza Partners, Oporto Capital Partners
**Objetivo:** Identificar por que essas empresas são citadas por ferramentas de IA generativa e mapear as táticas de GEO que funcionam no setor

> O plano de ação aplicado a um cliente específico fica em documento separado. Este relatório cobre só o benchmarking e a metodologia.

---

## Sumário executivo

As 3 análises, feitas de forma independente por 3 IAs diferentes, chegaram à mesma conclusão por caminhos diferentes: SEO para Google continua a base, mas **nenhuma das 5 empresas para nisso.** Elas constroem autoridade textual, semântica e institucional na internet aberta (imprensa, LinkedIn, glossários, dados estruturados), e é essa camada extra, não coberta pelo SEO tradicional, que os modelos de IA generativa leem, associam e reproduzem.

O padrão que se repete nas 3 análises:

1. **Conteúdo definicional** (explicar termos técnicos com precisão) é o formato mais absorvido por LLMs, porque espelha exatamente o tipo de pergunta que um usuário faz a uma IA.
2. **Repetição consistente de fatos e posicionamento** entre site, LinkedIn e imprensa cria corroboração, e LLMs dão mais peso a informação que aparece de forma consistente em múltiplas fontes independentes.
3. **Presença em imprensa financeira de terceiros** (Valor, Exame, NeoFeed, Mergermarket) pesa mais que qualquer anúncio pago, porque é sinal de terceiro validando a marca.
4. **Estrutura técnica on-page** (meta description escrita como resposta direta, dados tabulares, processos nomeados em etapas) facilita a extração do conteúdo por modelos que fazem busca em tempo real.
5. **Multi-formato** (podcast, vídeo, transcrição) multiplica os pontos de entrada indexáveis do mesmo conteúdo.

Nenhuma das 5 usa mídia paga como alavanca principal. Nenhuma tem FAQ schema markup ou conteúdo formatado explicitamente em pergunta-e-resposta. Isso é lacuna aberta, não padrão do setor.

---

## Capítulo 1 — Como as ferramentas de IA funcionam (e por que essas estratégias funcionam)

Para agir com intenção, é preciso entender o mecanismo. As 3 ferramentas (ChatGPT, Gemini, Claude) não funcionam do mesmo jeito, mas compartilham uma lógica de fundo.

### 1.1 Dois momentos onde a marca pode aparecer

**Treinamento (dados de base do modelo):** os modelos são treinados em bilhões de páginas da internet, incluindo sites institucionais, artigos de imprensa, Wikipédia, fóruns, PDFs indexados publicamente. Se o nome de uma empresa aparece muitas vezes, em muitas fontes diferentes, associado aos mesmos termos, o modelo "aprende" essa associação como um padrão estatístico. Isso é lento de mudar (o modelo já foi treinado) e depende de volume e recorrência histórica.

**Retrieval / grounding (busca em tempo real):** Gemini e, cada vez mais, ChatGPT e Claude, fazem busca na web no momento da resposta antes de gerar o texto (RAG, "grounding com busca"). Aqui o que importa é o que está indexado **agora**: SEO técnico, estrutura da página, clareza do conteúdo. Esse canal muda rápido, e é o que dá resultado em semanas/meses, não anos.

**Implicação prática:** dá pra jogar nos dois tabuleiros ao mesmo tempo. Otimização on-page (meta tags, estrutura, clareza) ataca o canal de retrieval e traz resultado rápido. Presença consistente em imprensa e conteúdo recorrente constrói o canal de treinamento e traz resultado composto ao longo do tempo.

### 1.2 Entity Mapping (mapeamento de entidades)

Os modelos não leem palavras soltas, leem **entidades e as relações entre elas**. Uma entidade pode ser uma empresa, uma pessoa, um setor, um conceito técnico. Quando um texto associa repetidamente "Quatá" + "M&A" + "middle market" + "sell-side" + "confidencialidade", o modelo constrói um grafo interno: Quatá está conectada a esses nós. Quanto mais essa conexão se repete em fontes diferentes e independentes, mais forte fica o vínculo, e maior a chance do modelo trazer a Quatá à tona quando alguém pergunta sobre esses temas.

Isso é o oposto de palavra-chave solta. É "empresa + especialidade + contexto" repetido de forma consistente.

### 1.3 Co-ocorrência (padrão vetorial)

Quando o nome de uma empresa aparece perto de certos termos com frequência (em matérias, artigos, LinkedIn), o modelo aprende essa proximidade como um vetor. "IGC Partners" aparecendo sempre perto de "sell-side", "middle market", "indústria" cria uma associação matemática entre esses conceitos. É por isso que **consistência de vocabulário entre todos os canais** (site, LinkedIn, imprensa, propostas) importa mais do que parece.

### 1.4 High Trust Entity (sinal de alta confiança)

Modelos dão peso extra a informação que vem de fontes que eles já "confiam": veículos de imprensa estabelecidos, associações institucionais reconhecidas, entidades com histórico de citação (Wikipédia, bases de dados jornalísticas, redes internacionais). Quando uma boutique brasileira se associa a uma rede global (como a Fortezza com a Oaklins), ela "herda" parte da confiança daquela rede aos olhos do modelo.

### 1.5 Conteúdo definicional é o formato-rei

Quando alguém pergunta a uma IA "o que é earn-out" ou "como funciona um processo de M&A", o modelo busca (ou lembra de) um texto que **responde exatamente essa pergunta, de forma clara e didática**. Se esse texto pertence à sua empresa, e está bem escrito, a IA tende a citar sua empresa como fonte ou a usar seu texto como base da resposta. Por isso glossários, artigos "o que é X" e processos nomeados em etapas performam tão bem: eles são literalmente a resposta pronta para a pergunta mais comum.

### 1.6 Por que anúncio pago não ajuda diretamente

Mídia paga (Google Ads, LinkedIn Ads) gera cliques e leads, mas não gera texto novo indexável nem citação de terceiros. Não constrói entidade, não constrói corroboração, não alimenta treinamento nem retrieval. É importante para geração de demanda direta, mas é um jogo separado do jogo de GEO.

---

## Capítulo 2 — Benchmarking consolidado das 5 boutiques

| Empresa | Alavanca principal | Blog / conteúdo definicional | Dados citáveis (nº deals, ranking) | Multi-formato | SEO técnico on-page | Imprensa/PR | LinkedIn |
|---|---|---|---|---|---|---|---|
| **IGC Partners** | PR massivo + números repetidos | Parcial (cases como press release) | Muito forte ("118 transações", "líder Mergermarket") | Não | Não visível | Muito forte (Valor, Estadão, Capital Aberto, Mergermarket) | Forte, canal principal |
| **G5 Partners** | Institucional + frase-chancela repetida | Fraco (Insights esporádico) | Médio (prêmios Euromoney) | Não | Não visível | Médio (InfoMoney) | Forte (27 mil seguidores) |
| **BR Partners** | Capital aberto → clipping constante | Sim, com Dicionário de Negócios (glossário) | Forte (fatos relevantes de RI) | Não | Não visível | Forte (compliance gera notícia recorrente) | Sim |
| **Fortezza Partners** | Conteúdo multi-formato + didático | Sim, forte e recorrente | Médio | Sim (podcast + YouTube + Spotify + Apple Podcasts) | Confirmado por case de agência terceira | Médio (Forbes, ResumoCast) | Muito ativo, funciona quase como blog |
| **Oporto Capital Partners** | SEO/GEO on-page deliberado | Sim, com newsletter mensal | Fraco | Vídeo institucional na home | Muito forte (meta keywords, meta description como resposta direta, cases tabulares, metodologia em 5 etapas nomeadas) | Fraco | Fraco/não identificado |

### O que isso ensina

A Oporto é o caso mais revelador: é a menor em porte e presença institucional, mas aparece nas citações porque **o próprio site foi escrito para ser lido por máquina**. Isso prova que SEO/GEO técnico bem-feito compensa (parcialmente) a falta de peso institucional, e que é a alavanca mais rápida de acionar porque depende só de reescrever o próprio site, não de conseguir uma matéria na Exame.

A IGC e a BR Partners mostram o oposto: escala via corroboração externa (imprensa, RI, rankings) é mais lenta de construir mas cria uma base mais difícil de um concorrente copiar.

A Fortezza mostra que **diversificar formato multiplica pontos de indexação** do mesmo conteúdo (o mesmo episódio de podcast vira página, vira transcrição, vira post de LinkedIn, vira vídeo no YouTube).

---

## Capítulo 3 — O que essas empresas produzem (consolidado)

| Tipo de conteúdo | Exemplos observados | Por que funciona para GEO |
|---|---|---|
| Glossário / conteúdo definicional | "Dicionário de Negócios" (BR Partners), artigos "o que é earn-out / valuation / sell-side" | Responde literalmente a pergunta que o usuário faz à IA |
| Processo em etapas nomeadas | Metodologia em 5 passos da Oporto (Diagnóstico → Estruturação → Mapeamento → Negociação → Fechamento) | Formato fácil de extrair e resumir por um modelo |
| Cases estruturados/tabulares | Setor + porte de faturamento + tipo de transação, mesmo anonimizados | Dado estruturado é mais fácil de "ler" por máquina que texto corrido |
| Relatórios setoriais | M&A em saúde, agro, tecnologia, educação | Cria associação "empresa + setor" (entity mapping) |
| Comentário macroeconômico recorrente | Leitura semanal de juros, inflação, mercado de capitais (G5) | Produção contínua reforça recorrência = mais sinal ao longo do tempo |
| Podcast/videocast | "Vendendo sua Empresa" (Fortezza) | Gera transcrição indexável em linguagem natural, formato pergunta-resposta |
| Cobertura de imprensa (PR) | Valor, Exame, NeoFeed, Mergermarket, Capital Aberto | Corroboração por fonte de alta confiança (high trust entity) |
| Deal announcements | Anúncios de transações fechadas no LinkedIn | Prova social recorrente, reforça associação empresa + setor + tipo de deal |

---

## Capítulo 4 — Plataformas e onde investir atenção

Ordem de relevância para GEO (não para geração de lead direto, que é outro objetivo):

1. **Site próprio / blog** — é o único canal 100% sob controle, e o mais fácil de otimizar tecnicamente (meta tags, estrutura, clareza definicional).
2. **LinkedIn** — funciona como blog paralelo quando usado com constância; é o canal onde os sócios aparecem como especialistas (autoridade humana).
3. **Imprensa financeira especializada** — mais lento de conquistar, mas o de maior peso para "high trust entity". Não depende só de assessoria de imprensa: comentário técnico bem escrito facilita ser pautado.
4. **YouTube/Spotify (podcast)** — opcional, mas multiplica formato e gera transcrição indexável.
5. **Instagram, TikTok, Facebook** — irrelevantes para GEO no nicho B2B financeiro. Nenhuma das 5 investe força aí.

---

## Capítulo 5 — Mídia paga

Nenhuma das 5 usa mídia paga como motor de presença em IA. O padrão observado (quando existe investimento) é:

- Google Search Ads conservador, só em termos de altíssima intenção ("assessoria M&A", "vender minha empresa") — geração de lead direto, não GEO.
- LinkedIn Ads segmentado por cargo (CEO, CFO, Founder) promovendo relatórios e cases — também geração de lead, não GEO.

**Conclusão prática:** manter (ou iniciar) mídia paga para geração de demanda é válido, mas não deve ser tratado como estratégia de GEO. São investimentos com objetivos diferentes e não se substituem.

---

## Capítulo 6 — As táticas de GEO que mais "puxam" citação (ranking consolidado das 3 análises)

1. **Conteúdo definicional/estruturado** (glossário, "o que é X", processo em etapas nomeadas) — citado nas 3 análises como o fator mais direto de citação por IA.
2. **Repetição consistente de posicionamento e números entre site, LinkedIn e imprensa** — corroboração entre fontes independentes é o que mais reforça um fato no modelo.
3. **SEO técnico on-page bem feito** (meta description escrita como resposta a uma pergunta, meta keywords específicas, título alinhado à intenção de busca) — a alavanca mais rápida de acionar, caso Oporto.
4. **Presença recorrente em imprensa especializada de terceiros** — mais lenta, mas cria a base mais difícil de copiar (caso IGC e BR Partners).
5. **Autoridade humana visível** (sócio comentando na imprensa, artigo assinado, entrevista) — modelo associa pessoa → empresa → especialidade, reforçando a entidade.
6. **Associação institucional a redes ou entidades já confiáveis** (rede global, bolsa de valores, ranking reconhecido) — sinal de "high trust entity" herdado.
7. **Multi-formato** (texto + áudio + vídeo do mesmo conteúdo) — multiplica pontos de indexação sem multiplicar esforço de produção proporcionalmente.

### O que nenhuma das 5 está fazendo (oportunidade em aberto)

- FAQ schema markup (dado estruturado sinalizando pergunta-resposta para máquinas)
- Conteúdo explicitamente formatado em pergunta-e-resposta direta (estilo "People Also Ask")
- Presença ativa em fóruns/Reddit/Quora, fontes que o Gemini em particular usa com frequência via grounding com busca

Como ninguém do setor está fazendo isso, é a lacuna de menor esforço e maior diferenciação disponível agora.

---

## Capítulo 7 — Clusters semânticos e vocabulário (mapa de entidades do setor)

| Categoria | Termos |
|---|---|
| Institucional / serviços | Boutique de M&A, M&A middle market, sell-side, buy-side, valuation de empresas, M&A cross-border |
| Financeiro / técnico | Earn-out, EBITDA ajustado, NDA, processo competitivo, mandato exclusivo, due diligence, multiplicadores de mercado |
| Setorial estratégico | Consolidação em saúde, M&A em fintechs, sucessão em empresas familiares, M&A no agronegócio, M&A em software/SaaS |
| Gatilho do fundador | Como vender minha empresa, quando vender a empresa, erros ao vender uma empresa, preparação da empresa para venda |

---

## Referências

Consolidado a partir de 3 pesquisas independentes conduzidas por ChatGPT, Gemini e Claude sobre presença digital e GEO de IGC Partners, G5 Partners, BR Partners, Fortezza Partners e Oporto Capital Partners (fontes citadas pelas próprias ferramentas: sites institucionais, LinkedIn, YouTube/Spotify, Valor Econômico, Exame, NeoFeed, Mergermarket, Capital Aberto, Forbes, InfoMoney, ResumoCast).
