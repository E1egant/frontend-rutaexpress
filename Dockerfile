FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_TENANT_ID=common
ARG VITE_SPA_CLIENT_ID=
ARG VITE_API_SCOPE=api://rutaexpress/access_as_user
# Vacío a propósito: el código arma las URLs como "/api/..." y nginx las
# reenvía al BFF (ver nginx.conf). Si se sirve sin nginx delante, usar la URL
# absoluta del BFF (p.ej. http://localhost:8080).
ARG VITE_API_BASE_URL=
ENV VITE_TENANT_ID=$VITE_TENANT_ID \
    VITE_SPA_CLIENT_ID=$VITE_SPA_CLIENT_ID \
    VITE_API_SCOPE=$VITE_API_SCOPE \
    VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
