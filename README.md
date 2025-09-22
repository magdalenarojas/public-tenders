# Sistema de Licitaciones Públicas

Sistema completo para la gestión de licitaciones públicas adjudicadas, productos y cálculo de márgenes.

## 🚀 Características

- **Gestión de Productos**: Catálogo completo con SKU, precios y costos
- **Licitaciones**: Registro de licitaciones adjudicadas con productos asociados
- **Cálculo de Márgenes**: Automático por producto y por licitación
- **Dashboard**: Resumen ejecutivo con estadísticas y rankings
- **Validaciones**: Reglas de negocio implementadas (precio > costo, etc.)

## 🛠️ Tecnologías

- **Frontend**: Next.js 15 con TypeScript
- **Styling**: Tailwind CSS
- **Base de Datos**: SQLite con Prisma ORM
- **Iconos**: Lucide React
- **Validaciones**: Lógica de negocio personalizada

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🚀 Instalación

1. **Instalar dependencias**:

   ```bash
   npm install
   ```

2. **Configurar base de datos**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Poblar con datos de ejemplo** (opcional):

   ```bash
   npm run seed
   ```

   **Nota**: Los datos se cargan desde archivos JSON en la carpeta `seed/`. Puedes modificar estos archivos para personalizar los datos de ejemplo.

4. **Ejecutar en desarrollo**:

   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 📊 Funcionalidades

### Dashboard Principal

- Estadísticas generales (total licitaciones, productos, ingresos, margen)
- Top 5 licitaciones por margen
- Licitaciones recientes
- Acciones rápidas

### Gestión de Productos

- CRUD completo de productos
- Validación de SKU único
- Cálculo automático de margen por producto
- Validación: precio de venta > costo

### Gestión de Licitaciones

- Crear licitaciones con múltiples productos
- Cálculo automático de márgenes totales
- Vista detallada por licitación
- Resumen financiero completo

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── products/      # CRUD productos
│   │   ├── tenders/       # CRUD licitaciones
│   │   └── stats/         # Estadísticas
│   ├── products/          # Páginas de productos
│   ├── tenders/           # Páginas de licitaciones
│   └── page.tsx           # Dashboard principal
├── lib/                   # Utilidades
│   ├── prisma.ts         # Cliente Prisma
│   └── validations.ts    # Validaciones de negocio
└── types/                 # Tipos TypeScript
```

## 🎯 Reglas de Negocio

1. **Productos**:

   - SKU debe ser único
   - Precio de venta > costo
   - No se puede eliminar producto con órdenes asociadas

2. **Licitaciones**:

   - Debe tener al menos un producto
   - Cantidades > 0
   - Fecha de adjudicación requerida

3. **Cálculos**:
   - Margen = (precio - costo) × cantidad
   - Margen total por licitación = suma de márgenes de productos

## 📈 API Endpoints

### Productos

- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/[id]` - Obtener producto
- `PUT /api/products/[id]` - Actualizar producto
- `DELETE /api/products/[id]` - Eliminar producto

### Licitaciones

- `GET /api/tenders` - Listar licitaciones
- `POST /api/tenders` - Crear licitación
- `GET /api/tenders/[id]` - Obtener licitación
- `DELETE /api/tenders/[id]` - Eliminar licitación

### Estadísticas

- `GET /api/stats` - Estadísticas generales

## 🎨 Interfaz de Usuario

- **Diseño Responsivo**: Adaptable a móviles y desktop
- **Componentes Modernos**: Cards, tablas, formularios
- **Navegación Intuitiva**: Breadcrumbs y enlaces claros
- **Feedback Visual**: Estados de carga, errores y confirmaciones

## 🔧 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Base de datos
npx prisma studio    # Interfaz visual de la BD
npx prisma db push   # Aplicar cambios al esquema
npx prisma generate  # Generar cliente

# Datos
npm run seed         # Poblar con datos de ejemplo
npm run reset        # Limpiar base de datos
npm run reset:seed   # Limpiar y poblar con datos de ejemplo

# Producción
npm run build        # Construir para producción
npm run start        # Servidor de producción
```

### Archivos de Seed

Los datos de ejemplo se cargan desde archivos JSON en la carpeta `seed/`:

- `seed/products.json` - Productos
- `seed/tenders.json` - Licitaciones
- `seed/orders.json` - Relaciones entre licitaciones y productos

Puedes modificar estos archivos para personalizar los datos de ejemplo. Ver `seed/README.md` para más detalles.

### Base de Datos

El esquema incluye tres entidades principales:

- **Tender**: Licitaciones con cliente y fecha
- **Product**: Productos con SKU, precios y costos
- **Order**: Relación muchos-a-muchos entre licitaciones y productos

## 📝 Notas de Implementación

- **Validaciones**: Implementadas tanto en frontend como backend
- **Transacciones**: Uso de transacciones Prisma para operaciones complejas
- **Tipos**: TypeScript estricto en toda la aplicación
- **Performance**: Consultas optimizadas con includes de Prisma

## 🚀 Despliegue a Producción

### Opciones de Despliegue

#### 1. **Vercel** (Recomendado para Next.js)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel Dashboard
# DATABASE_URL: tu_url_de_base_de_datos
```

#### 2. **Railway** (PostgreSQL incluido)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Desplegar
railway login
railway up

# Railway configurará PostgreSQL automáticamente
```

#### 3. **DigitalOcean App Platform**

```bash
# Crear App en DigitalOcean
# Conectar repositorio GitHub
# Configurar variables de entorno
# Usar PostgreSQL como base de datos
```

#### 4. **Docker (Genérico)**

```bash
# Build de la imagen
docker build -f Dockerfile.prod -t public-tenders .

# Ejecutar
docker run -p 3000:3000 -e DATABASE_URL=tu_url public-tenders
```

### 🔧 Script de Despliegue Automático

```bash
# Ejecutar script de despliegue
./scripts/deploy.sh
```

### 📋 Configuración Post-Despliegue

1. **Configurar base de datos**:

   ```bash
   npx prisma db push
   ```

2. **Poblar con datos** (opcional):

   ```bash
   npm run seed
   ```

3. **Variables de entorno requeridas**:
   - `DATABASE_URL`: URL de tu base de datos PostgreSQL
   - `NODE_ENV`: production

## 🐳 Docker Setup (Recomendado para Producción)

### Configuración con PostgreSQL

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno Docker completo
npm run docker:setup

# 3. Iniciar aplicación
npm run dev
```

### Servicios Incluidos

- **PostgreSQL**: Base de datos principal (puerto 5432)
- **pgAdmin**: Interfaz web para administrar la base de datos (puerto 8080)
- **Aplicación**: Next.js (puerto 3000)

### Comandos Docker

```bash
# Configurar todo el entorno
npm run docker:setup

# Iniciar servicios
npm run docker:up

# Ver logs
npm run docker:logs

# Detener servicios
npm run docker:down

# Reiniciar servicios
npm run docker:restart
```

### Acceso a Servicios

- **Aplicación**: http://localhost:3000
- **pgAdmin**: http://localhost:8080
  - Email: admin@admin.com
  - Password: admin123
- **PostgreSQL**: localhost:5432
  - Database: public_tenders
  - User: postgres
  - Password: postgres123

---

**Desarrollado como prueba técnica para gestión de licitaciones públicas** 🏛️
