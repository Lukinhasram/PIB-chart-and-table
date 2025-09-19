# Aplicação React + TypeScript + Vite

Projeto front-end criado com Vite, React e TypeScript. Inclui roteamento, gráficos com Chart.js e configuração pronta para desenvolvimento local ou via Docker.

## Requisitos

- Node.js 20+ e npm (para execução local)
- Docker e Docker Compose (opcional, para executar em container)

## Como instalar e executar

### Opção A — Localmente

1) Instalar dependências

```sh
npm install
```

2) Servir em modo desenvolvimento (HMR)

```sh
npm run dev
```

Acesse: http://localhost:3000

3) Build de produção

```sh
npm run build
```

4) Pré-visualizar o build

```sh
npm run preview
```

5) Lint

```sh
npm run lint
```

### Opção B — Com Docker Compose

1) Subir o ambiente

```sh
docker compose up --build
```

2) Acesse: http://localhost:3000

Notas:
- O Vite está configurado para expor em 0.0.0.0:3000 e usar polling para hot reload em contêiner.
- O volume `.:/app` permite hot reload a partir do host.

## Tecnologias e decisões de design

- Vite 7: bundler e dev server rápidos, com Hot Module Replacement (HMR).
- React 19 + TypeScript: tipagem estrita (tsconfig com `strict: true`) e JSX moderno.
- React Router (react-router-dom v7): navegação SPA (ver `src/router.tsx`).
- Chart.js 4 + react-chartjs-2 5: componentes de gráfico reativos (ver `src/components/chart.tsx`).
- ESLint (configuração flat) com `typescript-eslint`, `react-hooks` e `react-refresh`: padronização e qualidade de código.
- Docker (Node 20-alpine) + docker-compose: ambiente reprodutível de desenvolvimento, porta 3000 exposta, HMR funcionando dentro do contêiner.

## Estrutura do projeto (resumo)

- `src/` código-fonte React/TS
  - `components/` componentes como `chart.tsx` e `table.tsx`
  - `services/` chamadas a API e testes (`pibServices.ts`, `pibServices.test.ts`)
  - `main.tsx`, `App.tsx`, `router.tsx`
- `vite.config.ts` configuração do Vite (host, porta, polling, plugin React)
- `Dockerfile` e `docker-compose.yml` configuração de contêiner

## Variáveis de ambiente

As URLs das APIs podem ser configuradas via `.env` (opcional, com fallback para os valores padrão):

1) Copie `.env.example` para `.env` e edite se necessário:

```sh
cp .env.example .env
```

2) Chaves disponíveis:

- `VITE_IBGE_API_URL`: endpoint da API do IBGE para PIB/PIB per capita.
- `VITE_IPEADATA_API_URL`: endpoint da API do IPEA para taxa de câmbio BRL/USD.

Observações:
- Em Vite, apenas variáveis prefixadas com `VITE_` ficam acessíveis no front-end (via `import.meta.env`).
- Em desenvolvimento com Docker, `.env` é montado via volume e ficará visível no contêiner.
- Para builds de produção de imagem, evite copiar `.env`; injete variáveis em tempo de execução ou via orquestrador.

## Solução de problemas

- Porta ocupada: altere `server.port` em `vite.config.ts` e ajuste o mapeamento em `docker-compose.yml`.
