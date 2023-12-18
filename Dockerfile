FROM oven/bun:1.0.18 as base
WORKDIR /usr/src/app

FROM base as build
COPY package.json bun.lockb /usr/src/app/
RUN bun install
COPY ./src ./src

USER bun
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
