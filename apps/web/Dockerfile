ARG NODE_VERSION=24.20.0-alpine
ARG PNPM_VERSION=12.3.4

# -------- Dev (with hot reload) --------
FROM node:${NODE_VERSION} AS dev

ARG PNPM_VERSION

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV TURBO_TELEMETRY_DISABLED=1

RUN corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /usr/src/app

EXPOSE 5173

CMD ["pnpm", "turbo", "dev", "--filter=web"]