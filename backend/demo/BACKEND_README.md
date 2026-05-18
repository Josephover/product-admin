# Admin Dashboard Backend - Spring Boot API

Backend REST API construido con Spring Boot 4.0.6 para el admin dashboard.

## 📋 Requisitos

- Java 25 LTS (o superior)
- PostgreSQL 12+
- Gradle 8+
- Maven (opcional)

## ⚙️ Configuración

### 1. Base de Datos PostgreSQL

Asegúrate de que PostgreSQL esté instalado y corriendo:

```bash
# Crear base de datos
createdb admin_db

# O en PostgreSQL CLI
psql -U postgres
# postgres=# CREATE DATABASE admin_db;
```

### 2. Configurar Credenciales

Edita `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/admin_db
spring.datasource.username=postgres
spring.datasource.password=TU_CONTRASEÑA
```

## 🚀 Ejecutar el Proyecto

### Con Gradle

```bash
# Compilar y ejecutar
./gradlew bootRun

# O en Windows
gradlew.bat bootRun
```

### Con Maven (si lo prefieres)

```bash
mvn spring-boot:run
```

## 📚 Endpoints Disponibles

### Health Check
- `GET /api/health` - Verificar que el servidor está corriendo

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/active` - Obtener solo productos activos
- `GET /api/products/{id}` - Obtener producto por ID
- `GET /api/products/search?name=producto` - Buscar productos por nombre
- `GET /api/products/category/{category}` - Obtener productos por categoría
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto
- `PATCH /api/products/{id}/deactivate` - Desactivar producto

## 📝 Ejemplo de Crear un Producto

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Laptop de alta gama",
    "price": 1299.99,
    "stockQuantity": 10,
    "category": "Electrónica",
    "imageUrl": "https://example.com/laptop.jpg",
    "isActive": true
  }'
```

## 🔗 Conexión con Angular

El backend ya tiene CORS configurado para conectar con Angular en `http://localhost:4200`.

En tu servicio Angular, usa:

```typescript
private apiUrl = 'http://localhost:8080/api/products';
```

## 📁 Estructura del Proyecto

```
src/main/java/com/example/demo/
├── config/           - Configuraciones (CORS, etc)
├── controller/       - REST Controllers
├── dto/             - Data Transfer Objects
├── model/           - Entidades JPA
├── repository/      - Interfaces de repositorios
├── service/         - Lógica de negocio
└── DemoApplication.java
```

## 🔧 Variables de Entorno (Opcional)

Puedes usar variables de entorno en lugar de hardcodear credenciales:

```properties
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:}
```

Luego en terminal:
```bash
export DB_USERNAME=postgres
export DB_PASSWORD=micontraseña
```

## 🧪 Testing

```bash
./gradlew test
```

## 📝 Notas

- El servidor corre en `http://localhost:8080`
- Las tablas se crean automáticamente gracias a `ddl-auto=update`
- Los productos tienen soft delete con el campo `is_active`

## 📚 Documentación Adicional

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL JDBC](https://jdbc.postgresql.org/)
