# Conectar contas novas no Post for Me

Roteiro de como ligar as redes de um cliente novo. Escrito depois de configurar
Strig Lab, IBR, Strig News e Kit Lanche Express em 05/08/2026.

---

## Apps do Meta já criados

Não criar app novo. Reaproveitar estes.

| App | ID | Serve pra |
|---|---|---|
| Post For Me | `3932671904358600` | Facebook e Instagram (Facebook Login) |
| Post For Me-IG | `887987674164762` | Instagram direto (login do próprio Instagram) |

As chaves secretas ficam no painel do Meta. São **duas diferentes**, uma por app.
Trocar uma pela outra dá o erro `Invalid platform app`.

Os dois apps estão em modo Desenvolvimento. Não precisa ir pro modo Ao Vivo enquanto
quem conecta as contas for a Isa, que é admin dos apps.

---

## Qual caminho usar

| Acesso que você tem | Caminho | Conecta |
|---|---|---|
| Meta Business do cliente | Instagram (Facebook Login) | Facebook + Instagram |
| Só o login do Instagram | Instagram direto | só Instagram |
| Os dois | Facebook Login | Facebook + Instagram, sem usar a senha do cliente |

Regra prática: se tem acesso ao Business, usa Facebook Login. Só cai no Instagram
direto quando não tem Página, ou quando o vínculo Página/Instagram está quebrado.

Requisito dos dois caminhos: o Instagram do cliente precisa estar em modo **Comercial
ou Criador de Conteúdo**. Conta pessoal não conecta de jeito nenhum.

---

## Caminho A — Facebook Login (Facebook + Instagram)

1. Cria o projeto no Post for Me e anota o `proj_...` da URL.

2. Cadastra as duas URLs em
   https://developers.facebook.com/apps/3932671904358600/fb-login/settings/
   no campo **URIs de redirecionamento do OAuth válidos** (rola até depois das
   chavinhas de liga/desliga, não é o validador do topo):

   ```
   https://app.postforme.dev/callback/<proj_id>/facebook/account
   https://app.postforme.dev/callback/<proj_id>/instagram/account
   ```

   Acrescenta, não substitui. Salva no botão do rodapé.

3. No Setup do projeto, configura os cards **Facebook** e **Instagram (Facebook
   Login)** com o App ID `3932671904358600` e a chave secreta do app do Facebook.

4. Connect an Account → **Facebook** → escolhe a Página do cliente.

5. Connect an Account → **Instagram** → **Connection Type em `facebook`**.

---

## Caminho B — Instagram direto

1. Cadastra a URL em https://developers.facebook.com/apps/3932671904358600/dashboard/
   → menu esquerdo **Instagram** → **Configuração da API com login do Instagram** →
   seção **3. Configurar login do negócio**:

   ```
   https://app.postforme.dev/callback/<proj_id>/instagram/account
   ```

   Esse campo é separado do campo do Facebook Login. Preencher um não preenche o outro.

2. No Setup do projeto, card **Instagram** (o puro) com App ID `887987674164762` e a
   chave secreta **do app do Instagram**.

3. https://developers.facebook.com/apps/3932671904358600/roles/roles/ → seção
   **Testadores do Instagram** → Adicionar pessoas → o @ do cliente sem arroba.

4. Logada no Instagram do cliente, aceita em
   https://www.instagram.com/accounts/manage_access/ → aba **Convites de testador**.
   O status na tela de Funções tem que sair de Pendente.

5. Connect an Account → **Instagram** → **Connection Type em `instagram`**.

---

## Erros e o que cada um significa

| Erro | Causa | Solução |
|---|---|---|
| `Invalid platform app` | chave do app errada pro caminho escolhido | Facebook Login usa `3932671904358600`, Instagram direto usa `887987674164762` |
| `Invalid redirect_uri` | URL não cadastrada na lista daquele caminho | conferir se foi no campo certo, são duas listas separadas |
| `URL bloqueada` | mesma coisa, do lado do Facebook Login | cadastrar em fb-login/settings e **salvar** |
| `Cargo de programador insuficiente` | convite de testador não aceito | aceitar pelo Instagram do cliente |
| `No valid accounts found` | autorização antiga sem a Página marcada | editar em Integrações comerciais (ver abaixo) |
| conecta a Página do cliente errado | mesma causa | idem |

### Integrações comerciais

O Facebook guarda quais Páginas foram autorizadas na primeira vez e não pergunta de novo.
Quando aparecer a Página errada, ou nenhuma:

https://www.facebook.com/settings?tab=business_tools → app **Post For Me** →
**Visualizar e editar** → marcar **Optar por todas as Páginas atuais e futuras**.

Com essa opção ligada, cliente novo não precisa passar por essa tela.

Atenção: é a aba **Integrações comerciais**, não a de Apps e sites.

---

## Como está cada projeto (05/08/2026)

| Projeto | Project ID | Instagram por | Connection Type |
|---|---|---|---|
| Strig Lab | `proj_foqHB0wQMamo0Eh9ICvp5` | Facebook Login | `facebook` |
| IBR | `proj_7X8BBG9OiP34zPEWHgvIa` | direto | `instagram` |
| Strig News | `proj_L3hvVArGjAinNM4d3KkhR` | direto | `instagram` |
| Kit Lanche Express | `proj_kktfboyIUQmgWojwLqf` | direto | `instagram` |

Faltam Quatá e Saturno.

---

## Outras redes

**Threads** exige app novo no Meta, criado com o caso de uso "Acessar a API do Threads".
Não dá pra adicionar o produto num app existente. Callback
`/callback/<proj_id>/threads/account` e uninstall `/callback/<proj_id>/threads/uninstall`.
Tem convite de testador igual ao do Instagram, aceito em Configurações → Permissões de
sites → Convites, dentro do Threads.

**LinkedIn** precisa de app no painel do LinkedIn, vinculado a uma Página e verificado.
Publicar no perfil pessoal usa Share on LinkedIn + Sign In with LinkedIn. Publicar em
**Página** exige o **Community Management API**, que só é liberado pra empresa registrada,
passa por análise de alguns dias, e **precisa ser o único produto do app**. Se o app já
tem outros produtos, o botão fica cinza. Solução: app separado só pra isso.
Depois de aprovado, conectar a Página só funciona **via API**, não pelo painel.

**X (Twitter)** exige conta de desenvolvedor aprovada e o plano gratuito tem limite baixo
de publicações. Conferir o limite atual antes de investir tempo.
