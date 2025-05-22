FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos esenciales
COPY package*.json ./
RUN npm install

# Copia el resto del proyecto
COPY . .

# Expone el puerto gRPC
EXPOSE 50052

CMD ["npm", "start"]
