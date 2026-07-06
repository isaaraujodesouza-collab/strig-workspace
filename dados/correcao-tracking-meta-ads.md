# Tracking Meta Ads — Implementação Completa
**Data:** 21/06/2026  
**LPs:** `striglab.com.br/crescer` e `striglab.com.br/gmn`  
**Pixel ID:** `8973498452666801`  
**GTM Container:** `GTM-NHWQS4DS`

---

## Índice

1. [Diagnóstico: o que está errado agora](#diagnóstico)
2. [Arquitetura correta](#arquitetura)
3. [O que é Event Match Quality e como melhorar](#emq)
4. [Fase 1 — Correção imediata (GTM + HTML)](#fase-1)
5. [Fase 2 — CAPI próprio via PHP (recomendado)](#fase-2)
6. [Fase 3 — Setup completo via GTM Server-Side (avançado)](#fase-3)
7. [Verificação HeroSpark](#herospark)
8. [Como testar](#testar)
9. [Resumo dos problemas e correções](#resumo)

---

## 1. Diagnóstico: o que está errado agora {#diagnóstico}

### Problema 1 — Pixel no HTML + GTM duplicando tudo

O pixel Meta está hardcoded no `<head>` de cada LP **e** o GTM tem tags adicionais para os mesmos eventos. Cada evento conta em dobro.

| Evento | HTML direto | GTM | Total |
|---|---|---|---|
| InitiateCheckout | ✓ | ✓ | **2x** |
| ScrollPercent | ✓ | ✓ | **2x** |
| TimeView | ✓ | ✓ | **2x** |

Isso causa score `3.0/10` no Gerenciador de Eventos.

### Problema 2 — fbclid não capturado

Quando alguém clica num anúncio, a Meta adiciona `?fbclid=XXXX` na URL. A LP ignora esse parâmetro. Qualquer compra chega na Meta sem atribuição — ela sabe que houve compra mas não sabe de qual anúncio.

### Problema 3 — fbc e fbp não chegam na HeroSpark

O botão de compra leva para `pay.herospark.com/...` sem parâmetros de rastreamento. A HeroSpark precisa do `fbc` para enviar junto com o Purchase via CAPI.

### Problema 4 — Sem event_id

O pixel browser e a CAPI da HeroSpark disparam `InitiateCheckout` sem `event_id` comum. A Meta conta em dobro em vez de deduplicar.

### Problema 5 — Sem CAPI próprio na LP

O CAPI só existe na HeroSpark (checkout). Eventos de LP (PageView, ViewContent, InitiateCheckout) chegam apenas via browser pixel — vulneráveis a bloqueadores, iOS restrictions, e sem dados server-side (IP real, user agent confiável).

---

## 2. Arquitetura correta {#arquitetura}

```
Usuário clica no anúncio
    ↓ URL com ?fbclid=XXXX
LP carrega
    ↓ Script captura fbclid → salva cookie _fbc
    ↓ BROWSER PIXEL: PageView + ViewContent (event_id único)
    ↓ CAPI PHP RELAY: PageView + ViewContent (mesmo event_id) + IP real
Usuário clica em "Comprar"
    ↓ BROWSER PIXEL: InitiateCheckout (event_id único)
    ↓ CAPI PHP RELAY: InitiateCheckout (mesmo event_id) + IP real
    ↓ fbc + fbp passados na URL do checkout HeroSpark
HeroSpark processa o checkout
    ↓ CAPI HEROSPARK: InitiateCheckout (event_id diferente — deduplicação separada)
    ↓ CAPI HEROSPARK: Purchase (email hash + phone hash + fbc + fbp)
Meta recebe
    ✓ Todos os eventos com atribuição correta
    ✓ Purchase com dados pessoais → score 8–9.5
    ✓ Otimiza campanha com inteligência real
```

---

## 3. O que é Event Match Quality (EMQ) e como melhorar {#emq}

EMQ é o score de 0–10 que mede o quanto a Meta consegue cruzar o evento com um perfil real do Facebook. Maior score = melhor atribuição, melhores lookalikes, campanha que otimiza com dados reais.

### Parâmetros por peso de impacto

| Parâmetro | O que é | Disponível em |
|---|---|---|
| `em` | Email com hash SHA256 | HeroSpark (após preenchimento) |
| `ph` | Telefone com hash SHA256 | HeroSpark (após preenchimento) |
| `fbc` | Facebook Click ID da URL | LP (com script de captura) |
| `fbp` | Cookie do pixel browser | LP (automático) |
| `client_ip_address` | IP real do usuário | Só server-side (PHP relay) |
| `client_user_agent` | Navegador do usuário | PHP relay ou browser |
| `fn` / `ln` | Nome/sobrenome hash | HeroSpark |
| `external_id` | ID interno do usuário | Pode gerar UUID por sessão |

### Score realista por etapa

| Evento | Parâmetros disponíveis | Score esperado |
|---|---|---|
| PageView / ViewContent (LP) | fbc + fbp + IP + user agent | 5–7 |
| InitiateCheckout (LP) | fbc + fbp + IP + user agent | 5–7 |
| Purchase (HeroSpark CAPI) | email + phone + fbc + fbp + IP | **8–9.5** |

> O 9.8+ que aparece em anúncios de agências geralmente inclui email capturado em etapa anterior à compra (ex: campo de email na LP antes de ir ao checkout). Para implementar isso na Strig, bastaria um campo de email simples antes do botão de compra.

---

## 4. Fase 1 — Correção imediata (GTM + HTML) {#fase-1}

> Implementar primeiro. Resolve os problemas críticos sem precisar de nova infraestrutura.

### 4.1 GTM: deletar tags duplicadas

1. Acesse `tagmanager.google.com` → container `GTM-NHWQS4DS`
2. **Tags** → deletar: `Tag InitiateCheckou`, `Tag ScrollPercent`, `Tag TimeView`
3. **Acionadores** → deletar: `Trigger - InitiateCheckout`, `Trigger - ScrollPercent`, `Trigger - TimeView`
4. **Enviar** → **Publicar**

### 4.2 HTML: adicionar captura do fbclid (ambas as LPs)

Localizar `<!-- End Meta Pixel -->` e colar logo depois:

```html
<!-- Captura fbclid do anúncio para atribuição Meta Ads -->
<script>
(function() {
  try {
    var fbclid = new URLSearchParams(window.location.search).get('fbclid');
    if (fbclid) {
      var fbc = 'fb.1.' + Date.now() + '.' + fbclid;
      var exp = new Date(Date.now() + 90*24*60*60*1000).toUTCString();
      document.cookie = '_fbc=' + fbc + ';expires=' + exp + ';path=/;SameSite=Lax';
    }
  } catch(e) {}
})();
</script>
```

### 4.3 HTML: substituir script de tracking (ambas as LPs)

Localizar `<!-- Tracking: InitiateCheckout` no final do arquivo e substituir o bloco `<script>` inteiro.

**Para `/crescer`** (`content_name: 'Metodologia CRESCER'`):

```html
<!-- Tracking: InitiateCheckout + TimeView + ScrollPercent -->
<script>
(function () {

  function getCookie(name) {
    var m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? m[2] : null;
  }

  /* 1. InitiateCheckout — event_id único + fbc/fbp no checkout */
  var btnCheckout = document.getElementById('btn-checkout');
  if (btnCheckout) {

    /* Injeta fbc e fbp na URL do checkout ao carregar a página */
    (function() {
      try {
        var fbc = getCookie('_fbc');
        var fbp = getCookie('_fbp');
        if (fbc || fbp) {
          var url = new URL(btnCheckout.href);
          if (fbc) url.searchParams.set('fbc', fbc);
          if (fbp) url.searchParams.set('fbp', fbp);
          btnCheckout.href = url.toString();
        }
      } catch(e) {}
    })();

    btnCheckout.addEventListener('click', function () {
      var eventId = 'ic_' + Date.now() + '_' + Math.random().toString(36).substr(2,9);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'InitiateCheckout', eventID: eventId });
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', {
          content_name: 'Metodologia CRESCER',
          currency: 'BRL',
          value: 47.00,
          num_items: 1
        }, { eventID: eventId });
      }
    });
  }

  /* 2. TimeView — marcos de tempo */
  (function () {
    var milestones = [30, 60, 120, 300];
    var fired = {};
    var start = Date.now();
    setInterval(function () {
      var elapsed = Math.floor((Date.now() - start) / 1000);
      milestones.forEach(function (s) {
        if (elapsed >= s && !fired[s]) {
          fired[s] = true;
          if (typeof fbq === 'function') fbq('trackCustom', 'TimeView', { time_seconds: s });
        }
      });
    }, 5000);
  })();

  /* 3. ScrollPercent — marcos de rolagem */
  (function () {
    var milestones = [25, 50, 75, 100];
    var fired = {};
    function getScrollPct() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      return scrollable > 0 ? Math.floor(((window.scrollY || doc.scrollTop) / scrollable) * 100) : 0;
    }
    window.addEventListener('scroll', function () {
      var pct = getScrollPct();
      milestones.forEach(function (m) {
        if (pct >= m && !fired[m]) {
          fired[m] = true;
          if (typeof fbq === 'function') fbq('trackCustom', 'ScrollPercent', { scroll_depth: m });
        }
      });
    }, { passive: true });
  })();

})();
</script>
```

**Para `/gmn`**: usar o mesmo bloco com `content_name: 'Guia Google Meu Negócio'`.

---

## 5. Fase 2 — CAPI próprio via PHP {#fase-2}

> Implementar após a Fase 1. Adiciona tracking server-side próprio, independente da HeroSpark. Score de matching sobe para 6–8 nos eventos de LP.

### Por que isso importa

O browser pixel depende do navegador do usuário. iOS 14+, Safari ITP, extensões de bloqueio e cookie consent podem matar ou reduzir o sinal. O CAPI próprio manda os mesmos eventos diretamente do servidor — não passa pelo browser, não pode ser bloqueado.

### 5.1 Criar o Token de Acesso da API de Conversões

1. Acesse `business.facebook.com` → Configurações de Negócios
2. Origens de Dados → Pixels → selecionar pixel `8973498452666801`
3. Aba **Configurações** → **API de Conversões** → **Gerar Token de Acesso**
4. Copiar e guardar o token (começa com `EAA...`)

### 5.2 Criar arquivo PHP no servidor

Criar o arquivo `public_html/api/meta-event.php` com o seguinte conteúdo:

```php
<?php
// Configuração
define('PIXEL_ID', '8973498452666801');
define('ACCESS_TOKEN', 'COLE_O_TOKEN_AQUI'); // Token gerado no passo 5.1
define('API_VERSION', 'v19.0');

// Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://striglab.com.br');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Receber dados do browser
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['event_name'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid payload']);
    exit;
}

// IP real (considera Cloudflare e proxies)
$ip = $_SERVER['HTTP_CF_CONNECTING_IP']
   ?? $_SERVER['HTTP_X_FORWARDED_FOR']
   ?? $_SERVER['REMOTE_ADDR']
   ?? '';
$ip = trim(explode(',', $ip)[0]);

// User agent
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

// Montar user_data
$user_data = [
    'client_ip_address' => $ip,
    'client_user_agent' => $ua,
];

if (!empty($input['fbc'])) $user_data['fbc'] = $input['fbc'];
if (!empty($input['fbp'])) $user_data['fbp'] = $input['fbp'];
if (!empty($input['external_id'])) $user_data['external_id'] = $input['external_id'];

// Dados pessoais — apenas se fornecidos (hash SHA256)
if (!empty($input['email'])) {
    $user_data['em'] = hash('sha256', strtolower(trim($input['email'])));
}
if (!empty($input['phone'])) {
    $phone = preg_replace('/\D/', '', $input['phone']);
    if (strlen($phone) === 11) $phone = '55' . $phone; // adiciona DDI Brasil
    $user_data['ph'] = hash('sha256', $phone);
}
if (!empty($input['first_name'])) {
    $user_data['fn'] = hash('sha256', strtolower(trim($input['first_name'])));
}
if (!empty($input['last_name'])) {
    $user_data['ln'] = hash('sha256', strtolower(trim($input['last_name'])));
}

// Montar evento
$event = [
    'event_name'       => $input['event_name'],
    'event_time'       => time(),
    'event_id'         => $input['event_id'] ?? uniqid('capi_', true),
    'action_source'    => 'website',
    'event_source_url' => $input['event_source_url'] ?? '',
    'user_data'        => $user_data,
];

if (!empty($input['custom_data'])) {
    $event['custom_data'] = $input['custom_data'];
}

// Payload para a Meta
$payload = ['data' => [$event]];
if (!empty($input['test_event_code'])) {
    $payload['test_event_code'] = $input['test_event_code'];
}

// Enviar para a API de Conversões
$url = sprintf(
    'https://graph.facebook.com/%s/%s/events?access_token=%s',
    API_VERSION,
    PIXEL_ID,
    ACCESS_TOKEN
);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_TIMEOUT        => 5,
]);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($http_code);
echo $response;
```

### 5.3 Atualizar o HTML das LPs para dual firing

Substituir o script de tracking da Fase 1 pelo seguinte (inclui envio simultâneo para pixel browser + CAPI PHP):

```html
<!-- Tracking: Pixel Browser + CAPI Server-Side -->
<script>
(function () {

  var CAPI_ENDPOINT = '/api/meta-event.php';
  var PRODUCT_NAME  = 'Metodologia CRESCER'; /* Alterar para 'Guia Google Meu Negócio' na LP /gmn */
  var PRODUCT_VALUE = 47.00;

  /* Utilitários */
  function getCookie(name) {
    var m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? m[2] : null;
  }

  function generateEventId(prefix) {
    return (prefix || 'ev') + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /* Envia via browser pixel E via CAPI PHP com o mesmo event_id */
  function track(eventName, eventId, pixelParams, capiCustomData) {
    /* 1. Browser pixel */
    if (typeof fbq === 'function') {
      if (pixelParams) {
        fbq('track', eventName, pixelParams, { eventID: eventId });
      } else {
        fbq('track', eventName, {}, { eventID: eventId });
      }
    }

    /* 2. CAPI server-side */
    try {
      fetch(CAPI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: eventName,
          event_id: eventId,
          event_source_url: window.location.href,
          fbc: getCookie('_fbc') || '',
          fbp: getCookie('_fbp') || '',
          external_id: getCookie('_strig_uid') || '',
          custom_data: capiCustomData || {}
        }),
        keepalive: true
      });
    } catch(e) {}
  }

  /* Gerar external_id por sessão/usuário */
  (function() {
    if (!getCookie('_strig_uid')) {
      var uid = 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      var exp = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
      document.cookie = '_strig_uid=' + uid + ';expires=' + exp + ';path=/;SameSite=Lax';
    }
  })();

  /* 1. InitiateCheckout */
  var btnCheckout = document.getElementById('btn-checkout');
  if (btnCheckout) {

    /* Injeta fbc + fbp na URL do checkout */
    (function() {
      try {
        var fbc = getCookie('_fbc');
        var fbp = getCookie('_fbp');
        if (fbc || fbp) {
          var url = new URL(btnCheckout.href);
          if (fbc) url.searchParams.set('fbc', fbc);
          if (fbp) url.searchParams.set('fbp', fbp);
          btnCheckout.href = url.toString();
        }
      } catch(e) {}
    })();

    btnCheckout.addEventListener('click', function () {
      var eventId = generateEventId('ic');
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'InitiateCheckout', eventID: eventId });
      track(
        'InitiateCheckout',
        eventId,
        { content_name: PRODUCT_NAME, currency: 'BRL', value: PRODUCT_VALUE, num_items: 1 },
        { content_name: PRODUCT_NAME, currency: 'BRL', value: PRODUCT_VALUE, num_items: 1 }
      );
    });
  }

  /* 2. TimeView */
  (function () {
    var milestones = [30, 60, 120, 300];
    var fired = {};
    var start = Date.now();
    setInterval(function () {
      var elapsed = Math.floor((Date.now() - start) / 1000);
      milestones.forEach(function (s) {
        if (elapsed >= s && !fired[s]) {
          fired[s] = true;
          if (typeof fbq === 'function') fbq('trackCustom', 'TimeView', { time_seconds: s });
        }
      });
    }, 5000);
  })();

  /* 3. ScrollPercent */
  (function () {
    var milestones = [25, 50, 75, 100];
    var fired = {};
    function getScrollPct() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      return scrollable > 0 ? Math.floor(((window.scrollY || doc.scrollTop) / scrollable) * 100) : 0;
    }
    window.addEventListener('scroll', function () {
      var pct = getScrollPct();
      milestones.forEach(function (m) {
        if (pct >= m && !fired[m]) {
          fired[m] = true;
          if (typeof fbq === 'function') fbq('trackCustom', 'ScrollPercent', { scroll_depth: m });
        }
      });
    }, { passive: true });
  })();

})();
</script>
```

### 5.4 (Opcional, alto impacto) Capturar email antes do checkout

Para subir o score para 9+ nos eventos de LP, adicionar um campo de email simples acima do botão de compra. Quando preenchido, ele passa o email hashed junto com o InitiateCheckout.

**No HTML, adicionar antes do botão de compra:**

```html
<div id="email-capture-wrap" style="margin-bottom: 12px;">
  <input
    type="email"
    id="email-pre-checkout"
    placeholder="Seu melhor e-mail para receber o acesso"
    style="width:100%;padding:14px 16px;border-radius:10px;border:1px solid rgba(157,71,255,0.4);
           background:#1c0f2a;color:#efeae7;font-size:15px;outline:none;box-sizing:border-box;"
  />
</div>
```

**No script de tracking, adicionar a leitura do email no click do botão:**

```javascript
/* Dentro do addEventListener('click', ...) do btnCheckout, adicionar: */
var emailInput = document.getElementById('email-pre-checkout');
var email = emailInput ? emailInput.value.trim() : '';

/* Enviar também para CAPI com email */
if (email) {
  fetch(CAPI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: 'InitiateCheckout',
      event_id: eventId,
      event_source_url: window.location.href,
      fbc: getCookie('_fbc') || '',
      fbp: getCookie('_fbp') || '',
      email: email,  /* O PHP faz o hash SHA256 */
      custom_data: { content_name: PRODUCT_NAME, currency: 'BRL', value: PRODUCT_VALUE }
    }),
    keepalive: true
  });
}
```

---

## 6. Fase 3 — GTM Server-Side (avançado, opcional) {#fase-3}

> Substituiria o PHP relay por uma infraestrutura GTM completa. Indicado se o volume de campanhas crescer significativamente ou se quiser uma solução sem manutenção de código.

O GTM Server-Side funciona como um proxy entre o browser e todas as APIs (Meta, Google Analytics, TikTok Ads, etc.). Requer uma VM na nuvem (Google Cloud Run — aprox. $10–30/mês) e configuração mais elaborada.

**Não é prioridade agora.** O PHP relay da Fase 2 atende bem o estágio atual.

---

## 7. Verificação HeroSpark {#herospark}

A HeroSpark já tem CAPI integrado. Para garantir que está enviando todos os dados necessários:

1. Painel HeroSpark → Integrações → Meta / Facebook
2. Confirmar Pixel ID: `8973498452666801`
3. Confirmar Token de Acesso ativo (não expirado)
4. Verificar se estão habilitados os parâmetros: `fbc`, `fbp`, `email`, `phone`, `first_name`, `last_name`
5. Eventos configurados: `InitiateCheckout`, `AddPaymentInfo`, `Purchase`

Com o `fbc` chegando corretamente na URL do checkout (após Fase 1/2), a HeroSpark vai repassá-lo automaticamente. O Purchase via HeroSpark CAPI com email + phone + fbc deve atingir score 8–9.5.

---

## 8. Como testar {#testar}

### Testar Fase 1 (browser pixel)

1. Instalar **Meta Pixel Helper** no Chrome
2. Copiar link de um anúncio ativo do Gerenciador (não da Biblioteca)
3. Abrir em aba anônima — URL deve ter `?fbclid=...`
4. Verificar no Meta Pixel Helper:
   - `PageView` ✓
   - `ViewContent` ✓
5. Clicar no botão de compra:
   - `InitiateCheckout` dispara **uma vez** ✓
   - URL do checkout tem `?fbc=` e `?fbp=` ✓

### Testar Fase 2 (CAPI PHP)

1. No painel Meta → Gerenciador de Eventos → **Ferramenta de Teste de Eventos**
2. Copiar o código de teste (ex: `TEST12345`)
3. No arquivo `meta-event.php`, adicionar temporariamente: `define('TEST_CODE', 'TEST12345');`
4. E no payload: `if (defined('TEST_CODE')) $payload['test_event_code'] = TEST_CODE;`
5. Acessar a LP via link do anúncio e clicar em comprar
6. Os eventos devem aparecer em tempo real na Ferramenta de Teste de Eventos
7. Remover o TEST_CODE após verificação

### Verificar atribuição (após implementação completa)

1. Fazer compra teste pelo link real do anúncio
2. Aguardar 15 min → verificar Purchase no Gerenciador de Eventos
3. Aguardar 24h → verificar conversão no Gerenciador de Anúncios atribuída à campanha

---

## 9. Resumo dos problemas e correções {#resumo}

| # | Problema | Impacto | Fase |
|---|---|---|---|
| 1 | Pixel HTML + GTM duplicando eventos | Todos os dados dobrados | Fase 1 |
| 2 | fbclid não capturado | Compras sem atribuição à campanha | Fase 1 |
| 3 | fbc/fbp não passados ao checkout | CAPI HeroSpark sem identificação do anúncio | Fase 1 |
| 4 | Sem event_id | Meta conta InitiateCheckout em dobro | Fase 1 |
| 5 | Sem CAPI próprio na LP | Eventos vulneráveis a bloqueadores, score baixo | Fase 2 |
| 6 | Email não capturado antes do checkout | Score de matching limitado a 6-7 | Fase 2 opcional |

### Progresso de score esperado

| Momento | Score EMQ |
|---|---|
| Hoje (sem correção) | 3.0/10 |
| Após Fase 1 | 5–6/10 |
| Após Fase 2 (sem email) | 6–7.5/10 |
| Após Fase 2 (com email) | 8.5–9.5/10 |
| Purchase via HeroSpark CAPI (com email + phone) | 8–9.5/10 |

---

## Arquivos a criar/modificar

```
public_html/
├── api/
│   └── meta-event.php          ← CRIAR (Fase 2)
├── crescer/
│   └── index.html              ← MODIFICAR (Fase 1 e 2)
└── gmn/
    └── index.html              ← MODIFICAR (Fase 1 e 2)
```

---

*Documento gerado em 21/06/2026 — Strig Lab*  
*Para dúvidas técnicas: contato@striglab.com.br*
