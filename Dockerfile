# Nigelle Royale — front + backend dans une seule image
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
# on n'a besoin d'aucune dépendance runtime (node:http + node:sqlite),
# mais on garde package.json pour "npm start"
COPY package.json ./
COPY server ./server
COPY --from=build /app/dist ./dist
# DB sur un volume monté (ex : -v data:/data  +  DB_PATH=/data/waitlist.db)
ENV DB_PATH=/data/waitlist.db
VOLUME ["/data"]
EXPOSE 8787
CMD ["node", "--disable-warning=ExperimentalWarning", "server/index.mjs"]
