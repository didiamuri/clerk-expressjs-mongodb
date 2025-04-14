FROM node:22-alpine AS builder
WORKDIR /app

RUN npm i -g corepack && corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm prune --prod

FROM node:22-alpine AS runner
WORKDIR /app

RUN npm i -g corepack && corepack enable

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.prod.json ./tsconfig.prod.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3700

CMD ["pnpm", "run", "start"]