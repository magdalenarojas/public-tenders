# 🐳 Docker Setup - Public Tenders

## 🎯 Configuración Recomendada para Prueba Técnica

### Opción 1: Desarrollo Local con PostgreSQL (Recomendado)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar PostgreSQL con Docker
npm run docker:dev

# 3. Iniciar aplicación
npm run dev
```

### 📁 Ubicación de la Base de Datos

**Datos almacenados en:** `./data/postgres/`

- ✅ **Persistencia local**: Los datos se mantienen entre reinicios
- ✅ **Fácil backup**: Copiar la carpeta `data/`
- ✅ **Portable**: Funciona en cualquier sistema
- ✅ **Limpio**: No contamina el sistema

### 🔧 Comandos Disponibles

```bash
# Configuración inicial (solo una vez)
npm run docker:dev

# Gestión de contenedores
npm run docker:up      # Iniciar PostgreSQL
npm run docker:down    # Detener PostgreSQL
npm run docker:logs    # Ver logs de PostgreSQL
npm run docker:restart # Reiniciar PostgreSQL

# Desarrollo
npm run dev           # Iniciar aplicación Next.js
npm run seed          # Poblar base de datos
npm run reset         # Limpiar base de datos
```

### 📊 Información de Conexión

- **Host**: localhost
- **Puerto**: 5432
- **Base de datos**: public_tenders
- **Usuario**: postgres
- **Contraseña**: postgres123

### 🗂️ Estructura de Datos

```
public-tenders/
├── data/
│   └── postgres/          # Datos de PostgreSQL
├── docker-compose.yml     # Configuración Docker
├── Dockerfile            # Imagen de la aplicación
└── scripts/
    └── dev-setup.sh      # Script de configuración
```

### 🚀 Ventajas de esta Configuración

1. **Simple**: Solo PostgreSQL en Docker
2. **Persistente**: Los datos se mantienen
3. **Portable**: Funciona en cualquier sistema
4. **Limpio**: No instala nada en el sistema
5. **Escalable**: Fácil migrar a la nube

### 🔄 Flujo de Trabajo

1. **Primera vez**: `npm run docker:dev`
2. **Desarrollo**: `npm run dev`
3. **Datos**: Se guardan automáticamente en `./data/postgres/`
4. **Backup**: Copiar carpeta `data/`
5. **Limpieza**: `npm run docker:down` y eliminar `data/`

### 🆘 Solución de Problemas

```bash
# Ver logs de PostgreSQL
npm run docker:logs

# Reiniciar PostgreSQL
npm run docker:restart

# Limpiar todo y empezar de nuevo
npm run docker:down
rm -rf data/
npm run docker:dev
```

### 📦 Para Producción

Si necesitas desplegar en producción, puedes usar:

- **Railway**: PostgreSQL + Next.js
- **Vercel**: PostgreSQL + Next.js
- **DigitalOcean**: PostgreSQL + Next.js
- **AWS**: RDS + ECS/EC2

Solo necesitas cambiar la `DATABASE_URL` en las variables de entorno.
