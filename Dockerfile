# Etapa base: dependências
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etapa de testes
FROM base AS test
RUN npm run test

# Etapa de build de produção
FROM base AS build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN echo "VITE_API_URL=$VITE_API_URL"
RUN npm run build

# Etapa final: Nginx para servir o build
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 