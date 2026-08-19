# Régua de CRM — Pós-venda (Régua 2B)

Decisões tomadas em sessão de brainstorm com a Isa. Documento vivo, atualizar conforme o raciocínio avançar.

**Regra fixa que vale pra toda régua de CRM da Kit Lanche Express:** nunca usar a sigla "KLE" em nenhuma peça, sempre "Kit Lanche Express" por extenso (diretriz de copy do cliente, `diretrizes-copy.md`). Ver também `regua-crm-boas-vindas.md` (Régua 1) e `regua-crm-orcamento-aberto.md` (Régua 2A).

---

## Estrutura geral da régua

3 e-mails · ~21 dias · ataca os 87% que não recompram. Dois objetivos empilhados: coletar satisfação e prova social (E07/E08), e provocar a segunda compra (E09).

**Gatilho:** negócio ganho com entrega concluída.
**Saída:** nova compra, ou fim da sequência.
**Ramificação:** por nota de satisfação, no E07.
**UTM:** `utm_campaign=kle_posvenda`

---

## E07 — Como foi o evento (D+1 após o evento)

**Decisão: manter a estrutura do rascunho original**, considerada boa como está. Zero venda, escala clicável de 0 a 10 + pergunta aberta opcional, curto de propósito pra maximizar taxa de resposta.

**Único acréscimo:** gancho de fechamento, "conte com a gente quando precisar". Não é CTA de venda, é porta aberta — mantém o "zero venda" porque não pede nada, só reforça proximidade e disponibilidade.

**Roteamento (mantido do rascunho original):** nota 9–10 aplica tag `promotor`, segue pro E08. Nota ≤8 aplica tag `detrator`, sai do fluxo automático, gera tarefa interna pra contato humano — detrator não recebe e-mail automático.

**Blocos:**
1. Agradecimento em duas linhas
2. Escala de 0 a 10 clicável
3. Pergunta aberta opcional
4. "Conte com a gente quando precisar" (novo)
5. Assinatura pessoal

**Dependência técnica (do rascunho original, ainda não confirmada):** escala clicável exige links distintos por nota, com captura de volta no Mailchimp por tag ou merge field. Confirmar viabilidade no plano contratado.

---

## E08 — Prova social (D+3, só para tag `promotor`)

**Objetivo mantido do rascunho original** (converter satisfação em ativo público), mas o pedido deixa de ser genérico e passa a ser ancorado no pedido real que a pessoa fez.

**Por que personalizar em vez de generalizar:** a Isa queria que esse e-mail também gerasse fidelidade, não só review. Testado e descartado o caminho de apresentar outros tipos de kit aqui (isso é território do E09, "a próxima compra" — os dois e-mails competiriam pelo mesmo espaço). A fidelidade acaba vindo de dois lugares que já existiam na estrutura, só precisavam ser escritos com essa intenção:
1. O pedido ancorado no que ela contratou especificamente ("você pediu X") — sinaliza conta conhecida, não disparo em massa
2. O bloco "o que a avaliação muda pra outro gestor" — transforma o favor em contribuição, dá à pessoa um papel de quem ajuda outro gestor a decidir com mais segurança, não só de cliente que presta favor

Nenhum terceiro elemento novo entra no e-mail — os dois blocos acima já resolvem o objetivo de fidelidade sem precisar de gancho extra pro E09 nem de produto.

- **CTA primário:** avaliar no Google
- **CTA secundário:** autorizar depoimento nominal com nome e empresa
- **Blocos:** referência à nota que ele deu · o pedido ancorado no que ela contratou, em uma frase · o que a avaliação muda pra outro gestor · os dois CTAs · assinatura pessoal
- **Não fazer:** oferecer brinde ou desconto em troca de avaliação — queima a credibilidade da prova, que é o ativo. Também não apresentar outros tipos de kit aqui, isso é trabalho do E09.

---

## E09 — O próximo evento (D+21, a confirmar intervalo real)

Ainda não revisitado nessa sessão. Estrutura do rascunho original:

- **Objetivo:** a segunda compra — e-mail mais importante da sequência de 12, ataca o 13% de recompra diretamente
- **CTA primário:** pedir orçamento do próximo evento, com cupom rastreável
- **Ângulo:** facilitar, não empurrar. Caminho curto pra quem já é cliente (sem orçamento do zero, histórico já no sistema), condição de recompra e código
- **Blocos:** hook no próximo evento · caminho curto pra quem já é cliente · cupom com código e prazo · calendário de eventos ancorado no calendário corporativo real (SIPAT, convenção, confraternização, conforme o mês) · CTA
- **Dependência bloqueante:** o código de cupom precisa existir no fluxo de pedido. Se não existir, a condição sai, substituída por caminho preferencial com registro de origem no Pipedrive. Copy não começa antes dessa confirmação.

---

## Em aberto pra próxima sessão

- E08 ainda não revisitado
- E09 ainda não revisitado
- Confirmar viabilidade técnica da escala clicável do E07 (Mailchimp, tag/merge field por nota)
- Confirmar se existe cupom rastreável no fluxo de pedido pro E09
