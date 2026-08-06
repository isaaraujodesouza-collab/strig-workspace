# Nevesforge — Avaliação do site, estrutura formalizada e copy

**Cliente:** Nevesforge (Guilherme Neves) — estúdio de áudio remoto/presencial
**Site atual:** https://striglab.com.br/nevesforge/
**Data:** 16/07/2026
**Base:** Briefing inicial (17/06/2026) + Feedback de layout do cliente + Método LP da Atração (9 Dobras)

> Nota: o servidor da hospedagem bloqueia acesso programático (403). A avaliação do site foi feita com base nos screenshots do documento de feedback, que cobrem todas as seções.

---

## 1. Avaliação do site atual

### Estrutura atual (na ordem)

| # | Seção | Título no site | Estado |
|---|---|---|---|
| 1 | Hero | NEVESFORGE + player "Mixed by Nevesforge" | Boa base, player será trocado |
| 2 | Portfólio | "Trabalhos recentes" (embed Spotify) | Vira 2 seções (Discografia + Portfólio) |
| 3 | Serviços | "O que sai do estúdio" (8 cards) | Aprovado pelo cliente, sem alteração de layout |
| 4 | Sobre | "Quem está do outro lado do fader" | Aprovado, ganha efeito P&B→cor e foto nova |
| 5 | Contato | "Bora colocar seu projeto no ar" | Aprovado, sem alteração |
| 6 | Dúvidas | "Perguntas frequentes" (5 perguntas) | Aprovado, mas dá pra expandir |

### Pontos fortes

- Estética alinhada ao briefing: dark, minimalista, referência Neural DSP/metal moderno, vermelho de destaque.
- CTA duplo no hero (Ouvir Portfólio + Falar no WhatsApp) e botão flutuante de WhatsApp em todas as seções. Segue a regra de ouro: o visitante nunca procura como falar.
- Sem preço na página (correto: LP guia consciência e confiança até o contato, tabela de preço fica pro orçamento).
- Toggle PT/EN atende o público internacional do briefing.
- Formulário enxuto (nome, telefone/WhatsApp, email, serviço de interesse).
- Tom de voz acerta o equilíbrio do briefing: profissional mas próximo ("Bora colocar seu projeto no ar" fala com artista; "cada etapa tratada com o mesmo padrão técnico" fala com empresa).

### Lacunas vs. Método 9 Dobras

| Dobra do método | Status no site |
|---|---|
| 1. Hero | ✅ Existe. H1 é só a marca; falta prova rápida visível |
| 2. Serviços | ✅ Existe |
| 3. Cases | ⚠️ Parcial. O Spotify prova o som, mas não conta problema → solução → resultado |
| 4. Diferenciais | ❌ Não existe. Site não responde "por que você e não o Fiverr/concorrente?" |
| 5. Depoimentos | ❌ Não existe. Briefing diz que indicação é o motor de vendas e o site não mostra isso |
| 6. Localização | ➖ Não se aplica (negócio remoto). Substituída pela nova seção "Como funciona" |
| 7. Quem somos | ✅ Existe |
| 8. Formulário | ✅ Existe |
| 9. FAQ | ✅ Existe, mas com 5 perguntas (método pede 6–10) |

---

## 2. Estrutura formalizada (redesenho)

Estrutura chave das 9 Dobras + feedbacks do cliente. Ordem final da página:

| # | Dobra | Seção | Origem |
|---|---|---|---|
| 1 | HERO | Nevesforge + player waveform estilo Jesse Zuretti, 5 melhores faixas, playlist aberta | Feedback item 1 |
| 2 | CASES (visual) | **Discografia** — grid de capas P&B, hover revela cor + título/artista/ano/função, clique abre lightbox fullscreen com navegação | Feedback item 2 (ref. Pedro Peixoto) — NOVA |
| 3 | CASES (audível) | **Portfólio** — player Spotify aberto com todos os sons | Feedback item 2 |
| 4 | MODO DE TRABALHO | **Como a gente pode trabalhar junto** — dobra fina, 4 cards (remoto, composição/produção, gravação presencial, distribuição/lançamento) | Direção do cliente — NOVA |
| 5 | SERVIÇOS | "O que sai do estúdio" — 8 cards, layout mantido | Aprovado |
| 6 | DIFERENCIAIS | **Por que a Nevesforge** — bullets específicos | 9 Dobras — NOVA (proposta) |
| 7 | COMO FUNCIONA | **Do briefing ao lançamento** — processo em 4 passos, substitui a dobra Localização | 9 Dobras adaptada — NOVA (proposta) |
| 8 | DEPOIMENTOS | **Quem já gravou, recomenda** — ⏸️ SUSPENSO até o cliente enviar material | 9 Dobras — NOVA (proposta, depende de coleta) |
| 9 | QUEM SOMOS | "Quem está do outro lado do fader" — foto nova em alta, efeito P&B→cor no hover | Feedback item 4 |
| 10 | FORMULÁRIO | "Bora colocar seu projeto no ar" — mantido | Aprovado |
| 11 | FAQ | "Perguntas frequentes" — expandir de 5 pra 8 | Aprovado + otimização |

**Decisões registradas:**
- Dobra Localização (6 do método) substituída por **Como funciona**: estúdio remoto com clientes no Brasil e exterior. A função da dobra é a mesma (reduzir fricção), mas aqui a fricção não é chegar até o endereço — é não saber como se trabalha à distância. O processo em passos resolve isso.
- A Discografia cumpre o papel de Cases na versão visual (prova de volume e variedade) e o Portfólio Spotify na versão audível (prova de qualidade). Mini-histórias problema → solução → resultado podem entrar depois como legenda no lightbox ou junto aos depoimentos.
- Toda dobra mantém CTA visível (botão flutuante de WhatsApp + CTAs de seção abaixo).

**Especificações técnicas do feedback:**
- Player do hero: waveform + controles, com aba da playlist aberta por padrão (ref. Jesse Zuretti / player "2XKO Soundtrack"). Mesma playlist da seção Portfólio.
- Grid Discografia: capas em preto e branco; hover = cor original + overlay com nome do single/álbum, artista, ano e função exercida. Clique = fullscreen com navegação entre todas as capas. Cliente vai separar imagens e informações.
- Foto do Sobre: P&B por padrão, cor no hover (mesmo padrão da Discografia).
- Player Spotify do Portfólio: layout compacto (ref. print do Pedro Peixoto).
- Stack: HTML + Tailwind CSS, Web3Forms, Schema.org, Open Graph (padrão Strig).

---

## 3. Avaliação da copy vs. briefing

### O que está bem

- **Hero:** "Cada faixa tratada com a mesma atenção técnica que você ouviria num estúdio de referência — remoto ou presencial" comunica qualidade + flexibilidade, os dois pilares do briefing.
- **Serviços:** os 8 cards cobrem exatamente o portfólio do briefing (composição, sound design, bateria MIDI, edição, produção completa, trilha pra jogos, podcast/audiobook, mix/master).
- **Contato:** "receba um retorno rápido — sem enrolação" conversa com o que o público valoriza segundo o briefing (comunicação rápida e transparente).
- **Tom:** profissional, didático e acessível como pedido. Descontraído na medida ("Bora colocar seu projeto no ar") sem virar informal demais pra empresas.

### O que otimizar

1. **Hero sem prova rápida.** A dobra 1 pede H1 + prova + CTA. O briefing entrega a prova: trilhas em jogos lançados, faixas no Spotify, clientes no Brasil e no exterior, clientes recorrentes. Nada disso aparece no primeiro scroll.
2. **Headline é só a marca.** "NEVESFORGE" não carrega dor nem transformação. Precisa de uma linha de transformação junto da marca.
3. **Diferenciais inexistentes.** O briefing lista os pontos fracos dos concorrentes (atendimento distante, preço alto pra independente, fila longa, especialização em nicho único) e as forças da Nevesforge (proximidade no processo criativo, versatilidade, transparência, entrega organizada). Esse contraste é a seção de Diferenciais pronta e não está no site.
4. **Zero prova social.** O briefing afirma que os clientes chegam por indicação e que a decisão é guiada por confiança e portfólio. Depoimentos são a tradução disso em página.
5. **FAQ curto e sem quebra de objeção comercial.** Faltam as objeções que o briefing revela: "quantas revisões?", "como funciona o pagamento?", "e se eu não gostar do resultado?", "atende meu estilo/gênero?".
6. **Serviços descrevem processo, não resultado.** Ex.: "Baterias MIDI programadas com groove e dinâmica de gravação real" é bom, mas alguns cards podem puxar mais pro benefício final.

---

## 4. Copy da estrutura redesenhada

Legenda: 🔄 revisada · ✨ nova · ✅ mantida

### Dobra 1 — HERO 🔄

**Eyebrow:** ESTÚDIO DE ÁUDIO
**Marca:** NEVESFORGE
**Kicker:** PRODUÇÃO · MIXAGEM · MASTERIZAÇÃO

**Parágrafo (mantido, com prova rápida adicionada):**
> Produção musical, mixagem, masterização e sound design para artistas, bandas, podcasts e jogos. Cada faixa tratada com a mesma atenção técnica que você ouviria num estúdio de referência, remoto ou presencial.

**Linha de prova rápida (nova, abaixo do parágrafo, estilo tag/badge):**
> Faixas no Spotify · Trilhas em jogos lançados · Clientes no Brasil e no exterior

**CTAs (mantidos):** [OUVIR PORTFÓLIO] [FALAR NO WHATSAPP]

**Player:** waveform estilo Jesse Zuretti, título "Mix/Master por Guilherme Neves". Carrega com as **5 melhores faixas** selecionadas, playlist aberta por padrão.

---

### Dobra 2 — DISCOGRAFIA ✨

**Eyebrow:** DISCOGRAFIA
**H2:** Trabalhos que já estão no mundo
**Sub:**
> Álbuns, EPs e singles que passaram pelo estúdio. Passe o mouse sobre cada capa pra ver artista, ano e o que foi feito.

**Padrão do overlay no hover:**
> **[Nome do álbum/single]**
> [Artista] · [Ano]
> [Função: Produção / Mix / Master / etc.]

**CTA da seção:**
> Quer ver o seu lançamento aqui? **[FALAR NO WHATSAPP]**

---

### Dobra 3 — PORTFÓLIO (Spotify) 🔄

**Eyebrow:** PORTFÓLIO
**H2:** Trabalhos recentes (mantido)
**Sub (revisada):**
> Aperte o play. Uma curadoria do que já saiu do estúdio: de trilhas de jogos a masters prontos pra streaming.

**Player:** playlist do Spotify aberta, com **todos os sons** (portfólio completo, diferente do hero que traz só as 5 melhores).

**CTA da seção:**
> Gostou do que ouviu? **[PEDIR ORÇAMENTO]**

---

### Dobra 4 — MODO DE TRABALHO ✨

*(dobra fina, antes de Serviços. 4 cards horizontais explicando os modos de contratar o estúdio)*

**Eyebrow:** MODO DE TRABALHO
**H2:** Como a gente pode trabalhar junto
**Sub:**
> Do primeiro acorde à campanha de lançamento. Você escolhe até onde a Nevesforge entra no seu projeto.

**Card 1 — À distância, de onde você estiver**
> Todo o processo acontece remoto, sem depender da sua localização. Cliente no Brasil ou no exterior recebe o mesmo padrão de estúdio.

**Card 2 — Composição e produção**
> Precisa de ajuda pra compor, terminar ou revisar a música? A gente entra com todos os instrumentos: guitarra, baixo, violão, sintetizadores e arranjo completo.

**Card 3 — Imersão de gravação presencial**
> Quando o projeto pede presença, a gente grava no local. Deslocamento até você pra registrar a música in loco, com acompanhamento de perto.

**Card 4 — Depois da música pronta**
> O trabalho não acaba no master. Distribuição nas plataformas e apoio na campanha de lançamento pra faixa chegar em quem importa.

**CTA da seção:** [FALAR NO WHATSAPP]

---

### Dobra 5 — SERVIÇOS ✅

**Eyebrow:** SERVIÇOS
**H2:** O que sai do estúdio (mantido)
**Sub (mantida, só pontuação ajustada):** Da composição à masterização, cada etapa tratada com o mesmo padrão técnico.

Cards: layout e copy mantidos exatamente como estão no site aprovado. Nenhuma alteração.

**CTA (mantido):** [PEDIR ORÇAMENTO]

---

### Dobra 6 — DIFERENCIAIS ✨

**Eyebrow:** POR QUE A NEVESFORGE
**H2:** O que muda quando você produz aqui

> Estúdio grande te coloca na fila. Marketplace te entrega um freelancer aleatório. Aqui é diferente:

- **Você fala direto com quem mixa.** Sem intermediário, sem telefone sem fio. Quem responde a mensagem é quem entrega a faixa.
- **Parceria no processo criativo.** Sugestões técnicas e criativas fazem parte do trabalho: a faixa é construída com você, não apenas pra você.
- **Um estúdio, todas as etapas.** Composição, gravação, edição, mix, master, sound design. O projeto inteiro num só lugar, com uma só identidade sonora.
- **Brasil e exterior.** Atendimento em português e inglês, orçamento em real ou dólar.
- **Prazo é compromisso.** Cronograma definido antes de começar e cumprido até o fim.
- **Entrega organizada.** Arquivos nomeados, versionados e prontos pra distribuição, do jeito que produtora, editora e distribuidora esperam receber.

**CTA da seção:** [FALAR NO WHATSAPP]

---

### Dobra 7 — COMO FUNCIONA ✨

**Eyebrow:** COMO FUNCIONA
**H2:** Do briefing ao lançamento

> Trabalhar remoto não é trabalhar no escuro. Remoto ou presencial, você decide como quer fechar: o processo é o mesmo pra quem está em Curitiba ou do outro lado do mundo.

**Passo 1. Conversa e proposta**
> Você conta o projeto no WhatsApp ou no formulário. Volta uma proposta clara: escopo, prazo e condições, sem letra miúda.

**Passo 2. Envio de material**
> Referências, guias, stems ou sessões: tudo organizado por Google Drive. Precisa gravar? Remoto ou presencial, do jeito que o projeto pedir.

**Passo 3. Produção e revisões**
> A faixa é construída com retorno em cada etapa. Você ouve, comenta e aprova antes de avançar. Rodadas de revisão já definidas na proposta.

**Passo 4. Entrega pronta pra publicar**
> Arquivos finais nomeados, versionados e no formato de cada plataforma: streaming, jogo, podcast ou distribuidora.

**CTA da seção:** Começa pelo passo 1. **[FALAR NO WHATSAPP]**

---

### Dobra 8 — DEPOIMENTOS ⏸️ *(SUSPENSO — aguardando informações do cliente)*

> **Não implementar por enquanto.** Guilherme vai enviar os depoimentos reais. Estrutura e copy ficam prontas aqui pra encaixe quando o material chegar.

**Eyebrow:** DEPOIMENTOS
**H2:** Quem já gravou, recomenda
**Sub:**
> A maioria dos projetos do estúdio chega por indicação de quem já lançou. Alguns recados de quem passou por aqui:

**Formato:** 3 a 6 quotes reais (prints de WhatsApp/DM ou texto + nome do artista/banda + projeto).

**Placeholder de estrutura:**
> "[Depoimento real]"
> **[Nome]**, [artista/banda/empresa] · [projeto trabalhado]

**CTA da seção:** Seu projeto pode ser o próximo. **[PEDIR ORÇAMENTO]**

---

### Dobra 9 — QUEM SOMOS ✅

**Eyebrow:** SOBRE
**H2:** Quem está do outro lado do fader (mantido)
**Corpo (mantido):**
> A Nevesforge nasceu no final de 2025 para reunir, num único estúdio, a experiência acumulada em anos trabalhando como assistente de estúdio, gravando artistas e colaborando com profissionais de diferentes áreas da música.
>
> Hoje, cada projeto passa pelas mãos do Guilherme Neves: do primeiro take à masterização final, remoto ou presencial, para clientes no Brasil e no exterior.

**Tags (mantidas):** Produção · Gravação · Mixagem · Masterização | Atendimento BR & Internacional

**Ajuste visual:** foto nova em alta resolução, P&B com cor no hover (padrão da Discografia).

---

### Dobra 10 — FORMULÁRIO ✅

**Eyebrow:** CONTATO
**H2:** Bora colocar seu projeto no ar (mantido)
**Sub (mantida, só pontuação ajustada):**
> Conta o que você precisa e receba um retorno rápido, sem enrolação.

**Campos (mantidos):** Seu nome · Seu telefone/WhatsApp · Seu email · Selecione o serviço de interesse
**Botão:** ENVIAR MENSAGEM
**Canais (mantidos):** WhatsApp (41) 98854-1538 · nevesaudio@gmail.com · @nevesforge (Instagram) · @nevesforge (YouTube)

---

### Dobra 11 — FAQ 🔄

**Eyebrow:** DÚVIDAS
**H2:** Perguntas frequentes

Mantidas as 5 atuais + 3 novas de quebra de objeção comercial:

1. **Como funciona o atendimento remoto?** *(mantida)*
2. **Atendem clientes fora do Brasil?** *(mantida)*
3. **Preciso ter tudo pronto antes de contratar?** *(mantida)*
4. **Qual o prazo médio de entrega?** *(mantida)*
5. **Como recebo os arquivos finais?** *(mantida)*
6. **Quantas revisões estão incluídas?** ✨
   > Cada projeto inclui rodadas de revisão definidas na proposta. O objetivo é simples: a faixa só está pronta quando representa o que você imaginou.
7. **Como funciona o orçamento e o pagamento?** ✨
   > O orçamento é feito por projeto, de acordo com escopo e complexidade. Você recebe uma proposta clara com valores, prazos e condições antes de qualquer início. Pra clientes internacionais, o orçamento sai em dólar.
8. **Trabalham com qualquer estilo musical?** ✨
   > O estúdio tem forte atuação em metal moderno e rock, mas o portfólio cobre de trilha pra jogos a podcast e audiobook. Manda uma referência do seu projeto no WhatsApp e a gente te diz com transparência se é a nossa praia.

**CTA final da página (abaixo do FAQ, antes do footer):**
> Ainda com dúvida? Resolve em uma mensagem. **[FALAR NO WHATSAPP]**

---

## Pendências pro cliente (Guilherme)

- [ ] Enviar capas e informações da Discografia (título, artista, ano, função)
- [ ] Enviar foto em alta resolução pro Sobre
- [ ] Coletar 3–6 depoimentos de clientes recorrentes (print ou texto autorizado)
- [ ] Confirmar playlist definitiva "Mix/Master por Guilherme Neves" no Spotify
