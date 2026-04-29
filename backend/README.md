# Backend PostgreSQL (Express)

Backend en Node.js con Express y PostgreSQL, pensado para correr en Render.

## Requisitos cumplidos

- Servidor Express en puerto `3001` (configurable por `PORT`)
- Conexion a PostgreSQL mediante `DATABASE_URL`
- Tabla `vehicles` e indice por `patente` creados automaticamente si no existen
- Endpoints:
  - `POST /api/vehicles`
  - `GET /api/vehicles/:patente`
  - `GET /search`
- Seguridad con header `x-api-key` (lee `API_KEY` desde `.env`)
- CORS limitado por lista de dominios en `ALLOWED_ORIGINS`
- Rate limit de `100` requests por IP cada `15` minutos
- Validacion de `patente` (obligatoria, maximo 10 caracteres)
- Manejo de errores `500` para base de datos y `404` para no encontrado

## Variables de entorno

### Backend `.env`

```env
PORT=3001
API_KEY=mi_clave_segura
ALLOWED_ORIGINS=https://alfredoma12.github.io,https://alerta-7k4.pages.dev
DATABASE_URL=postgresql://usuario:password@host:5432/database
PGSSLMODE=require
```

### Frontend `.env.development`

```env
VITE_API_URL=http://localhost:3001
VITE_API_KEY=mi_clave_segura
```

### Frontend `.env.production`

```env
VITE_API_URL=https://tu-api-fjlx.onrender.com
VITE_API_KEY=mi_clave_segura
```

## Instalacion y ejecucion

1. Entra a la carpeta:

```bash
cd backend
```

2. Instala dependencias:

```bash
npm install
```

3. Crea archivo `.env` a partir de `.env.example`:

```env
API_KEY=mi_clave_segura
ALLOWED_ORIGINS=https://alfredoma12.github.io,https://alerta-7k4.pages.dev
PORT=3001
DATABASE_URL=postgresql://usuario:password@host:5432/database
PGSSLMODE=disable
```

4. Ejecuta servidor:

```bash
npm start
```

Servidor disponible en:

`http://localhost:3001`

## Correr frontend

Desde la carpeta `front`:

```bash
npm install
npm run dev
```

Para desarrollo local, usa `front/.env.development` con `VITE_API_URL=http://localhost:3001`.

## Deploy backend en Render

1. Crea un Web Service en Render apuntando a la carpeta `backend`.
2. Configura Start Command: `npm start`.
3. Variables de entorno en Render:

```env
PORT=10000
API_KEY=mi_clave_segura
ALLOWED_ORIGINS=https://alfredoma12.github.io,https://alerta-7k4.pages.dev
DATABASE_URL=postgresql://usuario:password@host:5432/database
PGSSLMODE=require
```

4. Usa la URL publica entregada por Render (ejemplo: `https://tu-api-fjlx.onrender.com`).
5. Actualiza `front/.env.production`:

```env
VITE_API_URL=https://tu-api-fjlx.onrender.com
VITE_API_KEY=mi_clave_segura
```

## Publicar frontend en GitHub Pages

Desde `front`:

```bash
npm run build:github
```

Despues publica la rama en GitHub Pages (source: rama `main`, carpeta `/ (root)`).

Importante: en produccion no uses localhost en `VITE_API_URL`. Debe ser la URL publica de Render.

## Endpoints

### POST /api/vehicles

Crea un registro de vehiculo.

Headers:

- `Content-Type: application/json`
- `x-api-key: tu_api_key_segura`

Body de ejemplo:

```json
{
  "patente": "AB1234",
  "marca": "Toyota",
  "modelo": "Corolla",
  "color": "Blanco",
  "descripcion": "Vehiculo reportado"
}
```

### GET /api/vehicles/:patente

Busca el ultimo registro por patente.

Headers:

- `x-api-key: tu_api_key_segura`

Ejemplo:

`GET http://localhost:3001/api/vehicles/AB1234`

### GET /search

Busca registros para el frontend.

Query params opcional:

- `q`: texto para buscar por patente, marca, modelo, color o descripcion

Headers:

- `x-api-key: tu_api_key_segura`

Ejemplo:

`GET http://localhost:3001/search?q=AB12`

## Ejemplo fetch desde frontend

```js
const API_URL = `${import.meta.env.VITE_API_URL}/api/vehicles`;
const API_KEY = import.meta.env.VITE_API_KEY;

async function crearVehiculo() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      patente: 'AB1234',
      marca: 'Toyota',
      modelo: 'Corolla',
      color: 'Blanco',
      descripcion: 'Vehiculo reportado',
    }),
  });

  const data = await response.json();
  console.log(data);
}

async function buscarVehiculo(patente) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(patente)}`, {
    headers: {
      'x-api-key': API_KEY,
    },
  });

  const data = await response.json();
  console.log(data);
}
```

## Seguridad basica

- Se mantiene rate limit de 100 requests por IP cada 15 minutos.
- `x-api-key` es obligatoria en todos los endpoints.
- CORS solo permite los dominios configurados en `ALLOWED_ORIGINS` (sin wildcard).
- Todas las respuestas de error se devuelven en JSON.

Nota: cualquier variable `VITE_*` del frontend queda visible en el cliente. Usa una API key de bajo privilegio para frontend y rota esa clave cuando sea necesario.
