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
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción) con Prisma ORM
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

2. **Configurar variables de entorno**:

   ```bash
   # Copiar archivo de ejemplo
   cp .env.example .env.local

   # Editar .env.local con tu configuración
   # Para desarrollo local con SQLite (recomendado):
   DATABASE_URL="file:./dev.db"
   ```

3. **Configurar base de datos**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Poblar con datos de ejemplo** (opcional):

   ```bash
   npm run seed
   ```

   **Nota**: Los datos se cargan desde archivos JSON en la carpeta `seed/`. Puedes modificar estos archivos para personalizar los datos de ejemplo.

5. **Ejecutar en desarrollo**:

   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**:
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
