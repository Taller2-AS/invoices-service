# 💸 Microservicio de Facturas – StreamFlow

Este microservicio forma parte del proyecto **StreamFlow**, de la asignatura **Arquitectura de Sistemas**. Administra la información relacionada a las facturas emitidas, permitiendo su creación, consulta, actualización y eliminación lógica.

---

## 📋 Requisitos

- Node.js v18.x o superior  
- Docker  
- MariaDB  
- RabbitMQ  
- Postman  

---

## 🚀 Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/Taller2-AS/invoices-service.git
cd invoicesService
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Crea el archivo `.env`

Ejemplo:

```env
# gRPC
GRPC_PORT=50052
SERVER_URL=localhost

# MariaDB (Sequelize)
DB_HOST=localhost
DB_PORT=3308
DB_NAME=streamflow_facturacion
DB_USER=admin
DB_PASSWORD=root

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin@localhost:5672
```

> ⚠️ Asegúrate de que MariaDB y RabbitMQ estén corriendo en tu entorno local y los puertos estén correctamente mapeados.

---

### 4. Levanta MariaDB y RabbitMQ con Docker

```bash
docker-compose up -d
```

> Si ya tienes una instancia única de RabbitMQ corriendo en otro microservicio, puedes omitir levantarla aquí.

---

### 5. Ejecuta el seeder (opcional)

```bash
npm run seed
```

Esto insertará datos falsos de facturas utilizando archivos `.json` y la librería `faker`.

---

### 6. Inicia el microservicio

```bash
npm start
```

---


## 👨‍💻 Desarrollado por

**Desarrollador B - Kevin Araya**  
Universidad Católica del Norte – Arquitectura de Sistemas