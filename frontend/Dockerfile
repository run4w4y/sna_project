# --- STAGE 1: install dependencies

FROM node:17-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /proj
COPY package.json package-lock.json ./
COPY ./ ./
RUN npm ci

# --- STAGE 2: run development image

FROM node:17-alpine AS runner

WORKDIR /proj

ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=deps /proj ./

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "dev"]

