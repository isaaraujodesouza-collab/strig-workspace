---
name: publicar-social
description: >
  Publica ou agenda conteúdo em várias redes sociais de uma vez pelo Post for Me:
  Instagram (feed, stories, reels), Facebook (feed, stories, reels), LinkedIn,
  TikTok, Threads, X, YouTube, Pinterest e Bluesky. Cada cliente tem a própria
  chave de API e as próprias contas conectadas. Suporta agendamento com data e
  hora no fuso de São Paulo. Use quando o usuário pedir "publica no instagram",
  "posta no linkedin do cliente X", "sobe os stories", "agenda esse post pra
  terça", "publica em todas as redes", "posta o carrossel do [cliente]".
---

# /publicar-social — Publicar e agendar em várias redes

Publica no Instagram, Facebook, LinkedIn e nas demais redes conectadas de um cliente,
com uma chamada só. Quem decide as redes é a usuária: pediu uma, vai só nela; pediu
várias, vai em todas as pedidas.

Script: `.claude/skills/publicar-social/scripts/publicar-social.js`

---

## Antes de rodar

### Chave de API por cliente

Cada cliente tem o próprio espaço no Post for Me, com a própria chave. No `.env` da raiz:

```
POSTFORME_API_KEY_QUATA=pfm_...
POSTFORME_API_KEY_IBR=pfm_...
POSTFORME_API_KEY_KIT_LANCHE_EXPRESS=pfm_...
POSTFORME_API_KEY_SATURNO=pfm_...
```

A regra do nome: `POSTFORME_API_KEY_` + o slug do cliente em maiúsculas, com hífen e
espaço virando `_`. O `--cliente quata` procura `POSTFORME_API_KEY_QUATA`.

Se a chave do cliente não existir, o script cai na `POSTFORME_API_KEY` genérica. Se não
houver nenhuma, ele para e diz exatamente qual variável falta.

**Nunca commitar o `.env`** (já está no `.gitignore`).

### Conferir o que está conectado

Antes da primeira publicação de um cliente, sempre listar as contas:

```bash
node --env-file=.env .claude/skills/publicar-social/scripts/publicar-social.js \
  --cliente quata --listar-contas
```

Isso mostra plataforma, @ e o ID de cada conta conectada. Se faltar alguma rede, a
usuária precisa conectar no painel do postforme.dev antes.

---

## Como as redes são escritas

O `--redes` aceita uma lista separada por vírgula:

| O que escrever | Onde vai |
|---|---|
| `instagram` | feed do Instagram |
| `instagram-stories` (ou `stories`) | stories do Instagram |
| `instagram-reels` (ou `reels`) | reels do Instagram |
| `facebook` | feed do Facebook |
| `facebook-stories` | stories do Facebook |
| `facebook-reels` | reels do Facebook |
| `linkedin` | LinkedIn |
| `tiktok` | TikTok (sempre rascunho) |
| `threads`, `threads-reels` | Threads |
| `x` (ou `twitter`) | X |
| `youtube`, `pinterest`, `bluesky` | respectivas |
| `todas` | feed de toda plataforma conectada do cliente |

`todas` não inclui stories nem reels de propósito: essas peças usam mídia vertical
diferente, então precisam ser pedidas por nome.

---

## Como o script agrupa os posts

A API aceita **um placement por plataforma por post**. Então:

- Redes de feed (Instagram, Facebook, LinkedIn, TikTok...) entram **num post só**
- Stories vira **um post separado**
- Reels vira **outro post separado**

Isso é automático. `--redes "instagram,instagram-stories,facebook,linkedin"` cria 2 posts:
um de feed com as três redes, outro só com o stories do Instagram.

Detalhe do stories: se passar várias mídias, a API cria **um story por mídia**. O script
avisa no preview quando isso vai acontecer.

---

## Fluxo de trabalho

### 1. Descobrir o que publicar

Se a usuária chamou sem caminho, procurar as artes do cliente (pasta do projeto,
`conteudo/carrosseis/`, entregas do mês). Se não achar, perguntar o caminho.

Se existir um arquivo de copy junto das artes, usar como legenda.

### 2. Confirmar as redes

Se a usuária não disse as redes, perguntar. **Nunca assumir "todas".**

### 3. Dry-run

Sempre rodar com `--dry-run` primeiro. Ele valida tudo (contas, limites de legenda,
quantidade de mídia, data de agendamento) e mostra o preview sem enviar nada.

```bash
node --env-file=.env .claude/skills/publicar-social/scripts/publicar-social.js \
  --cliente quata \
  --redes "instagram,instagram-stories,facebook,linkedin" \
  --media "clientes/quata/agosto/slide-01.png,clientes/quata/agosto/slide-02.png" \
  --media-stories "clientes/quata/agosto/story.png" \
  --caption "legenda do post" \
  --agendar "2026-08-10 09:00" \
  --dry-run
```

### 4. Mostrar o preview e pedir confirmação

Repassar o preview do dry-run pra usuária: redes, contas, arquivos, quando vai sair.
**Só publicar depois de um "pode mandar" explícito.**

### 5. Publicar

Mesmo comando, sem `--dry-run`.

### 6. Confirmar

Informar os IDs dos posts criados e o status (`scheduled` ou `processing`). Lembrar que
o processamento leva alguns segundos e o resultado final aparece no painel do Post for Me.

---

## Argumentos

| Flag | O que faz |
|---|---|
| `--cliente <slug>` | escolhe a chave de API do cliente |
| `--redes "a,b,c"` | redes de destino (obrigatório) |
| `--media "a.png,b.png"` | arquivos do post |
| `--media-stories`, `--media-reels`, `--media-feed` | mídia específica daquele placement |
| `--caption "texto"` | legenda padrão (obrigatório) |
| `--caption-linkedin`, `--caption-instagram`, ... | legenda diferente só naquela rede |
| `--titulo "texto"` | título (TikTok e YouTube) |
| `--agendar "2026-08-10 09:00"` | agenda no fuso de São Paulo; ISO com fuso também vale |
| `--conta "instagram=spc_123"` | escolhe a conta quando o cliente tem mais de uma na mesma rede |
| `--draft` | cria como rascunho no Post for Me |
| `--dry-run` | valida e mostra o preview sem enviar |
| `--listar-contas` | lista as contas conectadas do cliente |

Sem `--agendar`, publica na hora.

---

## Exemplos

**Só o LinkedIn, agora:**
```bash
node --env-file=.env .claude/skills/publicar-social/scripts/publicar-social.js \
  --cliente quata --redes linkedin \
  --media "clientes/quata/agosto/post-01.png" \
  --caption "texto do post"
```

**Feed nas três redes, agendado:**
```bash
node --env-file=.env .claude/skills/publicar-social/scripts/publicar-social.js \
  --cliente ibr --redes "instagram,facebook,linkedin" \
  --media "clientes/ibr/agosto/slide-01.png,clientes/ibr/agosto/slide-02.png" \
  --caption "texto do carrossel" \
  --agendar "2026-08-12 08:30"
```

**Carrossel no feed + story de chamada, no mesmo agendamento:**
```bash
node --env-file=.env .claude/skills/publicar-social/scripts/publicar-social.js \
  --cliente kit-lanche-express --redes "instagram,instagram-stories" \
  --media "clientes/kit-lanche-express/agosto/slide-01.png,clientes/kit-lanche-express/agosto/slide-02.png" \
  --media-stories "clientes/kit-lanche-express/agosto/story.png" \
  --caption "legenda do carrossel" \
  --agendar "2026-08-11 12:00"
```

**Legenda diferente no LinkedIn:**
```bash
  --redes "instagram,linkedin" \
  --caption "versão Instagram, mais solta" \
  --caption-linkedin "versão LinkedIn, mais sóbria"
```

---

## Limites por rede

| Rede | Legenda | Mídia |
|---|---|---|
| Instagram | 2200 | 1 a 10 (feed) |
| Facebook | 63206 | 1 a 10 |
| LinkedIn | 3000 | até 20 |
| TikTok | 2200 | até 35 |
| Threads | 500 | até 20 |
| X | 280 | até 4 |
| Bluesky | 300 | até 4 |
| Pinterest / YouTube | 500 / 5000 | 1 |

Reels aceita exatamente 1 vídeo. Formatos: png, jpg, jpeg, webp, gif, mp4, mov.

O script valida tudo isso antes de subir arquivo. Se a legenda estourar em uma rede só,
usar `--caption-<rede>` em vez de encurtar pra todas.

---

## Regras

- NUNCA publicar sem confirmação explícita da usuária
- NUNCA assumir as redes: se não foi dito, perguntar
- Dry-run antes de toda publicação nova
- TikTok sai sempre como rascunho (a música é escolhida no app) — avisar a usuária
- Conferir se a chave usada é a do cliente certo antes de mandar: post no perfil errado não tem desfazer
- Cada cliente = um espaço no Post for Me = uma chave no `.env`
- Nunca commitar `.env`

---

## Erros comuns

| Mensagem | O que fazer |
|---|---|
| `401 não autorizado` | chave errada ou de outro cliente — conferir o `--cliente` |
| `Nenhuma conta X conectada` | conectar a rede no painel do postforme.dev |
| `Esse workspace tem N contas de X` | passar `--conta "x=spc_..."` com o ID certo |
| `Legenda de X tem N caracteres` | usar `--caption-<rede>` com versão mais curta |
| `--agendar aponta pro passado` | corrigir a data (o fuso é o de São Paulo) |

---

## Alternativa sem intermediário

Existe também `templates/skills/publicar-instagram/scripts/publish-graph-api.js`, que
publica carrossel direto pela Graph API do Meta, sem Post for Me. Só serve Instagram
feed, exige token que expira a cada 60 dias e um host de imagem (imgbb). Usar só se o
Post for Me estiver fora do ar ou indisponível pro cliente.
