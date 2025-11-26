# Etapa 1: Build del React app
FROM node:20-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Construir la app para producción
RUN npm run build

# Etapa 2: Servir la app con Nginx
FROM nginx:alpine

# Copiar la carpeta build al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración de Nginx si quieres blue/green
# COPY app/nginx/blue.conf /etc/nginx/conf.d/blue.conf
# COPY app/nginx/green.conf /etc/nginx/conf.d/green.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
