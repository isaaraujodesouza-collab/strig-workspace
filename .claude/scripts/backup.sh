#!/usr/bin/env bash
# Backup do workspace Strig Lab para o GitHub.
# Usado pelo hook Stop (automático, silencioso) e pelo /syncar (manual, verboso).
#
#   backup.sh          -> modo automático: só fala se algo der errado
#   backup.sh --verbose -> mostra tudo (usado pelo /syncar)
#
# Trava de segurança: se o repositório remoto for comprovadamente PÚBLICO,
# o push é bloqueado. Documento de cliente não vai pro ar por acidente.

VERBOSE=0
[ "$1" = "--verbose" ] && VERBOSE=1

say()  { [ "$VERBOSE" = "1" ] && echo "$@"; return 0; }
warn() { echo "$@" >&2; }

cd "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || exit 0
git remote get-url origin >/dev/null 2>&1 || { say "Sem remote configurado."; exit 0; }

# --- 1. Trazer a memória do Claude para dentro do workspace ---
# A memória mora fora da pasta (em ~/.claude/projects/...), então não seria
# salva pelo git. Copiamos para _contexto/memoria/ a cada backup.
MEM_SRC="$HOME/.claude/projects/c--Users-isaar-OneDrive-Documentos-strig-workspace/memory"
MEM_DST="_contexto/memoria"
if [ -d "$MEM_SRC" ]; then
  mkdir -p "$MEM_DST"
  cp -f "$MEM_SRC"/*.md "$MEM_DST"/ 2>/dev/null
  say "Memória copiada para $MEM_DST/ ($(ls -1 "$MEM_DST"/*.md 2>/dev/null | wc -l) arquivos)."
fi

# --- 2. Commit local (sempre seguro: nada sai da máquina) ---
git add -A >/dev/null 2>&1
if git diff --staged --quiet; then
  say "Tudo já sincronizado. Nada novo pra salvar."
  exit 0
fi

N=$(git diff --staged --name-only | wc -l)
MSG="${BACKUP_MSG:-auto-sync: $(date +'%Y-%m-%d %H:%M')}"
git commit -m "$MSG" >/dev/null 2>&1
say "Commit local: $N arquivo(s)."

# --- 3. Trava de privacidade (antes de enviar pra fora) ---
# API do GitHub sem autenticação: 200 = repo público (BLOQUEIA o push).
# 404 = privado ou inexistente. 000 = sem rede. Nesses casos segue,
# porque só bloqueamos quando dá pra PROVAR que está público.
SLUG=$(git remote get-url origin | sed -E 's#^(https://github\.com/|git@github\.com:)##; s#\.git$##')
CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 8 "https://api.github.com/repos/$SLUG" 2>/dev/null || echo 000)
if [ "$CODE" = "200" ]; then
  warn ""
  warn "  PUSH BLOQUEADO — o repositório está PÚBLICO."
  warn "  github.com/$SLUG"
  warn ""
  warn "  Tem documento de cliente aqui dentro. Torne o repositório privado:"
  warn "  Settings > General > Danger Zone > Change visibility > Make private"
  warn ""
  warn "  Seus $N arquivo(s) já estão commitados na máquina. Nada foi perdido."
  warn "  Assim que tornar privado, rode /syncar que ele envia tudo."
  warn ""
  exit 0
fi

# --- 4. Push ---
if git push --quiet 2>/dev/null; then
  say "Salvo no GitHub: $N arquivo(s). https://github.com/$SLUG"
else
  warn "Commit feito localmente, mas o push falhou (rede ou autenticação)."
  warn "Seu trabalho está salvo na máquina. Rode /syncar quando voltar a conexão."
fi
