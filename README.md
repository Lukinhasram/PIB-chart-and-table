# Aplicação que consome API do IBGE e exibe gráfico e tabela

**Link da aplicação:** [https://pib-chart.onrender.com/chart](https://pib-chart.onrender.com/chart)

Projeto front-end criado com Vite, React e TypeScript. Inclui roteamento, gráficos com Chart.js e configuração para desenvolvimento local ou via Docker.

## Requisitos

- Node.js 20+ e npm (para execução local)
- Docker e Docker Compose (para executar em container)

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

## Decisões de design

- Camada de serviços separada
  - `src/services/api.ts`: faz o fetch dos dados brutos (IBGE e IPEA). Tratamento simples de erro (`response.ok`) e tipagem básica dos formatos retornados.
  - `src/services/pibServices.ts`: “serviço de domínio” que combina e transforma os dados. Usa `Promise.all` para buscar em paralelo, `Map<number, number>` para taxas de câmbio e ordena os resultados.

- Visualização e tabela
  - `src/components/chart.tsx`: Dois datasets e dois eixos Y (PIB e PIB per capita, ambos em USD). `useEffect` com flag de cancelamento para evitar setState após unmount.
  - `src/components/table.tsx`: tabela com `Intl.NumberFormat` memoizado para moeda (USD), loading state e chaves estáveis por ano.

- Qualidade
  - Vitest: testes unitários focados na camada de serviços (`pibServices.test.ts`), com mocks de `api.ts` para isolar lógica de conversão/combinação.
  - ESLint (flat) com `typescript-eslint`, `react-hooks` e `react-refresh` para padronização e feedback rápido.

- Build e execução
  - Vite 7 com HMR. Configuração para Docker (host `0.0.0.0`, porta `3000` e `watch.usePolling` para hot reload confiável em contêiner).

## Estrutura do projeto

- `src/` código-fonte React/TS
  - `components/` componentes `chart.tsx` e `table.tsx`
  - `services/` chamadas a API, manuseio dos dados e testes (`pibServices.ts`, `pibServices.test.ts`)
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

## Solução de problemas

- Porta ocupada: altere `server.port` em `vite.config.ts` e ajuste o mapeamento em `docker-compose.yml`.
