# Resumo do Projeto: Migração do WordPress para Site Estático no GitHub Pages

## Fase 1 — Grab do WordPress (iesonagata.com.br)

O site original era um WordPress hospedado em servidor próprio. O conteúdo foi extraído (posts, imagens, tema CSS, páginas) e convertido para HTML estático. A estrutura de pastas foi mantida fiel ao WordPress:

```
content/uploads/YYYY/MM/DD/  — imagens organizadas por data
css/style.css                — tema visual (adaptado do Google-inspired)
js/sidebar.js                — sidebar dinâmica (substitui widgets do WP)
js/posts.json                — metadados dos posts (título, slug, data, URL, tags, thumb)
2026/MM/DD/post-slug/index.html — posts individuais
index.html                   — homepage
admin/index.html             — painel de administração (GitHub API)
about/index.html             — página sobre
tags/index.html              — página de tags
```

## Fase 2 — Criação do Repositório GitHub

Repositório criado em `github.com/IesoNagata/iesonagata-site` para servir como origem do GitHub Pages. O site estático é servido diretamente da branch `master`, sem build step.

- Git configurado localmente em `C:\Users\ieso\Documents\kilo\site`
- Operações git exigem caminho completo: `"C:\Program Files\Git\cmd\git.exe"`
- Fluxo: `add → commit → pull --no-edit → push`

## Fase 3 — Correções Pós-Migração

### 3.1 — Paths do posts.json (thumb paths sem subpasta do dia)

O merge com o remote sobrescreveu os paths corretos. As thumbs estavam como `content/uploads/2026/02/arma-300x126.jpg` em vez de `content/uploads/2026/02/20/arma-300x126.jpg`. Correção manual nos 5 paths afetados.

### 3.2 — Widget de Clima Dinâmico

Substituição do clima estático ("São Paulo, SP, 28°C") por widget dinâmico:

- **Geolocalização**: `navigator.geolocation.getCurrentPosition()` para obter coordenadas do usuário
- **API de clima**: Open-Meteo (gratuita, sem API key) para temperatura e condição atual
- **Reverse geocoding**: Nominatim/OpenStreetMap para nome da cidade em português
- **Data e horário**: exibidos no widget, atualizados a cada segundo
- **Fallback**: se o usuário negar geolocalização, exibe São Paulo com 28°C
- **Códigos WMO**: mapeamento de weathercodes para descrições em português (Céu limpo, Nublado, Chuva, Tempestade, etc.)

### 3.3 — Erro de Sintaxe JavaScript (sidebar desapareceu)

O `updateWeather` original concatenava HTML com strings mistas de aspas simples e duplas. Uma `\"` no meio da string causava `SyntaxError: Unexpected identifier`. A correção final foi reescrever a função usando manipulação DOM pura (`querySelector`, `createElement`, `textContent`) em vez de `innerHTML` com concatenação.

### 3.4 — Cache Busting

O navegador/cache do GitHub Pages servia versões antigas do `sidebar.js`. Solução: adicionar parâmetro de versão `?v=N` ao `src` do script em todos os HTMLs. A cada correção, o `N` era incrementado para forçar o fetch do novo arquivo.

### 3.5 — Base Path com Query String

O cálculo do `base` em `sidebar.js` usava `src.replace(/js\/sidebar\.js$/,"")`. Com `?v=4` no src, o regex não casava (por causa do `$`), e o `base` ficava como `js/sidebar.js?v=4`. O fetch de `posts.json` ia para URL inexistente. Correção: `src.replace(/\?.*$/,"").replace(/js\/sidebar\.js$/,"")`.

### 3.6 — Sidebar Responsivo

O CSS tinha `@media (max-width: 1100px) { .sidebar-right { display: none; } }`, escondendo completamente o sidebar direito em telas ≤ 1100px. Corrigido para layout flex que exibe os boxes abaixo do conteúdo principal.

### 3.7 — Posts/Tags Não Carregavam na Homepage

A homepage tinha dois scripts fazendo fetch de `posts.json` simultaneamente: o `sidebar.js` e um inline `<script>`. O fetch do sidebar falhava silenciamente (sem `.catch()`), enquanto o inline funcionava. Solução:

- Extraiu-se a lógica de popular posts e tags em `window.populateSidebarPosts(posts)`
- O inline script do homepage chama essa função após carregar os posts
- O sidebar.js continua funcionando independentemente nas páginas secundárias

## Fase 4 — Admin Page (Painel de Administração)

O `admin/index.html` é uma SPA que cria posts via GitHub API:

- Editor de texto com toolbar (bold, italic, links, imagens, código)
- Upload de thumbs com redimensionamento automático
- Salva imagens em `content/uploads/YYYY/MM/DD/`
- Cria o HTML do post e atualiza `posts.json` via commits GitHub
- Os paths gerados já incluem a subpasta do dia (correto)

## Arquitetura Final

```
iesonagata-site/
├── index.html              ← homepage (hero + grid de posts)
├── js/
│   ├── sidebar.js          ← sidebar dinâmica (clima, posts, tags, news, social)
│   └── posts.json          ← metadados dos posts (alimenta sidebar e homepage)
├── css/style.css           ← tema visual completo
├── content/uploads/        ← imagens organizadas por data
├── 2026/MM/DD/post-slug/   ← posts individuais
├── admin/                  ← painel de administração
├── about/                  ← página sobre
└── tags/                   ← página de tags
```

## Tecnologias Utilizadas

- **Hospedagem**: GitHub Pages (branch master, sem build)
- **Geolocalização**: Browser API + Open-Meteo + Nominatim
- **Administração**: GitHub REST API (commits via `admin/index.html`)
- **Estilo**: CSS customizado com variáveis CSS (`--bg-card`, `--accent-blue`, etc.)
- **JavaScript**: Vanilla JS, sem frameworks, IIFE pattern
