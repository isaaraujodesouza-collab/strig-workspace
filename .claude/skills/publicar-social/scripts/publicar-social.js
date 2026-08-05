#!/usr/bin/env node
/**
 * publicar-social.js — publica ou agenda conteudo em varias redes via Post for Me.
 *
 * Uma chamada monta quantos posts forem necessarios: redes que compartilham o mesmo
 * placement (feed, stories, reels) viram um post so; placements diferentes viram posts
 * separados, porque a API aceita um placement por plataforma por post.
 *
 * Uso:
 *   node --env-file=.env scripts/publicar-social.js \
 *     --cliente quata \
 *     --redes "instagram,facebook,linkedin" \
 *     --media "slide-01.png,slide-02.png" \
 *     --caption "texto da legenda" \
 *     --agendar "2026-08-10 09:00" \
 *     --dry-run
 */

const fs = require("fs");
const path = require("path");

// POSTFORME_BASE_URL existe so pra testar contra um stub local. Em producao, deixa vazio.
const BASE = process.env.POSTFORME_BASE_URL || "https://api.postforme.dev";
const TZ = process.env.TZ_PUBLICACAO || "America/Sao_Paulo";

// --- Mapa de redes ---------------------------------------------------------
// Cada apelido que a usuaria pode escrever vira { platform, placement }.
// placement null = a plataforma nao aceita placement (LinkedIn, TikTok, X...).
const REDES = {
  instagram: { platform: "instagram", placement: "timeline" },
  "instagram-feed": { platform: "instagram", placement: "timeline" },
  "instagram-stories": { platform: "instagram", placement: "stories" },
  "instagram-story": { platform: "instagram", placement: "stories" },
  stories: { platform: "instagram", placement: "stories" },
  story: { platform: "instagram", placement: "stories" },
  "instagram-reels": { platform: "instagram", placement: "reels" },
  reels: { platform: "instagram", placement: "reels" },
  facebook: { platform: "facebook", placement: "timeline" },
  "facebook-feed": { platform: "facebook", placement: "timeline" },
  "facebook-stories": { platform: "facebook", placement: "stories" },
  "facebook-reels": { platform: "facebook", placement: "reels" },
  linkedin: { platform: "linkedin", placement: null },
  tiktok: { platform: "tiktok", placement: null },
  threads: { platform: "threads", placement: "timeline" },
  "threads-reels": { platform: "threads", placement: "reels" },
  x: { platform: "x", placement: null },
  twitter: { platform: "x", placement: null },
  youtube: { platform: "youtube", placement: null },
  pinterest: { platform: "pinterest", placement: null },
  bluesky: { platform: "bluesky", placement: null },
};

// Limites por plataforma. midiaMax null = sem limite conhecido.
const LIMITES = {
  instagram: { caption: 2200, midiaMin: 1, midiaMax: 10 },
  facebook: { caption: 63206, midiaMin: 1, midiaMax: 10 },
  linkedin: { caption: 3000, midiaMin: 0, midiaMax: 20 },
  tiktok: { caption: 2200, midiaMin: 1, midiaMax: 35 },
  threads: { caption: 500, midiaMin: 0, midiaMax: 20 },
  x: { caption: 280, midiaMin: 0, midiaMax: 4 },
  youtube: { caption: 5000, midiaMin: 1, midiaMax: 1 },
  pinterest: { caption: 500, midiaMin: 1, midiaMax: 1 },
  bluesky: { caption: 300, midiaMin: 0, midiaMax: 4 },
};

const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
};

// --- Argumentos ------------------------------------------------------------
function parseArgs(argv) {
  const opts = {
    cliente: "",
    redes: [],
    media: [],
    mediaPorPlacement: {}, // { stories: [...], reels: [...] }
    caption: "",
    captionPorPlataforma: {}, // { linkedin: "..." }
    titulo: "",
    agendar: "",
    contas: {}, // { instagram: "spc_123" }
    draft: false,
    dryRun: false,
    listarContas: false,
  };

  const lista = (v) => v.split(",").map((s) => s.trim()).filter(Boolean);

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const proximo = () => {
      const v = argv[++i];
      if (v === undefined) erro(`${a} espera um valor`);
      return v;
    };

    if (a === "--cliente") opts.cliente = proximo();
    else if (a === "--redes" || a === "--rede" || a === "--platform") opts.redes = lista(proximo().toLowerCase());
    else if (a === "--media" || a === "--images") opts.media = lista(proximo());
    else if (a === "--caption" || a === "--legenda") opts.caption = proximo();
    else if (a === "--titulo" || a === "--title") opts.titulo = proximo();
    else if (a === "--agendar" || a === "--schedule") opts.agendar = proximo();
    else if (a === "--conta" || a === "--account") {
      // --conta "instagram=spc_123,linkedin=spc_456"
      for (const par of lista(proximo())) {
        const [p, id] = par.split("=").map((s) => s.trim());
        if (!p || !id) erro(`--conta espera "plataforma=id", recebi "${par}"`);
        opts.contas[p.toLowerCase()] = id;
      }
    } else if (a === "--draft" || a === "--rascunho") opts.draft = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--listar-contas") opts.listarContas = true;
    else if (a.startsWith("--media-")) {
      const alvo = a.slice("--media-".length).toLowerCase();
      const placement = alvo === "feed" ? "timeline" : alvo;
      if (!["timeline", "stories", "reels"].includes(placement)) {
        erro(`--media-${alvo} invalido. Use --media-feed, --media-stories ou --media-reels`);
      }
      opts.mediaPorPlacement[placement] = lista(proximo());
    } else if (a.startsWith("--caption-") || a.startsWith("--legenda-")) {
      const plataforma = a.replace(/^--(caption|legenda)-/, "").toLowerCase();
      if (!LIMITES[plataforma]) erro(`Plataforma desconhecida em ${a}`);
      opts.captionPorPlataforma[plataforma] = proximo();
    } else {
      erro(`Argumento desconhecido: ${a}`);
    }
  }
  return opts;
}

function erro(msg) {
  console.error(`Erro: ${msg}`);
  process.exit(1);
}

// --- Credenciais por cliente ----------------------------------------------
// Cada cliente tem a propria chave: POSTFORME_API_KEY_QUATA, POSTFORME_API_KEY_IBR...
// Sem --cliente, cai na POSTFORME_API_KEY generica.
function resolverApiKey(cliente) {
  if (cliente) {
    const slug = cliente.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
    const chave = process.env[`POSTFORME_API_KEY_${slug}`];
    if (chave) return { chave, origem: `POSTFORME_API_KEY_${slug}` };
    if (process.env.POSTFORME_API_KEY) {
      return { chave: process.env.POSTFORME_API_KEY, origem: "POSTFORME_API_KEY (fallback)" };
    }
    erro(
      `Nao achei POSTFORME_API_KEY_${slug} nem POSTFORME_API_KEY no .env.\n` +
        `Adiciona no .env:  POSTFORME_API_KEY_${slug}=pfm_...`
    );
  }
  if (process.env.POSTFORME_API_KEY) {
    return { chave: process.env.POSTFORME_API_KEY, origem: "POSTFORME_API_KEY" };
  }
  erro("Nenhuma chave do Post for Me no .env. Use --cliente <slug> ou defina POSTFORME_API_KEY.");
}

// --- HTTP ------------------------------------------------------------------
function criarApi(apiKey) {
  return async function api(endpoint, options = {}) {
    const res = await fetch(`${BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    const texto = await res.text();
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error(`401 nao autorizado — chave do Post for Me invalida ou de outro cliente.`);
      }
      throw new Error(`API ${res.status} em ${endpoint}: ${texto.slice(0, 500)}`);
    }
    return texto ? JSON.parse(texto) : {};
  };
}

async function buscarContas(api) {
  const contas = [];
  let offset = 0;
  for (;;) {
    const r = await api(`/v1/social-accounts?status=connected&limit=50&offset=${offset}`);
    const pagina = r.data || r.items || (Array.isArray(r) ? r : []);
    contas.push(...pagina);
    if (pagina.length < 50) break;
    offset += 50;
  }
  return contas.filter((c) => c.status === "connected");
}

async function subirMidia(api, arquivo) {
  const { upload_url, media_url } = await api("/v1/media/create-upload-url", {
    method: "POST",
    body: JSON.stringify({}),
  });
  const ext = path.extname(arquivo).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) erro(`Extensao nao suportada: ${ext} (${arquivo})`);

  const res = await fetch(upload_url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: fs.readFileSync(arquivo),
  });
  if (!res.ok) throw new Error(`Upload falhou (${res.status}) em ${path.basename(arquivo)}: ${await res.text()}`);
  return media_url;
}

// --- Agendamento -----------------------------------------------------------
// Converte "2026-08-10 09:00" no horario de Sao Paulo pro ISO em UTC.
// ISO com fuso explicito (Z ou +/-HH:MM) passa direto.
function offsetDoFusoMs(instante, tz) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(
    fmt.formatToParts(instante).filter((x) => x.type !== "literal").map((x) => [x.type, x.value])
  );
  const comoUTC = Date.UTC(
    +p.year,
    +p.month - 1,
    +p.day,
    p.hour === "24" ? 0 : +p.hour,
    +p.minute,
    +p.second
  );
  return comoUTC - instante.getTime();
}

function paraIso(entrada, tz = TZ) {
  const texto = entrada.trim();

  if (/(Z|[+-]\d{2}:?\d{2})$/.test(texto)) {
    const d = new Date(texto);
    if (isNaN(d)) erro(`Data invalida em --agendar: "${entrada}"`);
    return d.toISOString();
  }

  const m = texto.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) {
    erro(`--agendar espera "YYYY-MM-DD HH:MM" (horario de ${tz}) ou ISO completo. Recebi: "${entrada}"`);
  }
  const [, ano, mes, dia, hora = "0", min = "0", seg = "0"] = m;
  const palpite = Date.UTC(+ano, +mes - 1, +dia, +hora, +min, +seg);

  // Duas passadas resolvem o caso de virada de horario de verao.
  let ts = palpite - offsetDoFusoMs(new Date(palpite), tz);
  ts = palpite - offsetDoFusoMs(new Date(ts), tz);

  const d = new Date(ts);
  if (isNaN(d)) erro(`Data invalida em --agendar: "${entrada}"`);
  return d.toISOString();
}

function formatarLocal(iso, tz = TZ) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: tz,
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

// --- Montagem dos posts ----------------------------------------------------
function resolverAlvos(redes, contasPorPlataforma) {
  if (redes.includes("todas") || redes.includes("all")) {
    // "todas" = feed de toda plataforma conectada. Stories e reels exigem pedido explicito,
    // porque a midia vertical costuma ser outra.
    const alvos = Object.keys(contasPorPlataforma).map((platform) => ({
      platform,
      placement: ["instagram", "facebook", "threads"].includes(platform) ? "timeline" : null,
      rede: platform,
    }));
    if (!alvos.length) erro("Nenhuma conta conectada nesse workspace do Post for Me.");
    return alvos;
  }

  const alvos = [];
  for (const rede of redes) {
    const def = REDES[rede];
    if (!def) {
      erro(`Rede desconhecida: "${rede}".\nDisponiveis: ${Object.keys(REDES).join(", ")}, todas`);
    }
    alvos.push({ ...def, rede });
  }

  // Duplicata exata (mesma plataforma + mesmo placement) nao faz sentido.
  const vistos = new Set();
  for (const a of alvos) {
    const k = `${a.platform}:${a.placement}`;
    if (vistos.has(k)) erro(`Rede repetida: ${a.platform} ${a.placement || ""}`);
    vistos.add(k);
  }
  return alvos;
}

function escolherConta(alvo, contasPorPlataforma, override) {
  const disponiveis = contasPorPlataforma[alvo.platform] || [];
  if (!disponiveis.length) {
    erro(
      `Nenhuma conta ${alvo.platform} conectada nesse workspace do Post for Me.\n` +
        `Conecta em postforme.dev ou tira "${alvo.rede}" do --redes.`
    );
  }
  if (override) {
    const achada = disponiveis.find((c) => c.id === override);
    if (!achada) {
      erro(`Conta ${override} nao encontrada/conectada em ${alvo.platform}.`);
    }
    return achada;
  }
  if (disponiveis.length > 1) {
    const opcoes = disponiveis.map((c) => `  ${c.id}  @${c.username || "?"}`).join("\n");
    erro(
      `Esse workspace tem ${disponiveis.length} contas de ${alvo.platform}. Escolhe uma com --conta:\n${opcoes}\n` +
        `Ex: --conta "${alvo.platform}=${disponiveis[0].id}"`
    );
  }
  return disponiveis[0];
}

// Agrupa alvos por placement: quem compartilha placement cabe num post so.
// LinkedIn/TikTok/X (placement null) entram no grupo do feed.
function agruparPorPlacement(alvos) {
  const grupos = new Map();
  for (const alvo of alvos) {
    const chave = alvo.placement || "timeline";
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave).push(alvo);
  }
  return grupos;
}

function validarGrupo(chave, alvos, arquivos, opts) {
  for (const alvo of alvos) {
    const lim = LIMITES[alvo.platform];
    if (!lim) continue;

    const caption = opts.captionPorPlataforma[alvo.platform] ?? opts.caption;
    if (caption.length > lim.caption) {
      erro(
        `Legenda de ${alvo.platform} tem ${caption.length} caracteres, o limite e ${lim.caption}.\n` +
          `Usa --caption-${alvo.platform} pra mandar uma versao mais curta so nessa rede.`
      );
    }

    if (chave === "stories") {
      if (!arquivos.length) erro(`Stories de ${alvo.platform} precisa de pelo menos 1 midia.`);
      continue; // a API quebra cada midia num story separado
    }
    if (chave === "reels") {
      if (arquivos.length !== 1) {
        erro(`Reels de ${alvo.platform} aceita exatamente 1 video. Recebi ${arquivos.length}.`);
      }
      continue;
    }
    if (arquivos.length < lim.midiaMin) {
      erro(`${alvo.platform} precisa de pelo menos ${lim.midiaMin} midia(s). Recebi ${arquivos.length}.`);
    }
    if (lim.midiaMax !== null && arquivos.length > lim.midiaMax) {
      erro(`${alvo.platform} aceita no maximo ${lim.midiaMax} midias. Recebi ${arquivos.length}.`);
    }
  }
}

function montarPayload(chave, alvos, contas, mediaUrls, opts, scheduledIso) {
  const payload = {
    caption: opts.caption,
    social_accounts: contas.map((c) => c.id),
  };
  if (mediaUrls.length) payload.media = mediaUrls.map((url) => ({ url }));
  if (scheduledIso) payload.scheduled_at = scheduledIso;
  if (opts.draft) payload.isDraft = true;

  const config = {};
  for (const alvo of alvos) {
    const cfg = {};
    if (alvo.placement) cfg.placement = alvo.placement;

    const captionCustom = opts.captionPorPlataforma[alvo.platform];
    if (captionCustom !== undefined) cfg.caption = captionCustom;

    if (alvo.platform === "tiktok") {
      // TikTok sempre como rascunho: a musica precisa ser escolhida no app.
      cfg.is_draft = true;
      cfg.privacy_status = "public";
      if (opts.titulo) cfg.title = opts.titulo;
    }
    if (alvo.platform === "youtube" && opts.titulo) cfg.title = opts.titulo;

    if (Object.keys(cfg).length) config[alvo.platform] = cfg;
  }
  if (Object.keys(config).length) payload.platform_configurations = config;

  return payload;
}

// --- Main ------------------------------------------------------------------
async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { chave, origem } = resolverApiKey(opts.cliente);
  const api = criarApi(chave);

  const rotulo = opts.cliente ? `${opts.cliente} (${origem})` : origem;
  console.log(`Workspace Post for Me: ${rotulo}`);

  const contasConectadas = await buscarContas(api);
  const contasPorPlataforma = {};
  for (const c of contasConectadas) {
    (contasPorPlataforma[c.platform] ||= []).push(c);
  }

  if (opts.listarContas) {
    if (!contasConectadas.length) {
      console.log("\nNenhuma conta conectada. Conecta em postforme.dev.");
      return;
    }
    console.log(`\nContas conectadas (${contasConectadas.length}):`);
    for (const [plataforma, lista] of Object.entries(contasPorPlataforma)) {
      for (const c of lista) console.log(`  ${plataforma.padEnd(10)} @${c.username || "?"}  ${c.id}`);
    }
    return;
  }

  if (!opts.redes.length) {
    erro('--redes obrigatorio. Ex: --redes "instagram,instagram-stories,facebook,linkedin" ou --redes todas');
  }
  if (!opts.caption && !Object.keys(opts.captionPorPlataforma).length) {
    erro("--caption obrigatorio.");
  }

  const alvos = resolverAlvos(opts.redes, contasPorPlataforma);
  const scheduledIso = opts.agendar ? paraIso(opts.agendar) : null;
  if (scheduledIso && new Date(scheduledIso) <= new Date()) {
    erro(`--agendar aponta pro passado (${formatarLocal(scheduledIso)}). Escolhe um horario futuro.`);
  }

  // Resolve conta de cada alvo antes de subir qualquer arquivo, pra falhar cedo.
  const contaDoAlvo = new Map();
  for (const alvo of alvos) {
    contaDoAlvo.set(alvo, escolherConta(alvo, contasPorPlataforma, opts.contas[alvo.platform]));
  }

  const grupos = agruparPorPlacement(alvos);

  // Cada grupo usa a midia especifica do placement, com fallback pra --media.
  const arquivosDoGrupo = new Map();
  for (const [chave, alvosDoGrupo] of grupos) {
    const arquivos = opts.mediaPorPlacement[chave] || opts.media;
    for (const arq of arquivos) {
      if (!fs.existsSync(arq)) erro(`Arquivo nao encontrado: ${arq}`);
    }
    validarGrupo(chave, alvosDoGrupo, arquivos, opts);
    arquivosDoGrupo.set(chave, arquivos);
  }

  // --- Preview ---
  console.log(`\n${grupos.size} post(s) a criar:`);
  for (const [chave, alvosDoGrupo] of grupos) {
    const arquivos = arquivosDoGrupo.get(chave);
    const destinos = alvosDoGrupo
      .map((a) => `${a.platform}${a.placement && a.placement !== "timeline" ? `/${a.placement}` : ""} (@${contaDoAlvo.get(a).username || contaDoAlvo.get(a).id})`)
      .join(", ");
    console.log(`\n  [${chave}] ${destinos}`);
    console.log(`    Midia: ${arquivos.length ? arquivos.map((f) => path.basename(f)).join(", ") : "(nenhuma)"}`);
    console.log(`    Legenda: ${(opts.caption || "").slice(0, 90).replace(/\n/g, " ")}${opts.caption.length > 90 ? "..." : ""}`);
    for (const alvo of alvosDoGrupo) {
      const custom = opts.captionPorPlataforma[alvo.platform];
      if (custom !== undefined) {
        console.log(`    Legenda ${alvo.platform}: ${custom.slice(0, 70).replace(/\n/g, " ")}...`);
      }
    }
    if (chave === "stories" && arquivos.length > 1) {
      console.log(`    Atencao: ${arquivos.length} midias em stories viram ${arquivos.length} stories separados.`);
    }
  }
  console.log(
    `\n  Quando: ${scheduledIso ? `agendado pra ${formatarLocal(scheduledIso)} (${TZ})` : "agora"}` +
      `${opts.draft ? " | rascunho" : ""}`
  );
  if (alvos.some((a) => a.platform === "tiktok")) {
    console.log(`  TikTok vai como rascunho: a musica precisa ser escolhida no app.`);
  }

  if (opts.dryRun) {
    console.log(`\nDRY RUN — nada foi enviado.`);
    return;
  }

  // --- Upload (um upload por arquivo, reaproveitado entre grupos) ---
  const urlPorArquivo = new Map();
  const todosArquivos = [...new Set([...arquivosDoGrupo.values()].flat())];
  if (todosArquivos.length) {
    console.log(`\nSubindo ${todosArquivos.length} arquivo(s)...`);
    for (const arq of todosArquivos) {
      urlPorArquivo.set(arq, await subirMidia(api, arq));
      console.log(`  ok ${path.basename(arq)}`);
    }
  }

  // --- Criacao dos posts ---
  console.log(`\nCriando post(s)...`);
  const criados = [];
  for (const [chave, alvosDoGrupo] of grupos) {
    const mediaUrls = arquivosDoGrupo.get(chave).map((f) => urlPorArquivo.get(f));
    const contas = alvosDoGrupo.map((a) => contaDoAlvo.get(a));
    const payload = montarPayload(chave, alvosDoGrupo, contas, mediaUrls, opts, scheduledIso);

    const r = await api("/v1/social-posts", { method: "POST", body: JSON.stringify(payload) });
    const destinos = alvosDoGrupo.map((a) => a.rede).join(", ");
    console.log(`  [${chave}] ${destinos} -> id ${r.id || "?"} | status ${r.status || "?"}`);
    criados.push(r);
  }

  console.log(
    scheduledIso
      ? `\nAgendado pra ${formatarLocal(scheduledIso)}. Acompanhe em postforme.dev.`
      : `\nEnviado. O processamento leva alguns segundos; confira em postforme.dev.`
  );
}

main().catch((e) => {
  console.error(`\nFalhou: ${e.message}`);
  process.exit(1);
});
