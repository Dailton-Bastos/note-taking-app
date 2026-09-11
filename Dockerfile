ARG NODE_VERSION=24.20.0-alpine
ARG PNPM_VERSION=12.3.4
ARG ZSH_IN_DOCKER_VERSION=v1.2.1
ARG ZSH_IN_DOCKER_SHA256=0cf15b6f9c63a8103eb33bad87dc4b43fed0e0ad5884dff90f943ee1e868796e

FROM node:${NODE_VERSION}

ARG PNPM_VERSION
ARG ZSH_IN_DOCKER_VERSION
ARG ZSH_IN_DOCKER_SHA256
ARG UID=1000
ARG GID=1000

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV TURBO_TELEMETRY_DISABLED=1

RUN apk add --no-cache git curl zsh \
    && corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate

# node:alpine already ships a `node` user at 1000:1000; reuse it and only
# remap its ids when a different host UID/GID is passed at build time.
RUN if [ "${UID}" != "1000" ] || [ "${GID}" != "1000" ]; then \
      deluser node 2>/dev/null || true; \
      group_name="$(getent group "${GID}" | cut -d: -f1)"; \
      if [ -z "$group_name" ]; then \
        addgroup -g "${GID}" node; \
        group_name=node; \
      fi; \
      adduser -D -u "${UID}" -G "$group_name" -h /home/node node; \
    fi \
    && mkdir -p /usr/src/app \
    && chown -R "${UID}:${GID}" /usr/src/app /home/node

USER node

ENV HOME=/home/node

RUN curl -fsSL -o /tmp/zsh-in-docker.sh "https://github.com/deluan/zsh-in-docker/releases/download/${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh" \
    && echo "${ZSH_IN_DOCKER_SHA256}  /tmp/zsh-in-docker.sh" | sha256sum -c - \
    && sh /tmp/zsh-in-docker.sh -- \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-syntax-highlighting \
    -p https://github.com/zsh-users/zsh-completions \
    && rm -f /tmp/zsh-in-docker.sh

WORKDIR /usr/src/app