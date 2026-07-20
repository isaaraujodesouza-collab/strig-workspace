---
name: pesquisa-strignews
description: >
  Faz a pesquisa editorial completa da Strig News para a semana. Varra todas as fontes
  de confiança sistematicamente, levanta o banco de notícias por editoria, apresenta
  as opções para a usuária escolher as pautas, e escreve a edição completa no formato
  da newsletter. Use quando a Isa pedir "pesquisa da Strig News", "levanta as notícias
  da semana", "quais são as pautas dessa semana", "faz a edição da Strig News".
---

# /pesquisa-strignews — Pesquisa e Produção da Strig News

## Dependências

- **Guia editorial:** `marca/copywriting-strignews.md`
- **Design da newsletter:** `marca/design-guide-strignews.md`
- **Fontes de referência:** Globo (g1.globo.com), Exame, BBC, CNN Brasil, CNBC, Reuters, Meio & Mensagem, Mundo do Marketing
- **MCP Beehiiv:** para criar o rascunho da edição (publication ID: `pub_cd70bc8f-1304-4e8a-833c-9d03506c887a`)

---

## Editorias da Strig News

| Editoria | Temas cobertos |
|---|---|
| EVENTOS & MUNDO | Acontecimentos globais com impacto no mercado digital |
| TECH & IA | Lançamentos de IA, big techs, ferramentas |
| MERCADO & CAMPANHAS | Regulações, tendências de mercado, economia |
| MARKETING | Estratégias, tendências, cases de marca |
| PLATAFORMAS | Redes sociais, algoritmos, atualizações |
| CREATORS | Movimentos de influenciadores e criadores de conteúdo: contratos, brand deals, reconhecimento de plataforma, regulações, CONAR, impacto gerado. Figuras públicas digitais conhecidas no Brasil (influencers brasileiros, nomes globais como Elon Musk, Trump, celebridades). Fontes prioritárias: Exame, Meio & Mensagem, CNN Brasil. **Não inclui** robôs, saúde digital ou tecnologia em geral — só movimentos do universo creator. |
| EDUCAÇÃO & CARREIRAS | IA no trabalho, habilidades, tendências de carreira |

---

## Workflow

### Passo 1 — Verificar últimas edições publicadas

Acessar `https://strignews.beehiiv.com/` e listar as edições recentes.
Para cada edição, identificar os temas já cobertos para **não repetir pautas**.
Usar WebFetch nas URLs das últimas 2-3 edições para mapear o que já foi publicado.

---

### Passo 2 — Varrer as fontes sistematicamente

Fazer WebFetch em **todas as fontes abaixo em paralelo**. Não usar apenas buscas por palavras-chave — entrar diretamente em cada fonte:

| Fonte | URL |
|---|---|
| Globo/G1 | `https://g1.globo.com/tecnologia/` |
| Exame Tecnologia | `https://exame.com/tecnologia/` |
| Exame Marketing | `https://exame.com/marketing/` |
| BBC Português | `https://www.bbc.com/portuguese` |
| CNN Brasil Tech | `https://www.cnnbrasil.com.br/tecnologia/` |
| CNN Brasil Negócios | `https://www.cnnbrasil.com.br/economia/negocios/` |
| CNBC Technology | `https://www.cnbc.com/technology/` |
| Reuters Technology | `https://www.reuters.com/technology/` |
| Meio & Mensagem | `https://www.meioemensagem.com.br/` |
| Mundo do Marketing | `https://mundodomarketing.com.br/` |

**Observação:** BBC, Reuters e CNBC frequentemente bloqueiam acesso direto. Se isso acontecer, complementar com WebSearch usando `site:bbc.com OR site:reuters.com` e buscar notícias recentes da semana.

Para cada fonte, pedir: "Liste as principais notícias desta semana com título e resumo de 1 linha cada."

---

### Passo 3 — Complementar com buscas temáticas

Fazer buscas adicionais para cobrir o que as homepages podem não mostrar:

- Notícias de IA e big techs da semana
- Eventos globais relevantes para marketing e tecnologia
- Regulações e legislação digital (CONAR, ANPD, leis internacionais)
- Cannes Lions, Clio Awards, ou outros festivais de publicidade se estiver na semana
- Copa do Mundo, eventos com impacto em marketing (quando relevante)

---

### Passo 4 — Montar o banco de notícias

Apresentar **todas as notícias encontradas**, organizadas por editoria, no formato:

```
**[CÓDIGO] — Título da notícia**
Resumo em 2-3 linhas com dados concretos (números, empresas, impacto).
*Fonte: [Nome](URL)*
```

Indicar com ⚠️ pautas relevantes que foram descobertas apenas na varredura direta das fontes (não apareceriam em buscas por palavra-chave).

**Regra de mínimo por editoria:** cada editoria deve ter **pelo menos 2 notícias** no banco — uma para virar principal e pelo menos uma para o "O que mais foi destaque". Se alguma editoria tiver apenas 1 notícia após a varredura, fazer uma busca adicional antes de apresentar o banco. Não apresentar o banco com editorias tendo apenas 1 opção.

**Regra de temporalidade:** todas as notícias do banco — tanto as principais quanto as de destaque — devem ser da **mesma semana da edição**. Não usar notícias de semanas ou meses anteriores, mesmo que sejam relevantes para o tema. Se uma notícia encontrada for antiga, descartá-la e buscar uma alternativa da semana corrente.

**Não sugerir nenhuma pauta ainda.** Apenas apresentar o banco completo.

---

### Passo 5 — Aguardar seleção da Isa

A Isa vai selecionar 7 notícias (uma por editoria). Aguardar a lista completa antes de prosseguir.

---

### Passo 6 — Confirmar a ordem

Depois que a Isa selecionar as 7 pautas, confirmar a ordem das notícias.

As **3 primeiras** definem o assunto do e-mail e a saudação. Perguntar:
> "Qual a ordem que você quer pras 3 primeiras? Elas viram o assunto do e-mail."

Apresentar a tabela completa com a ordem proposta (4 a 7 seguem a sequência natural das editorias) e aguardar confirmação.

---

### Passo 7 — Buscar detalhes nas fontes primárias

Antes de escrever, fazer WebFetch em cada fonte primária de cada notícia selecionada para extrair:
- Dados numéricos concretos
- Citações relevantes
- Desdobramentos e contexto
- Links relacionados

Fazer todos os fetches em paralelo.

---

### Passo 7.5 — Buscar imagens para cada notícia

Para cada uma das 7 notícias, buscar 2-3 opções de imagem com crédito adequado. Fazer as 7 buscas em paralelo.

**Abordagem:**
1. Usar WebSearch buscando pelo título da notícia + "imagem" ou "foto" para encontrar imagens usadas na matéria original
2. Identificar a URL direta da imagem e a fonte (agência, fotógrafo, veículo)
3. Incluir link para a matéria original como segunda opção quando a imagem direta não estiver disponível
4. Sempre oferecer um termo de busca no Shutterstock como terceira opção

**Formatos de crédito aceitos:**
- `Foto: Reuters` / `Foto: AP` / `Foto: AFP`
- `Foto: Reprodução [Nome do Veículo]`
- `Foto: [Fotógrafo] / [Agência]`
- `Foto: Divulgação [Empresa]`
- `Foto: Shutterstock`

**Posicionamento:** As imagens de cada notícia devem ser inseridas **logo abaixo da linha fina (subtítulo em itálico)**, antes do primeiro parágrafo do texto. Usar o bloco abaixo para cada artigo:

```
> 📷 **Imagens sugeridas:**
> **Opção 1:** [Descrição — Crédito](URL direta da imagem)
> **Opção 2:** [Descrição — fonte do artigo](URL do artigo)
> **Opção 3 (Shutterstock):** "termo de busca sugerido"
```

**Não criar tabela de imagens separada no final do arquivo.** As imagens ficam embutidas em cada notícia.

---

### Passo 8 — Escrever a edição completa

Escrever todos os elementos da edição na ordem:

1. **Título da edição:** versão concisa do assunto do e-mail, sem "e muito mais!" — é o título do post no Beehiiv (aparece na URL e no topo da versão web)
2. **Saudação:** Abre com "Alôôô! Nova edição da Strig News chegou! 🙌" + lista todas as notícias em frase corrida + convite para avaliar
3. **Sumário:** Bloco "NOTÍCIAS DE HOJE - Sumário" com uma linha por notícia no formato exato: `EDITORIA: Título da notícia` — sem emoji, sem data, sem prefixo. Exemplo:
   ```
   EVENTOS & MUNDO: Apple processa OpenAI e ex-funcionários por roubo sistemático de segredos de hardware
   TECH & IA: Câmara vai votar regulação das big techs antes do recesso de 18 de julho
   ```
4. **Corpo da edição:** 7 notícias no formato padrão (ver abaixo)
5. **Meta title:** ~200 caracteres, palavras-chave SEO
6. **Meta descrição:** ~500 caracteres, cobre notícias 4-7
7. **Assunto do e-mail:** 3 notícias principais separadas por vírgula + "e muito mais!" (sem ponto final)
8. **Preview text:** "Chegou mais uma Strig News: [2-3 notícias] e muito mais nessa edição!" (~200 caracteres)

> **Ordem de apresentação no arquivo:** Título da edição → Saudação → Sumário → Corpo → Meta title → Meta descrição → Assunto do e-mail → Preview text → Links WhatsApp

**Formato de cada notícia:**
```
[EDITORIA EM CAPS]

Título (sem travessão — usar vírgula ou dois-pontos)
Subtítulo em itálico — 1 frase contextualizando o ângulo

Parágrafo 1: contexto e o que aconteceu
Parágrafos 2-4: desdobramentos, dados, implicações
Parágrafos 5-6: análise ou impacto para o leitor de marketing/tech

> "Citação relevante" - Fonte (quando houver)

O que mais foi destaque:
- [Outra notícia da mesma editoria que não virou artigo principal - Fonte](URL)
- [Outra notícia da mesma editoria que não virou artigo principal - Fonte](URL)
```

**Regra do "O que mais foi destaque":** os links são **outras notícias do banco** (Passo 4) que pertencem à mesma editoria da notícia principal mas que **não foram selecionadas para a edição**. Regras obrigatórias:
- **Nunca** usar links que aprofundam ou complementam o mesmo assunto da notícia principal — são notícias *diferentes* da mesma categoria.
- **Nunca** inventar ou buscar links novos nesse momento: usar apenas notícias que estavam no banco montado no Passo 4.
- Se uma notícia mudou de editoria (ex: uma pauta de TECH virou MARKETING), as notícias de destaque devem refletir a editoria *final* atribuída, não a original.
- Se não houver 2 notícias do banco na mesma editoria, usar 1 link ou buscar uma notícia relacionada à editoria que esteve na varredura mas não entrou no banco principal.
- Ex: na notícia de MARKETING, os links apontam para outros acontecimentos de marketing da semana que ficaram de fora — não para artigos relacionados à mesma empresa ou tema da notícia principal.

**Extensão por notícia:** 1.500 a 2.000 caracteres.

---

### Passo 8.5 — Gerar links de compartilhamento

Ao final da edição, gerar os links de compartilhamento via WhatsApp para cada uma das 7 notícias.

**Regra de geração da key (âncora Beehiiv):**
1. Pegar o título da notícia (o título em negrito, não a editoria)
2. Converter para MAIÚSCULAS
3. **Remover caracteres especiais/acentuados inteiramente** — não substituir pelo equivalente sem acento. Exemplos: `ç` → nada (não `C`), `ã` → nada (não `A`), `á` → nada, `é` → nada, `ú` → nada, `í` → nada, `ó` → nada. Ou seja: "lança" → "LANA", "precisão" → "PRECISO", "preços" → "PREOS", "histórico" → "HISTRICO"
4. Remover pontuação (vírgulas, dois-pontos, ponto de exclamação, %, parênteses, etc.)
5. Substituir espaços por hífens
6. Truncar em aproximadamente 35 caracteres (pode terminar em hífen se o corte cair entre palavras)

**Atenção:** sempre apresentar as keys como previsão e pedir que a Isa compare com a key real gerada pelo Beehiiv no editor, pois pequenas variações podem ocorrer.

**Formato do bloco de saída:**
```
[EDITORIA]
Matéria: [título]
Key prevista: #[KEY-EM-MAIUSCULAS-35-CHARS]
Link de compartilhamento:
https://wa.me/?text=Viu%20isso%20na%20Strig%20News:%20{{live_url}}%23[KEY-SEM-CERQUILHA]
```

Apresentar todos os 7 links em sequência após a edição completa.

**Observação:** `{{live_url}}` é um placeholder. A Isa substitui pela URL real da edição publicada no Beehiiv. Informar isso junto com os links.

---

### Passo 8.6 — Salvar a edição em arquivo .md

Salvar a edição completa (todos os elementos do Passo 8) em:
```
conteudo/strig-news/AAAA-MM-DD.md
```

Usar a data da edição (segunda-feira da semana coberta ou a data de publicação, conforme a Isa indicar).

---

### Passo 9 — Revisão e ajustes

Aguardar feedback da Isa sobre cada notícia. Ajustar o que for pedido antes de publicar no Beehiiv.

---

### Passo 10 — Criar rascunho no Beehiiv

Usar o MCP do Beehiiv com a publication ID `pub_cd70bc8f-1304-4e8a-833c-9d03506c887a` para criar o rascunho.

- Usar o template salvo no Beehiiv como base
- Preencher: assunto, preview text, corpo completo, meta title e meta descrição
- Status: **rascunho** (nunca publicar direto)
- Avisar a Isa quando o rascunho estiver criado para ela revisar imagens e detalhes finais no painel do Beehiiv

---

## Regras

- **Nunca repetir pautas** das últimas 3 edições publicadas
- **Sem travessões** em nenhuma parte do texto — usar vírgula, dois-pontos ou ponto
- **Sem siglas sem explicação** — sempre explicar antes de usar (ex: explicar FAANG antes de dizer que está aposentado)
- **Sem opinião** — tom de curador, não de colunista
- **Sem dados inventados** — só publicar números verificáveis na fonte
- **Creditar sempre** a fonte original de cada dado
- Varrer fontes **diretamente** (WebFetch), não só por buscas por palavras-chave
- Indicar claramente pautas descobertas só na varredura direta com ⚠️
