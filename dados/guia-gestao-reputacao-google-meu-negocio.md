Guia de Gestão de Reputação Digital — Google Meu Negócio

As três diretrizes de gestão

Agilidade: O tempo de resposta ideal é de até 48 horas. Respostas rápidas sinalizam ao Google e ao cliente que a [Empresa] é ativa e atenciosa — e isso impacta diretamente o ranqueamento local nos resultados de busca.

Personalização: Evite respostas genéricas e copiadas. Use o nome do cliente e mencione detalhes específicos citados na avaliação. A resposta precisa parecer escrita para aquela pessoa, não para qualquer um.

Estratégia de SEO: Sempre que possível, insira termos relevantes na resposta, como "[serviço/produto] em [bairro]", "[serviço/produto] na [região]", "[serviço/produto] em [cidade]". Isso reforça o ranqueamento orgânico da [Empresa] nas buscas locais.

1. Avaliações positivas (4 e 5 estrelas)

O objetivo é transformar o elogio em prova social, reforçar o posicionamento da marca e fortalecer o SEO com palavras-chave relevantes.

Estrutura da resposta:
- Agradecimento mencionando o nome do cliente
- Reiteração do padrão da [Empresa]: resultado consistente, pontualidade, ambiente
- Reforço do diferencial da equipe quando o serviço for mencionado
- Convite para retorno com facilidade de agendamento

Modelo:
> Olá, [Nome]! Muito obrigado pela avaliação. Fico feliz que a experiência aqui na [Empresa] foi exatamente o que você esperava. Nossa equipe se dedica para garantir que cada [serviço/produto] saia do jeito certo — toda vez. Qualquer hora que quiser voltar, é só agendar pelo app ou chamar no WhatsApp. Te esperamos aqui em [bairro/região]!

2. Avaliações negativas (1 a 3 estrelas)

O foco não é o embate com quem reclamou — é demonstrar profissionalismo para os futuros clientes que vão ler a resposta. Nunca discuta publicamente. O objetivo é mostrar que a [Empresa] é séria, resolve e se importa.

Estrutura da resposta:
- Empatia imediata, sem assumir culpa publicamente
- Neutralidade: evite repetir palavras negativas para não associá-las à busca
- Migração do conflito para canal privado via WhatsApp

Modelo:
> Olá, [Nome]. Obrigado por compartilhar sua percepção. Lamentamos que a experiência não foi como esperava — isso não reflete o padrão que nos comprometemos a entregar. Gostaríamos de entender melhor o que aconteceu. Por favor, chama a gente direto no WhatsApp ([telefone]) para que a gente possa conversar e resolver da melhor forma.

3. Avaliações sem texto (só estrelas)

Responda mesmo assim, o algoritmo do Google valoriza a atividade e os futuros clientes também observam isso.

Se for 5 estrelas:
> Obrigado pela nota, [Nome]! Fico feliz com a avaliação. Qualquer hora que quiser, é só agendar — te esperamos na [Empresa]!

Se for nota baixa:
> Olá, [Nome]. Obrigado pela avaliação. Ficamos à disposição para entender melhor — chama a gente no WhatsApp ([telefone]) para a gente conversar de forma privada.

---
Como usar: substitua [Empresa], [Nome], [telefone], [serviço/produto], [bairro/região] e [cidade] pelos dados reais do cliente antes de aplicar. Para nichos de serviço puro (ex: consultoria, clínica), "serviço/produto" vira o nome do atendimento prestado; para nichos de produto (ex: loja, e-commerce), vira o item vendido.

---

## Sequência de prompts para gerar as respostas

Use esses prompts em ordem, um de cada vez, com um LLM (Claude, ChatGPT etc). Cole este guia junto no primeiro prompt como referência.

**Prompt 1 — Setup do cliente (rodar uma vez por cliente)**
> Aqui está meu guia de gestão de reputação digital para Google Meu Negócio [colar o guia]. Vou usar esse guia pra responder avaliações do seguinte negócio: Empresa: [nome] | Nicho: [ex: barbearia, clínica, loja] | Serviço/produto principal: [ex: corte masculino, consulta odontológica] | Bairro: [bairro] | Região/cidade: [região, cidade] | Telefone/WhatsApp: [telefone]. Confirme que entendeu o contexto e fique pronto para gerar respostas seguindo a estrutura do guia.

**Prompt 2 — Resposta a avaliação positiva (com texto)**
> Gere uma resposta para esta avaliação de 4 ou 5 estrelas, seguindo a estrutura de avaliações positivas do guia (agradecimento + reiteração de padrão + diferencial da equipe se aplicável + convite de retorno) e inserindo naturalmente um termo de SEO local. Avaliação: "[colar avaliação]" | Nome do cliente: [nome, se disponível].

**Prompt 3 — Resposta a avaliação negativa (com texto)**
> Gere uma resposta para esta avaliação de 1 a 3 estrelas, seguindo a estrutura de avaliações negativas do guia (empatia sem assumir culpa + neutralidade sem repetir palavras negativas + migração para WhatsApp). Avaliação: "[colar avaliação]" | Nome do cliente: [nome, se disponível].

**Prompt 4 — Resposta a avaliação sem texto (só estrelas)**
> Gere uma resposta curta para uma avaliação de [X] estrelas sem comentário escrito, seguindo o modelo do guia para avaliações sem texto. Nome do cliente: [nome, se disponível].

**Prompt 5 — Lote de avaliações (quando tiver várias de uma vez)**
> Tenho um lote de avaliações para responder. Para cada uma, identifique se é positiva, negativa ou sem texto, e gere a resposta seguindo a estrutura correspondente do guia. Liste as respostas numeradas na mesma ordem das avaliações. Avaliações: [colar lista, uma por linha, com nome e nota quando disponível].

**Prompt 6 — Revisão de tom (opcional, antes de publicar)**
> Revise essa resposta que gerei e confirme se ela segue as três diretrizes do guia (agilidade percebida, personalização real — não genérica — e presença de termo de SEO local). Se faltar algo, reescreva. Resposta: "[colar resposta gerada]".
