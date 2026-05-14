FROM node:20.19.1-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm ci --omit=dev

FROM node:20.19.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 4000

CMD ["node", "start.js"]
