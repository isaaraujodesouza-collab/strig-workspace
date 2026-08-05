---
name: publicar-instagram
description: >
  Publica carrossel direto no Instagram pela Graph API do Meta, sem intermediário.
  Só Instagram feed. Use apenas quando o Post for Me não estiver disponível pro cliente
  — no dia a dia, a skill de publicação é a /publicar-social.
---

# publicar-instagram — fallback pela Graph API do Meta

> **Esta skill foi superada pela `/publicar-social`.**
>
> A `/publicar-social` (`.claude/skills/publicar-social/`) publica e agenda em Instagram
> (feed, stories, reels), Facebook, LinkedIn, TikTok e outras redes, com chave de API
> separada por cliente. É ela que deve ser usada no dia a dia.
>
> O que sobrou aqui é o caminho pela Graph API do Meta, útil só como plano B: quando o
> Post for Me estiver fora do ar ou o cliente não tiver espaço contratado. Publica
> carrossel no feed do Instagram e mais nada.
>
> O antigo `scripts/publish-postforme.js` foi removido: apontava pra
> `https://app.postforme.dev/api`, que responde 404. O host correto é
> `https://api.postforme.dev`, já usado pela `/publicar-social`.

---

## Setup da Graph API

1. **Configurar o app no Meta Developer:**
   - Acessar developers.facebook.com e criar um app tipo "Empresa"
   - Ativar o produto "Instagram Graph API"
   - No Graph API Explorer (developers.facebook.com/tools/explorer/), selecionar o app
     e gerar um token com os escopos:
     - `instagram_content_publish`
     - `instagram_basic`
     - `pages_read_engagement`

2. **Converter o token pra longa duração (60 dias):**
   ```bash
   curl -s "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=TOKEN_CURTO"
   ```

3. **Pegar o Instagram User ID:**
   ```bash
   curl -s "https://graph.facebook.com/v21.0/me/accounts?access_token=TOKEN_LONGO"
   ```
   Com o Page ID em mãos:
   ```bash
   curl -s "https://graph.facebook.com/v21.0/PAGE_ID?fields=instagram_business_account&access_token=TOKEN_LONGO"
   ```

4. **Configurar o imgbb (host de imagem):**
   A Graph API exige URL pública pra cada imagem. Criar conta em api.imgbb.com e copiar
   a API Key.

5. **Salvar no `.env`:**
   ```
   INSTAGRAM_ACCESS_TOKEN=token_longo_aqui
   INSTAGRAM_USER_ID=id_aqui
   IMGBB_API_KEY=key_aqui
   ```

6. **Avisar sobre renovação:** o token expira em 60 dias e precisa ser regerado.

---

## Uso

```bash
# Dry-run (monta o carrossel mas não publica)
node --env-file=.env scripts/publish-graph-api.js \
  --images "slide-01.png,slide-02.png" \
  --caption "legenda" \
  --dry-run

# Publicar
node --env-file=.env scripts/publish-graph-api.js \
  --images "slide-01.png,slide-02.png" \
  --caption "legenda"
```

---

## Limitações

- Só Instagram, só feed, só carrossel (2 a 10 imagens)
- Sem agendamento: publica na hora
- Sem stories, sem reels
- Legenda máx. 2200 caracteres
- Token expira a cada 60 dias
- As imagens passam pelo imgbb, ou seja, ficam com URL pública

Para qualquer coisa além disso, usar a `/publicar-social`.

---

## Regras

- NUNCA publicar sem confirmação explícita da usuária
- Rodar `--dry-run` antes da publicação real
- Se o token expirou, guiar a renovação em vez de repassar erro genérico da API
- Nunca commitar `.env`
