# Archivos de Seed

Esta carpeta contiene los archivos JSON que se utilizan para poblar la base de datos con datos de ejemplo.

## Estructura de Archivos

### `products.json`

Contiene los productos que se crearán en la base de datos.

**Estructura:**

```json
[
  {
    "name": "Nombre del producto",
    "sku": "SKU-UNICO-001",
    "salePrice": 100000,
    "costPrice": 80000
  }
]
```

**Campos requeridos:**

- `name`: Nombre del producto
- `sku`: Código único del producto (debe ser único)
- `salePrice`: Precio de venta (debe ser > costPrice)
- `costPrice`: Precio de costo

**Campos que se generan automáticamente:**

- `id`: Identificador único (cuid)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización

### `tenders.json`

Contiene las licitaciones que se crearán.

**Estructura:**

```json
[
  {
    "client": "Nombre del cliente",
    "awardDate": "2024-01-15"
  }
]
```

**Campos requeridos:**

- `client`: Nombre del cliente
- `awardDate`: Fecha de adjudicación en formato YYYY-MM-DD

**Campos que se generan automáticamente:**

- `id`: Identificador único (cuid)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización

### `orders.json`

Contiene las órdenes que relacionan licitaciones con productos.

**Estructura:**

```json
[
  {
    "tenderIndex": 0,
    "productIndex": 0,
    "quantity": 50
  }
]
```

**Campos requeridos:**

- `tenderIndex`: Índice de la licitación en el array de tenders.json (0-based)
- `productIndex`: Índice del producto en el array de products.json (0-based)
- `quantity`: Cantidad del producto en la licitación

**Campos que se generan automáticamente:**

- `id`: Identificador único (cuid)
- `tenderId`: ID de la licitación (se obtiene del tenderIndex)
- `productId`: ID del producto (se obtiene del productIndex)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización

## Cómo Usar

1. **Modificar datos existentes**: Edita los archivos JSON directamente
2. **Agregar nuevos datos**: Añade nuevos objetos a los arrays
3. **Eliminar datos**: Remueve objetos de los arrays
4. **Ejecutar seed**: `npm run seed`

## Ejemplos

### Agregar un nuevo producto

```json
{
  "name": "Nuevo Producto",
  "sku": "NUEVO-SKU-001",
  "salePrice": 200000,
  "costPrice": 150000
}
```

### Agregar una nueva licitación

```json
{
  "client": "Nuevo Cliente",
  "awardDate": "2024-06-01"
}
```

### Agregar una nueva orden

```json
{
  "tenderIndex": 2,
  "productIndex": 3,
  "quantity": 25
}
```

## Notas Importantes

- Los índices en `orders.json` deben corresponder a las posiciones en los arrays de `tenders.json` y `products.json`
- Los SKUs deben ser únicos
- El `salePrice` debe ser mayor que el `costPrice`
- Las fechas deben estar en formato ISO (YYYY-MM-DD)
- Las cantidades deben ser números enteros positivos
- **NO incluir campos como `row_number`, `id`, `created_at`, `updated_at`** - estos se generan automáticamente

## Validaciones

El script de seed incluye validaciones para:

- Verificar que los archivos JSON existan
- Validar que los índices en orders.json sean válidos
- Verificar que los SKUs sean únicos
- Asegurar que salePrice > costPrice
- Mostrar estadísticas financieras al finalizar

## Campos Excluidos

Los siguientes campos **NO** deben incluirse en los archivos JSON ya que se generan automáticamente:

### Productos

- ❌ `row_number` - Campo redundante
- ❌ `id` - Se genera automáticamente
- ❌ `created_at` / `updated_at` - Se generan automáticamente
- ❌ `description` - No existe en el esquema

### Licitaciones

- ❌ `row_number` - Campo redundante
- ❌ `id` - Se genera automáticamente
- ❌ `created_at` / `updated_at` - Se generan automáticamente
- ❌ `delivery_date`, `delivery_address`, `contact_phone`, `contact_email`, `margin` - No existen en el esquema

### Órdenes

- ❌ `row_number` - Campo redundante
- ❌ `id` - Se genera automáticamente
- ❌ `tender_id`, `product_id` - Se obtienen de los índices
- ❌ `price`, `observation` - No existen en el esquema
- ❌ `created_at` / `updated_at` - Se generan automáticamente
