#!/usr/bin/env python3
"""
build_relatorio_social.py — Strig Lab
Gera o relatório de social media ORGÂNICO (HTML + PDF) para QUALQUER cliente a partir de um config JSON.
Mesmo visual premium do relatório de tráfego (build_relatorio.py), mas com métricas de orgânico:
alcance, seguidores, engajamento, audiência, melhores posts e stories. NUNCA tráfego pago.

Serve Instagram e LinkedIn — a plataforma e as seções são definidas pelo config (não hardcode).
Reconstruído a partir dos exports do Metricool (IG e LinkedIn), no padrão visual da Strig.

Uso:
  python build_relatorio_social.py --config <config.json> --out-dir <pasta> [--no-pdf]

Estilo: padrão Strig (roxo #7F00FF sobre fundo claro), logo em marca/logo-strig/.
Renderiza via Playwright (mesmo motor do resto do workspace).
"""
import asyncio, base64, io, json, os, argparse, math

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def load_poppins():
    """Poppins embutida em base64 (funciona offline e no PDF, sem depender de CDN)."""
    p = os.path.join(SCRIPT_DIR, "poppins-embed.css")
    if os.path.exists(p):
        with open(p, encoding="utf-8") as f:
            return f.read()
    return ""

# ── Formatação ───────────────────────────────────────────────────────────────
def fmt_num(n):
    try:
        return f"{int(round(float(n))):,}".replace(",", ".")
    except (TypeError, ValueError):
        return str(n)

def fmt_dec(n, d=2):
    return f"{float(n):.{d}f}".replace(".", ",")

# ── Paletas Strig ────────────────────────────────────────────────────────────
# Roxo principal (marca) + ciano (acento tecnológico da marca, marca/design-guide.md)
PUR_COLS = ['#7F00FF', '#9D47FF', '#B86FFF', '#CCA4FF', '#E0CEFF']
CYA_COLS = ['#0891B2', '#06B6D4', '#22D3EE', '#67E8F9', '#CFFAFE']
BLU_COLS = CYA_COLS  # compat: séries secundárias usam o ciano de marca, não azul genérico
PIE_COLS = ['#7F00FF', '#0891B2', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#F43F5E', '#14B8A6']

# ── Charts SVG (sem dependência externa) ─────────────────────────────────────
def svg_line(labels, series, W=1600, H=460):
    """series: lista de {"name","values","color","dashed"(bool)}. Linha temporal."""
    n = len(labels)
    ml, mr, mt, mb = 56, 20, 14, 60
    cw, ch = W - ml - mr, H - mt - mb
    all_vals = [v for s in series for v in s["values"]]
    max_v = (max(all_vals) * 1.10) if all_vals and max(all_vals) > 0 else 1
    px = lambda i: ml + (i * cw / (n - 1) if n > 1 else 0)
    py = lambda v: mt + ch - (v / max_v * ch)
    parts = [f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">']
    # grid + eixo Y
    for k in range(5):
        gv = max_v * k / 4
        gy = py(gv)
        parts.append(f'<line x1="{ml}" y1="{gy:.1f}" x2="{ml+cw}" y2="{gy:.1f}" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>')
        parts.append(f'<text x="{ml-8}" y="{gy+4:.1f}" text-anchor="end" font-size="11" fill="#9CA3AF" font-family="Poppins,sans-serif">{fmt_num(gv)}</text>')
    # rótulos X (a cada ~30 dias mostra alguns pra não poluir)
    step = max(1, n // 12)
    for i, lbl in enumerate(labels):
        if i % step == 0 or i == n - 1:
            parts.append(f'<text x="{px(i):.1f}" y="{mt+ch+20}" text-anchor="end" font-size="9" fill="#9CA3AF" font-family="Poppins,sans-serif" transform="rotate(-40 {px(i):.1f} {mt+ch+20})">{lbl}</text>')
    # séries — a principal (não pontilhada) usa o eixo Y; as secundárias (pontilhadas,
    # ex: novos seguidores em unidades) são escaladas pro próprio máximo, só pra mostrar o formato.
    for s in series:
        if s.get("dashed"):
            smax = max(s["values"]) if s["values"] and max(s["values"]) > 0 else 1
            spy = lambda v: mt + ch - (v / smax * ch * 0.85)
            pts = [(px(i), spy(v)) for i, v in enumerate(s["values"])]
        else:
            pts = [(px(i), py(v)) for i, v in enumerate(s["values"])]
        poly = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
        dash = ' stroke-dasharray="6,3"' if s.get("dashed") else ''
        if not s.get("dashed") and pts:
            parts.append(f'<polygon points="{ml},{mt+ch} {poly} {px(n-1):.1f},{mt+ch}" fill="{s["color"]}14"/>')
        parts.append(f'<polyline points="{poly}" fill="none" stroke="{s["color"]}" stroke-width="2.6"{dash} stroke-linejoin="round" stroke-linecap="round"/>')
    # legenda
    lx, ly = ml, H - 12
    for s in series:
        parts.append(f'<rect x="{lx}" y="{ly-8}" width="18" height="4" fill="{s["color"]}" rx="2"/>')
        parts.append(f'<text x="{lx+24}" y="{ly}" font-size="12" fill="#718096" font-family="Poppins,sans-serif">{s["name"]}</text>')
        lx += 40 + len(s["name"]) * 7.5
    parts.append('</svg>')
    return ''.join(parts)

def svg_spark(values, color="#7F00FF", W=112, H=34):
    """Mini gráfico de linha (sparkline) pro histórico curto de um KPI (3-8 pontos)."""
    vals = [float(v) for v in values]
    if len(vals) < 2:
        return ""
    mn, mx = min(vals), max(vals)
    rng = (mx - mn) or 1
    pad = 3
    pts = []
    for i, v in enumerate(vals):
        x = pad + i * (W - 2 * pad) / (len(vals) - 1)
        y = H - pad - (v - mn) / rng * (H - 2 * pad)
        pts.append((x, y))
    poly = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    lastx, lasty = pts[-1]
    return (f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" xmlns="http://www.w3.org/2000/svg" style="display:block">'
            f'<polyline points="{poly}" fill="none" stroke="{color}" stroke-width="2" '
            f'stroke-linejoin="round" stroke-linecap="round"/>'
            f'<circle cx="{lastx:.1f}" cy="{lasty:.1f}" r="2.6" fill="{color}"/></svg>')

def svg_hbar(labels, values, colors, W=880, H=500, label_w=150, show_vals=True):
    n = len(labels)
    ml, mr, mt, mb = 6, 40, 8, 6
    lw = label_w
    cw = W - lw - mr - ml
    ch = H - mt - mb
    bh = ch / n * 0.60
    gap = ch / n * 0.40
    max_v = max(values) if values and max(values) > 0 else 1
    parts = [f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">']
    for k in range(1, 5):
        gx = ml + lw + k / 4 * cw
        parts.append(f'<line x1="{gx:.1f}" y1="{mt}" x2="{gx:.1f}" y2="{mt+ch}" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>')
    for i, (lbl, val) in enumerate(zip(labels, values)):
        by = mt + i * (bh + gap) + gap / 2
        bw = val / max_v * cw
        col = colors[i % len(colors)] if isinstance(colors, list) else colors
        parts.append(f'<rect x="{ml+lw:.1f}" y="{by:.1f}" width="{max(bw,1):.1f}" height="{bh:.1f}" fill="{col}" rx="4"/>')
        parts.append(f'<text x="{ml+lw-9}" y="{by+bh*0.66:.1f}" text-anchor="end" font-size="15" fill="#4A5568" font-family="Poppins,sans-serif">{lbl}</text>')
        if show_vals:
            parts.append(f'<text x="{ml+lw+bw+8:.1f}" y="{by+bh*0.66:.1f}" font-size="14" font-weight="600" fill="#718096" font-family="Poppins,sans-serif">{fmt_num(val)}</text>')
    parts.append('</svg>')
    return ''.join(parts)

def svg_vbar(labels, values, color="#7F00FF", W=560, H=320):
    """Barras verticais (ex: atividade por horário do dia)."""
    n = len(labels)
    ml, mr, mt, mb = 30, 10, 10, 32
    cw, ch = W - ml - mr, H - mt - mb
    bw = cw / n * 0.55
    gap = cw / n * 0.45
    max_v = max(values) if values and max(values) > 0 else 1
    parts = [f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">']
    for i, (lbl, val) in enumerate(zip(labels, values)):
        bx = ml + i * (bw + gap) + gap / 2
        bh = val / max_v * ch
        by = mt + ch - bh
        parts.append(f'<rect x="{bx:.1f}" y="{by:.1f}" width="{bw:.1f}" height="{max(bh,1):.1f}" fill="{color}" rx="3"/>')
        parts.append(f'<text x="{bx+bw/2:.1f}" y="{mt+ch+20}" text-anchor="middle" font-size="11" fill="#9CA3AF" font-family="Poppins,sans-serif">{lbl}</text>')
    parts.append('</svg>')
    return ''.join(parts)

def svg_pie(items, W=460, H=460):
    """items: [[label, valor], ...]. Pizza com % dentro das fatias."""
    total = sum(float(v) for _, v in items) or 1
    cx, cy = W / 2, H / 2
    r = min(W, H) / 2 * 0.94
    ang = -90.0
    parts = [f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">']
    for i, (lbl, v) in enumerate(items):
        frac = float(v) / total
        sweep = frac * 360
        a0 = math.radians(ang)
        a1 = math.radians(ang + sweep)
        x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
        x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
        large = 1 if sweep > 180 else 0
        col = PIE_COLS[i % len(PIE_COLS)]
        parts.append(f'<path d="M{cx:.1f},{cy:.1f} L{x0:.1f},{y0:.1f} A{r:.1f},{r:.1f} 0 {large} 1 {x1:.1f},{y1:.1f} Z" fill="{col}"/>')
        if frac > 0.045:
            am = math.radians(ang + sweep / 2)
            lx, ly = cx + r * 0.62 * math.cos(am), cy + r * 0.62 * math.sin(am)
            parts.append(f'<text x="{lx:.1f}" y="{ly:.1f}" text-anchor="middle" font-size="14" font-weight="600" fill="#fff" font-family="Poppins,sans-serif">{fmt_dec(frac*100,1)}%</text>')
        ang += sweep
    parts.append('</svg>')
    return ''.join(parts)

def pie_legend(items):
    out = []
    for i, (lbl, v) in enumerate(items):
        col = PIE_COLS[i % len(PIE_COLS)]
        out.append(f'<div class="lg-item"><span class="lg-dot" style="background:{col}"></span>{lbl}</div>')
    return "".join(out)

# ── Blocos HTML ──────────────────────────────────────────────────────────────
def delta_html(d):
    """Badge de variação vs período anterior.
    d: {"txt":"98,91%","dir":"up"|"down"|"flat","good":bool}
    A cor segue 'good' (não a direção): unfollows subindo é ruim, alcance subindo é bom.
    Se 'good' ausente, assume up=bom / down=ruim."""
    if not d:
        return ""
    arrow = {"up": "↑", "down": "↓", "flat": "→"}.get(d.get("dir", "flat"), "→")
    good = d.get("good")
    if good is None:
        good = (d.get("dir") == "up")
    cls = "good" if good else ("bad" if d.get("dir") in ("up", "down") else "neutral")
    return f'<span class="kpi-delta {cls}">{arrow} {d["txt"]}</span>'

def kpi_grid_html(kpis):
    out = []
    for k in kpis:
        foot = delta_html(k.get("delta"))
        note = f'<span class="kpi-note">{k["note"]}</span>' if k.get("note") else ""
        anterior = (f'<div class="kpi-prev">período anterior: {k["anterior"]}</div>'
                    if k.get("anterior") is not None else "")
        spark = ""
        if k.get("trend"):
            d = k.get("delta") or {}
            good = d.get("good")
            col = "#0891B2" if good is None else ("#0B8043" if good else "#D93025")
            spark = f'<div class="kpi-spark">{svg_spark(k["trend"], color=col)}</div>'
        out.append(
            f'<div class="kpi"><div class="kpi-top"><div class="kpi-lbl">{k["lbl"]}</div>{spark}</div>'
            f'<div class="kpi-val">{k["val"]}</div>'
            f'<div class="kpi-foot">{foot}{note}</div>{anterior}</div>')
    return "".join(out)

def rodape_html(items):
    return "".join(
        f'<div class="fh-item"><div class="fh-num">{it["strong"]}</div>'
        f'<div class="fh-lbl">{it["text"]}</div></div>' for it in items)

def acoes_html(items):
    return "".join(f'<li>{it}</li>' for it in items)

FORMATO_COR = {
    "carrossel": "#7F00FF", "carrosel": "#7F00FF",
    "estatico": "#0369A1", "estático": "#0369A1", "imagem": "#0369A1",
    "reel": "#EC4899", "reels": "#EC4899", "video": "#EC4899", "vídeo": "#EC4899",
    "story": "#F59E0B", "stories": "#F59E0B",
}

def fmt_badge(formato):
    if not formato:
        return ""
    cor = FORMATO_COR.get(formato.strip().lower(), "#718096")
    return f'<span class="fmt" style="background:{cor}">{formato}</span>'

def posts_rows(posts):
    rows = []
    for i, p in enumerate(posts[:10]):
        is_top = i == 0
        bg = "background:#F5F0FF;" if is_top else ("background:#FAFBFC;" if i % 2 == 0 else "")
        badge = ('<span class="tag-top">TOP</span>' if is_top else "")
        titulo = p.get("titulo", "")
        curt, com = p.get("curtidas", 0), p.get("comentarios", 0)
        salv, comp = p.get("salvos", 0), p.get("compart", 0)
        alcance = p.get("alcance", 0)
        engaj_total = curt + com + salv + comp
        taxa = p.get("taxa")
        if not taxa or taxa == "—":
            taxa = f"{fmt_dec(engaj_total/alcance*100,1)}%" if alcance else "—"
        cells = [
            fmt_num(alcance), fmt_num(p.get("visualizacoes", 0)),
            fmt_num(curt), fmt_num(com), fmt_num(salv), fmt_num(comp),
            fmt_num(p.get("seguir", 0)), fmt_num(engaj_total),
        ]
        tds = "".join(f"<td>{c}</td>" for c in cells)
        rows.append(
            f'<tr style="{bg}"><td class="p-tit">{titulo}{badge}</td>'
            f'<td class="p-fmt">{fmt_badge(p.get("formato",""))}</td>'
            f'<td>{taxa}</td>{tds}</tr>')
    return "\n".join(rows)

def stories_rows(stories):
    rows = []
    for i, s in enumerate(stories):
        bg = "background:#FAFBFC;" if i % 2 == 0 else ""
        titulo = s.get("titulo", "")
        short = titulo[:50] + ("…" if len(titulo) > 50 else "")
        rows.append(
            f'<tr style="{bg}"><td class="p-tit" title="{titulo}">{short}</td>'
            f'<td>{fmt_num(s.get("alcance",0))}</td><td>{fmt_num(s.get("saidas",0))}</td>'
            f'<td>{fmt_num(s.get("respostas",0))}</td><td>{fmt_num(s.get("avancar",0))}</td>'
            f'<td>{fmt_num(s.get("voltar",0))}</td></tr>')
    return "\n".join(rows)

def insights_html(items):
    """items: string (legado) ou {"cat": "Alcance", "text": "..."} pra agrupar visualmente por tema."""
    out = []
    for i, it in enumerate(items):
        if isinstance(it, dict):
            cat = f'<div class="ins-cat">{it.get("cat","")}</div>' if it.get("cat") else ""
            text = it.get("text", "")
        else:
            cat, text = "", it
        out.append(f'<div class="ins"><div class="ins-num">{i+1}</div>'
                    f'<div class="ins-body">{cat}<div class="ins-text">{text}</div></div></div>')
    return "".join(out)

POSTS_CATS = {
    "publicações", "publicacoes", "conteúdo", "conteudo", "posts", "principais publicações",
    "conteúdo top 1", "conteúdo top 2", "conteúdo top 3",
    "conteudo top 1", "conteudo top 2", "conteudo top 3",
}

def split_insights(items):
    """Separa insights sobre publicações (cat em POSTS_CATS) dos demais (alcance/público/engajamento)."""
    left, right = [], []
    for it in items:
        cat = it.get("cat", "") if isinstance(it, dict) else ""
        (left if cat.strip().lower() in POSTS_CATS else right).append(it)
    return left, right

def audiencia_cards(audiencia):
    """Renderiza cada bloco de audiência (pie, bar ou horarios) num card.
    Pizza usa layout horizontal (gráfico à esquerda, legenda à direita) — cabe melhor em
    cards mais largos e baixos (grid 2x2). Barra/horários mantêm o gráfico sozinho no card."""
    cards = []
    for blk in audiencia:
        titulo = blk.get("titulo", "")
        tipo = blk.get("tipo", "bar")
        items = blk.get("items", [])
        if tipo == "pie":
            chart = svg_pie(items)
            legend = f'<div class="pie-legend pie-legend-v">{pie_legend(items)}</div>'
            body = f'<div class="chart-box">{chart}</div>{legend}'
            aud_cls = "aud-pie"
        elif tipo == "horarios":
            labels = [x[0] for x in items]
            vals = [x[1] for x in items]
            chart = svg_vbar(labels, vals, color=PUR_COLS[0], W=1400)
            melhores = blk.get("melhores", [])
            ml_html = ""
            if melhores:
                ml_html = '<div class="melhores-list">' + "".join(
                    f'<div class="melhor-item"><strong>{m.get("dia","")}</strong> {m.get("faixa","")}</div>'
                    for m in melhores) + '</div>'
            body = f'<div class="chart-box">{chart}</div>{ml_html}'
            aud_cls = ""
        else:
            labels = [x[0] for x in items]
            vals = [x[1] for x in items]
            chart = svg_hbar(labels, vals, PUR_COLS, W=1400, H=max(320, 56 * len(items)), label_w=200)
            body = f'<div class="chart-box">{chart}</div>'
            aud_cls = ""
        cards.append(f'<div class="card"><div class="card-title">{titulo}</div>'
                     f'<div class="aud-body {aud_cls}">{body}</div></div>')
    return cards

# ── CSS (string normal, sem f-string, pra não precisar duplicar chaves) ───────
CSS = """
  @page { size: 1920px 1080px; margin: 0; }
  *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
  html,body { font-family:'Poppins',sans-serif; background:#EEE9E4; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .slide { width:1920px; height:1080px; overflow:hidden; break-after:page; page-break-after:always; display:flex; flex-direction:column; background:#EEE9E4; }
  .slide:last-child { break-after:auto; page-break-after:auto; }
  .hdr { background:#1C1C1C; height:88px; min-height:88px; display:flex; align-items:center; padding:0 56px; flex-shrink:0; }
  .hdr-left { width:560px; } .hdr-title { font-size:17px; font-weight:700; color:#fff; letter-spacing:.05em; }
  .hdr-sub { font-size:12px; color:#9CA3AF; margin-top:4px; } .hdr-center { flex:1; text-align:center; }
  .hdr-period-lbl { font-size:9px; text-transform:uppercase; letter-spacing:.1em; color:#6B7280; }
  .hdr-period-val { font-size:16px; font-weight:600; color:#fff; margin-top:3px; }
  .hdr-right { width:240px; display:flex; justify-content:flex-end; align-items:center; }
  .hdr-right img { height:56px; width:auto; max-width:200px; object-fit:contain; display:block; }
  .body { flex:1; min-height:0; padding:26px 48px 24px; display:flex; flex-direction:column; gap:16px; overflow:hidden; }
  .body-row { display:flex; gap:18px; flex:1; min-height:0; }
  .slide-h { font-size:22px; font-weight:700; color:#1C1C1C; flex-shrink:0; }
  .note-box { background:#FEF7E6; border:1px solid #F5E4B8; border-radius:9px; padding:11px 16px; font-size:12px; color:#8A6D1B; flex-shrink:0; }
  /* KPIs */
  .kpi-grid { display:grid; gap:14px; flex:1; min-height:0; }
  .kpi { background:#fff; border-radius:14px; border:1px solid #E2E8F0; padding:16px 24px; display:flex; flex-direction:column; justify-content:center;
    box-shadow:0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06); }
  .kpi-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:8px; }
  .kpi-lbl { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; color:#718096; }
  .kpi-spark { flex-shrink:0; opacity:.9; }
  .kpi-val { font-size:34px; font-weight:700; color:#0D0D0D; line-height:1; }
  .kpi-note { font-size:11px; color:#7F00FF; font-weight:500; }
  .kpi-foot { display:flex; align-items:center; gap:8px; margin-top:11px; flex-wrap:wrap; }
  .kpi-delta { font-size:12px; font-weight:700; padding:3px 9px; border-radius:6px; white-space:nowrap; }
  .kpi-delta.good { background:#E7F8EF; color:#0B8043; }
  .kpi-delta.bad { background:#FDECEA; color:#D93025; }
  .kpi-delta.neutral { background:#F1F5F9; color:#64748B; }
  .kpi-prev { font-size:11px; color:#A0AEC0; margin-top:6px; }
  /* Cards / charts */
  .card { background:#fff; border-radius:14px; border:1px solid #E2E8F0; padding:20px 22px 16px; display:flex; flex-direction:column; flex:1; min-height:0;
    box-shadow:0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06); }
  .card-title { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; color:#2D3748; margin-bottom:14px; flex-shrink:0; }
  .chart-box { flex:1; min-height:0; overflow:hidden; }
  .aud-body { flex:1; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:12px; }
  .aud-body .chart-box { flex:0 0 auto; max-height:80%; }
  .aud-body.aud-pie { flex-direction:row; align-items:center; justify-content:center; gap:22px; }
  .aud-body.aud-pie .chart-box { flex:0 0 auto; width:auto; height:100%; aspect-ratio:1/1; max-width:75%; overflow:hidden; }
  .pie-legend { display:flex; flex-wrap:wrap; gap:8px 18px; justify-content:center; margin-top:10px; flex-shrink:0; }
  .pie-legend.pie-legend-v { flex-direction:column; flex-wrap:nowrap; justify-content:center; align-items:flex-start; gap:11px; margin-top:0; flex:0 0 auto; }
  .lg-item { font-size:13px; color:#4A5568; display:flex; align-items:center; gap:8px; }
  .lg-dot { width:11px; height:11px; border-radius:50%; display:inline-block; flex-shrink:0; }
  .melhores-list { display:flex; flex-wrap:wrap; gap:8px 12px; justify-content:center; margin-top:12px; flex-shrink:0; }
  .melhor-item { font-size:12px; color:#4A5568; background:#F5F0FF; border-radius:8px; padding:6px 12px; white-space:nowrap; }
  .melhor-item strong { color:#1C1C1C; font-weight:600; }
  /* Rodapé destaques */
  .footer-h { display:grid; grid-auto-flow:column; grid-auto-columns:1fr; flex-shrink:0; gap:14px; }
  .fh-item { background:#fff; border:1px solid #E2E8F0; border-radius:12px; padding:18px 22px;
    display:flex; flex-direction:column; gap:5px; border-left:4px solid #7F00FF;
    box-shadow:0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06); }
  .fh-num { font-size:26px; font-weight:700; color:#0D0D0D; line-height:1; }
  .fh-lbl { font-size:12.5px; font-weight:500; color:#718096; }
  /* Tabelas */
  .tbl-wrap { background:#fff; border-radius:14px; border:1px solid #E2E8F0; overflow:hidden; flex:1; min-height:0;
    box-shadow:0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06); }
  table { width:100%; height:100%; border-collapse:collapse; }
  thead th { font-size:10.5px; font-weight:600; text-transform:uppercase; letter-spacing:.05em; color:#718096; background:#FAFBFC; border-bottom:1.5px solid #E2E8F0; padding:13px 10px; text-align:right; }
  thead th:first-child { text-align:left; padding-left:20px; }
  tbody td { padding:14px 10px; border-bottom:1px solid #F0F4F8; color:#2D3748; text-align:right; font-size:13px; vertical-align:middle; }
  tbody td:first-child { text-align:left; padding-left:20px; }
  tbody tr:last-child td { border-bottom:none; }
  .p-tit { width:460px; white-space:normal; line-height:1.4; font-weight:500; color:#1C1C1C; }
  .p-fmt { text-align:center !important; }
  .fmt { display:inline-block; color:#fff; border-radius:5px; padding:3px 10px; font-size:11px; font-weight:600; white-space:nowrap; }
  .tag-top { background:#7F00FF; color:#fff; border-radius:4px; padding:1px 6px; font-size:9px; margin-left:8px; font-weight:600; vertical-align:middle; }
  /* Insights — mesmo ritmo do card "Ações realizadas" (gap fixo, sem esticar pra preencher) */
  .ins-wrap { display:flex; flex-direction:column; gap:14px; }
  .ins { display:flex; gap:14px; align-items:flex-start; }
  .ins-num { width:28px; height:28px; border-radius:50%; background:#7F00FF; color:#fff; font-size:13px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; }
  .ins-body { flex:1; }
  .ins-cat { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#7F00FF; margin-bottom:4px; }
  .ins-text { font-size:16px; line-height:1.5; color:#2D3748; } .ins-text strong { color:#0D0D0D; font-weight:600; }
  .ins-cols { display:flex; gap:18px; align-items:flex-start; }
  .ins-cols > .card { flex:1; }
  .resumo { font-size:15px; line-height:1.55; color:#2D3748; } .resumo strong { color:#0D0D0D; font-weight:600; }
  /* Slide evolução: gráfico grande em cima, resumo + ações 50/50 embaixo */
  .evo-col { display:flex; flex-direction:column; gap:18px; flex:1; min-height:0; }
  .evo-top { flex:1 1 56%; min-height:0; }
  .evo-bottom { display:flex; gap:18px; flex:1 1 44%; min-height:0; }
  .evo-bottom > .card { flex:1; min-height:0; }
  .acoes { list-style:none; display:flex; flex-direction:column; gap:12px; }
  .acoes li { position:relative; padding-left:26px; font-size:15px; line-height:1.5; color:#2D3748; }
  .acoes li::before { content:""; position:absolute; left:0; top:7px; width:10px; height:10px;
    border-radius:3px; background:#7F00FF; }
  .acoes li strong { color:#0D0D0D; font-weight:600; }
"""

# ── Slides ───────────────────────────────────────────────────────────────────
def header(cfg, logo_tag):
    canal = cfg.get("plataforma", "Redes Sociais")
    return (f'<div class="hdr"><div class="hdr-left">'
            f'<div class="hdr-title">RELATÓRIO SOCIAL · {canal.upper()}</div>'
            f'<div class="hdr-sub">{cfg.get("cliente","")}</div></div>'
            f'<div class="hdr-center"><div class="hdr-period-lbl">Período</div>'
            f'<div class="hdr-period-val">{cfg.get("periodo","")}</div></div>'
            f'<div class="hdr-right">{logo_tag}</div></div>')

def build_html(cfg, logo_tag):
    slides = []

    # ── Slide 1: Visão geral (KPIs) ──
    kpis = cfg.get("kpis", [])
    cols = 3 if len(kpis) <= 9 else 4
    note = f'<div class="note-box">{cfg["kpi_note"]}</div>' if cfg.get("kpi_note") else ""
    comp = f'· Comparado com {cfg["comparado"]}' if cfg.get("comparado") else ""
    rod = f'<div class="footer-h">{rodape_html(cfg["rodape"])}</div>' if cfg.get("rodape") else ""
    slides.append(f"""<div class="slide">{header(cfg, logo_tag)}<div class="body">
      <div class="slide-h">Visão geral {comp}</div>
      {note}
      <div class="kpi-grid" style="grid-template-columns:repeat({cols},1fr)">{kpi_grid_html(kpis)}</div>
      {rod}
    </div></div>""")

    # ── Slide 2: Evolução diária + resumo ──
    if cfg.get("daily"):
        labels = [d[0] for d in cfg["daily"]]
        alcance = [d[1] for d in cfg["daily"]]
        series = [{"name": "Alcance", "values": alcance, "color": "#7F00FF"}]
        if len(cfg["daily"][0]) > 2:
            series.append({"name": "Novos seguidores", "values": [d[2] for d in cfg["daily"]], "color": "#0369A1", "dashed": True})
        chart = svg_line(labels, series, W=1780, H=480)
        resumo = (f'<div class="card"><div class="card-title">Resumo do período</div>'
                  f'<div class="resumo">{cfg["resumo"]}</div></div>') if cfg.get("resumo") else ""
        acoes = (f'<div class="card"><div class="card-title">Ações realizadas no período</div>'
                 f'<ul class="acoes">{acoes_html(cfg["acoes"])}</ul></div>') if cfg.get("acoes") else ""
        slides.append(f"""<div class="slide">{header(cfg, logo_tag)}<div class="body">
          <div class="slide-h">Evolução e leitura do período</div>
          <div class="evo-col">
            <div class="card evo-top"><div class="card-title">Alcance diário</div><div class="chart-box">{chart}</div></div>
            <div class="evo-bottom">{resumo}{acoes}</div>
          </div>
        </div></div>""")

    # ── Slide 3: Audiência ──
    if cfg.get("audiencia"):
        cards = audiencia_cards(cfg["audiencia"])
        n = len(cards)
        cols = 2 if n > 1 else 1
        rows = math.ceil(n / cols)
        grid_style = f'display:grid;grid-template-columns:repeat({cols},1fr);grid-template-rows:repeat({rows},1fr);gap:18px;flex:1;min-height:0;'
        slides.append(f"""<div class="slide">{header(cfg, logo_tag)}<div class="body">
          <div class="slide-h">Audiência</div>
          <div class="body-row" style="{grid_style}">{''.join(cards)}</div>
        </div></div>""")

    # ── Slide 4: Melhores posts ──
    if cfg.get("posts"):
        thead = ('<tr><th>Publicação</th><th>Formato</th><th>Taxa eng.</th><th>Alcance</th><th>Visualiz.</th>'
                 '<th>Curtidas</th><th>Coment.</th><th>Salvos</th><th>Compart.</th><th>Seguir</th><th>Engaj. total</th></tr>')
        slides.append(f"""<div class="slide">{header(cfg, logo_tag)}<div class="body">
          <div class="slide-h">Principais publicações</div>
          <div class="tbl-wrap"><table><thead>{thead}</thead><tbody>{posts_rows(cfg["posts"])}</tbody></table></div>
        </div></div>""")

    # ── Slide 5: Insights ──
    if cfg.get("insights"):
        left, right = split_insights(cfg["insights"])
        if left and right:
            body_html = (f'<div class="ins-cols">'
                         f'<div class="card"><div class="card-title">Insights das melhores publicações</div>'
                         f'<div class="ins-wrap">{insights_html(left)}</div></div>'
                         f'<div class="card"><div class="card-title">Alcance, público e engajamento</div>'
                         f'<div class="ins-wrap">{insights_html(right)}</div></div>'
                         f'</div>')
        else:
            body_html = f'<div class="card"><div class="ins-wrap">{insights_html(left or right)}</div></div>'
        slides.append(f"""<div class="slide">{header(cfg, logo_tag)}<div class="body">
          <div class="slide-h">Insights estratégicos</div>
          {body_html}
        </div></div>""")

    html = ('<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">'
            f'<style>{load_poppins()}</style>'
            f'<style>{CSS}</style></head><body>{"".join(slides)}</body></html>')
    return html, len(slides)

# ── Logo ─────────────────────────────────────────────────────────────────────
# Header é escuro (#1C1C1C), então usa a versão CLARA/branca do logotipo.
LOGO_DIR = os.path.join(BASE, "marca", "logo-strig")

def resolve_logo():
    mimes = {".png": "image/png", ".svg": "image/svg+xml"}
    # ordem de preferência: variações de nome da versão clara/branca
    names = ["logo-branco", "logo branco", "logo-claro", "logo claro", "strig-branco", "logo"]
    for name in names:
        for ext, mime in mimes.items():
            p = os.path.join(LOGO_DIR, name + ext)
            if os.path.exists(p):
                with open(p, "rb") as f:
                    b64 = base64.b64encode(f.read()).decode()
                return f'<img src="data:{mime};base64,{b64}" alt="Strig Lab">'
    # sem arquivo: não usa texto, deixa o slot vazio e avisa no console
    print("AVISO: logotipo não encontrado em marca/logo-strig/ (esperado logo-branco.png). Header sem logo.")
    return ''

# ── Render PDF ───────────────────────────────────────────────────────────────
async def render_pdf(html_path, pdf_path, n_slides):
    from playwright.async_api import async_playwright
    from PIL import Image
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_viewport_size({'width': 1920, 'height': 1080})
        await page.goto('file:///' + html_path.replace('\\', '/'))
        await page.wait_for_load_state('networkidle')
        await asyncio.sleep(2)
        imgs = []
        for i in range(n_slides):
            await page.evaluate(f"window.scrollTo(0, {i * 1080})")
            await asyncio.sleep(0.4)
            imgs.append(Image.open(io.BytesIO(await page.screenshot(type='png'))).convert('RGB'))
        await browser.close()
    imgs[0].save(pdf_path, save_all=True, append_images=imgs[1:], resolution=96)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--no-pdf", action="store_true", help="só gera o HTML (pula o Playwright)")
    args = ap.parse_args()

    with open(args.config, encoding="utf-8") as f:
        cfg = json.load(f)

    logo_tag = resolve_logo()
    os.makedirs(args.out_dir, exist_ok=True)
    slug = cfg.get("periodo_slug", "relatorio")
    cli = cfg.get("cliente_slug", "cliente")
    html_path = os.path.join(args.out_dir, f"relatorio-social-{cli}-{slug}.html")
    pdf_path = os.path.join(args.out_dir, f"relatorio-social-{cli}-{slug}.pdf")

    html, n_slides = build_html(cfg, logo_tag)
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML salvo ({n_slides} slides): {html_path}")

    if args.no_pdf:
        print("PDF pulado (--no-pdf).")
        return
    asyncio.run(render_pdf(html_path, pdf_path, n_slides))
    print(f"PDF gerado: {pdf_path}")

if __name__ == "__main__":
    main()
