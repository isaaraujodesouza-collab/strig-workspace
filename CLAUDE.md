# Strig Lab — Claude Code OS

Workspace central da Agência Strig Lab para produção de conteúdo, entregas de clientes, desenvolvimento web e operação interna.

## Sobre o negócio

Agência Strig Lab (Santo André/SP) — marketing digital e consultoria. Ajuda negócios locais, PMEs e autônomos a construir estrutura digital estratégica e gerar clientes de forma previsível. Conceito central: "we are dreammakers".

**Fundadores:** Isabelle Araujo de Souza (Isa) e Cristhyan Correa Nunes (Chrys). Equipe: Marina (estagiária), Ryan (estagiário), Tati (SDR).

## O que mais fazemos aqui

- PPD (Pacote de Posicionamento Digital): GMB + Landing Page + Instagram otimizados em 30 dias
- Social media (planejamento, edição, postagem) e tráfego pago (Meta Ads, Google Ads)
- Copywriting com framework N3 e planejamento editorial com método CRESCER
- Sites e landing pages em HTML + Tailwind CSS
- Consultoria estratégica e documentos de posicionamento
- Strig News — newsletter semanal de marketing e tecnologia (strignews.beehiiv.com)

## Clientes ativos

Quatá (M&A/valuation, LinkedIn), IBR (contratos financeiros, tráfego + social), Saturno (manutenção de site), Kit Lanches Express (social media).

## Tom de voz

Direto, provocativo, educativo. Frases curtas. Anti-guru, anti-clichê. Sem travessões. Entrega o pedido antes de explicar.

## Estrutura de pastas

```
clientes/           — pasta por cliente com briefing e entregas
ppd/                — templates e projetos do Pacote de Posicionamento Digital
propostas/          — propostas comerciais
conteudo/           — produção interna (Strig News, redes sociais da agência)
dados/              — drop zone pra arquivos a analisar (CSV, PDF, XLSX)
marca/              — identidade visual da Strig Lab
_contexto/          — empresa, preferências e estratégia (lido em toda sessão)
templates/skills/   — templates de skills prontos pra personalizar com /mapear
templates/ferramentas/catalogo.md — APIs e ferramentas disponíveis pra usar em skills
```

## Comandos disponíveis

| Comando | Quando usar |
|---|---|
| `/iniciar` | Início de cada sessão — carrega contexto e pergunta o que fazer |
| `/mapear` | Entrevista sobre processos repetitivos e cria skills personalizadas |
| `/syncar` | Salvar trabalho no GitHub (commit + push) |
| `/atualizar` | Varre o projeto e atualiza arquivos de contexto desatualizados |
| `/novo-projeto` | Cria pasta de projeto/cliente com CLAUDE.md dedicado |
| `/setup` | Refaz a configuração do sistema |

Skills disponíveis: `/carrossel`, `/proposta-comercial`, `/publicar-site`, `/slide`, `/analisar-dados`, `/roteiro-post`, `/email-profissional`.

**Skills de social media (Strig Lab):** `/pesquisa-social`, `/planejamento-editorial`, `/copy-post`, `/relatorio-social` (relatório de orgânico em dashboard HTML+PDF via Python, roda `.claude/skills/relatorio-social/scripts/build_relatorio_social.py`), `/apresentacao-aprovacao`, `/subir-tarefas-clickup` (sobe as tasks do planejamento e copies validados pro ClickUp, na lista "Produção de conteúdo" do espaço de cada cliente).

**Segredos:** chaves de API ficam em `.env` (já no `.gitignore`). Skills referenciam via `--env-file=.env`.

**Auto-sync:** `.claude/settings.json` tem um hook `Stop` que faz `git add -A && git commit && git push` ao final de toda sessão.

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (se existirem e estiverem configurados):

1. `_contexto/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_contexto/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_contexto/estrategia.md` — foco atual, prioridades, o que pode esperar

Usar essas informações como base pra qualquer resposta ou decisão. Ao sugerir prioridades, formatos ou abordagens, considerar o foco atual descrito em `estrategia.md`.

Para qualquer tarefa visual (carrossel, proposta, slide, landing page), consultar `marca/design-guide.md` como referência de estilo.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas usar o contexto naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe uma skill relevante em `.claude/skills/` ou `.claude/commands/`.
Se encontrar, seguir as instruções da skill.
Se não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível (o usuário provavelmente vai pedir de novo no futuro), perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais ou perguntas simples. Só quando o padrão de repetição for claro.

---

## Aprender com correções

Quando o usuário corrigir algo, melhorar uma resposta ou dar uma instrução que parece permanente (frases como "na verdade é assim", "não faça mais isso", "prefiro assim", "sempre que...", "evita...", "da próxima vez..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar onde faz mais sentido salvar:

- **Sobre o negócio** (quem são os clientes, como funciona a empresa, serviços, mercado) → adicionar em `_contexto/empresa.md`
- **Sobre preferências e estilo** (tom de voz, formato de resposta, o que evitar, como estruturar textos) → adicionar em `_contexto/preferencias.md`
- **Sobre prioridades e foco atual** (projetos em andamento, metas do momento, prazos importantes, o que é prioridade agora) → adicionar em `_contexto/estrategia.md`
- **Regra de comportamento nessa pasta** (onde salvar arquivos, como nomear, fluxos específicos) → adicionar no próprio `CLAUDE.md`

Salvar com uma linha nova clara, sem reformatar o arquivo inteiro. Confirmar o que foi salvo mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato (ex: "na verdade o arquivo se chama X"). Só perguntar quando a informação tiver valor duradouro.

---

## Manter contexto atualizado

Ao terminar uma tarefa que mudou algo relevante no projeto (novo cliente, nova skill, mudança de foco, novo processo, ferramenta instalada, estrutura de pastas alterada), perguntar:

> "Isso mudou algo no teu contexto. Quer que eu atualize os arquivos de memória?"

Se sim, identificar o que precisa atualizar:

- **Novo cliente, serviço, ferramenta, equipe** → `_contexto/empresa.md`
- **Mudança de prioridade ou foco** → `_contexto/estrategia.md`
- **Correção de tom ou estilo** → `_contexto/preferencias.md`
- **Nova pasta, regra de organização, skill criada** → `CLAUDE.md`
- **Mudança visual (cores, fontes, logo)** → `marca/design-guide.md`

Mostrar o que vai mudar antes de salvar. Não reformatar o arquivo inteiro, só adicionar ou editar a linha relevante.

**Quando NÃO perguntar:**
- Tarefas pontuais que não mudam o contexto (ex: escrever um email, criar um post avulso)
- Perguntas simples ou conversas sem ação
- Mudanças que já foram salvas pelo bloco "Aprender com correções"

**Dica:** se não sabe se algo mudou, rode `/atualizar` pra uma varredura completa.

---

## Criação de skills

Quando o usuário pedir pra criar uma nova skill:

1. Verificar se existe um template relevante em `templates/skills/`. Se existir, usar como base e adaptar pro contexto do usuário
2. Perguntar: "Essa skill é específica pra esse projeto ou vai ser útil em qualquer projeto?"
   - Específica desse negócio → salvar em `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Útil em qualquer projeto → salvar em `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_contexto/empresa.md` e `_contexto/preferencias.md` pra calibrar o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, referências, exemplos), criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code
