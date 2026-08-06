---
name: syncar
description: >
  Salva TUDO do workspace no GitHub (commit + push) e audita o que está ficando de fora.
  Use quando quiser garantir que o trabalho está seguro, ao final de uma sessão produtiva,
  ou quando o usuário disser "salva no github", "faz commit", "synca", "syncar",
  "backup no github", "salva tudo", "manda pro github", "o que não está salvo?".
  Também configura o git pela primeira vez se ainda não estiver configurado.
---

# /syncar — Salvar tudo no GitHub

**Princípio deste workspace: salvar TUDO.** Documento de cliente, Strig News, copies,
planejamentos, artes, memória. Só ficam de fora segredos (`.env`) e lixo regenerável
(`node_modules/`). Se algo de trabalho não está sendo salvo, isso é um bug — conserte.

---

## Passo 1: Auditoria (SEMPRE rodar primeiro)

Não confie no `.gitignore`. Verifique o que ele está engolindo:

```bash
git ls-files --others --ignored --exclude-standard \
  | grep -vE "node_modules|^\.env|__pycache__|\.venv" \
  | head -40
```

**Se aparecer qualquer arquivo de trabalho nessa lista, pare e avise a usuária.**
É trabalho sem backup. Mostre o que é e pergunte se pode incluir no `.gitignore`.
Documento de cliente, `.md`, `.png` de arte, `.pdf` de relatório — nada disso deveria
estar aí.

Se a lista voltar vazia (ou só com lixo), siga.

---

## Passo 2: Ver o estado

```bash
git status --short
git remote get-url origin 2>/dev/null
```

---

## Fluxo A: sem remote configurado (primeira vez)

Se `git remote get-url origin` não retornar nada:

> "Seu workspace ainda não está conectado a um repositório no GitHub.
>
> 1. Acesse github.com/new
> 2. Crie o repositório **como privado** (tem documento de cliente aqui)
> 3. Não inicialize com README — deixa vazio
> 4. Me passa o link"

Depois:

```bash
git remote add origin [link]
git branch -M main
git push -u origin main
```

---

## Fluxo B: tem mudanças — salvar

Rode o script de backup, que já cuida de memória, trava de privacidade, commit e push:

```bash
BACKUP_MSG="sync: [descrição curta do que foi feito]" bash .claude/scripts/backup.sh --verbose
```

Para a descrição, use o que foi feito na sessão ("sync: copies de setembro do IBR",
"sync: edição da Strig News 04/08"). Se não souber, use `sync: atualizações do dia`.

O script faz, nesta ordem:
1. Copia a memória do Claude (`~/.claude/projects/.../memory/`) para `_contexto/memoria/`
2. **Bloqueia o push se o repositório estiver público** — documento de cliente não vaza
3. Commit + push

Após o push, confirme com o número de arquivos e a URL.

---

## Fluxo C: sem mudanças

> "Tudo já está sincronizado. Nenhuma mudança nova pra salvar."

---

## Fluxo D: backup bloqueado (repositório público)

O script recusa o push e explica. Reforce:

> "O repositório está público e tem documento de cliente aqui dentro.
> Torne privado em Settings > General > Danger Zone > Change visibility > Make private.
> Seu trabalho continua salvo na máquina — nada foi perdido."

---

## Fluxo E: erro no push

> "Não consegui enviar pro GitHub. O erro foi: [mensagem]
>
> Causas mais comuns:
> - Sem conexão com internet
> - Precisa configurar autenticação no GitHub (token ou SSH)
>
> Seu commit já está salvo na máquina. Me diz se quer resolver agora."

---

## Regras

- **Auditoria sempre antes do commit.** É o passo que impede trabalho de sumir silenciosamente.
- Nunca commitar `.env` ou qualquer arquivo com chave. Antes de incluir pasta nova,
  varrer: `grep -rInE "(sk-|pfm_|ghp_|AIza)" [pasta]`
- Nunca sugerir ignorar pasta de trabalho pra "deixar o repo leve". Trabalho vale mais que espaço.
- Tom direto — não explica git em detalhes a não ser que o usuário pergunte
- Se der erro, sempre mostrar o que fazer a seguir — nunca só mostrar o erro
