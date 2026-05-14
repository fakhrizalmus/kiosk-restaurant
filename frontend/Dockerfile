FROM node:20.19.1-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:20.19.1-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
ARG NEXT_PUBLIC_API_UPLOAD=http://localhost:4000/uploads
ARG NEXT_PUBLIC_API_SOCKET=http://localhost:4000

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_UPLOAD=$NEXT_PUBLIC_API_UPLOAD
ENV NEXT_PUBLIC_API_SOCKET=$NEXT_PUBLIC_API_SOCKET
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20.19.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
