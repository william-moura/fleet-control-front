# Estágio 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Estágio 2: Servidor leve
FROM nginx:alpine
# Ajuste 'seu-app' para o nome definido no angular.json
COPY --from=build /app/dist/fleet-control-front/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]