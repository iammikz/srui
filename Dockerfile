# syntax=docker/dockerfile:1
# Build context = this repo's ROOT (the docs app depends on the
# @iammikz/srui workspace package):
#   docker build -t srui-docs .
FROM node:22-alpine AS build
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Cached dependency layer (manifests only)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/react/package.json packages/react/
COPY apps/demo/package.json apps/demo/
COPY apps/docs/package.json apps/docs/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @iammikz/srui build && pnpm --filter docs build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/docs/dist /usr/share/nginx/html
EXPOSE 80