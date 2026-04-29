# Backend SQLite (Express)

Backend simple en Node.js con Express y SQLite, sin Prisma ni PostgreSQL.

## Requisitos cumplidos

- Servidor Express en puerto `3001` (configurable por `PORT`)
- Base local SQLite: `database.db`
- Tabla `vehicles` creada automaticamente si no existe
- Endpoints:
  - `POST /api/vehicles`
  - `GET /api/vehicles/:patente`
- Seguridad con header `x-api-key` (lee `API_KEY` desde `.env`)
- CORS limitado a `https://TU_USUARIO.github.io` (o `ALLOWED_ORIGIN`)
- Rate limit de `100` requests por IP cada `15` minutos
- Validacion de `patente` (obligatoria, maximo 10 caracteres)
- Manejo de errores `500` para base de datos y `404` para no encontrado

## Variables de entorno

### Backend `.env`

```env
PORT=3001
API_KEY=mi_clave_segura
ALLOWED_ORIGIN=https://TU_USUARIO.github.io
```

### Frontend `.env.development`

```env
VITE_API_URL=http://localhost:3001
VITE_API_KEY=mi_clave_segura
```

### Frontend `.env.production`

```env
VITE_API_URL=https://TU-TUNNEL.trycloudflare.com
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
ALLOWED_ORIGIN=https://TU_USUARIO.github.io
PORT=3001
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

## Levantar Cloudflare Tunnel

Con `cloudflared` instalado:

```bash
cloudflared tunnel --url http://localhost:3001
```

Cloudflare te entregara una URL publica con formato `https://xxxx.trycloudflare.com`.

Luego actualiza `front/.env.production`:

```env
VITE_API_URL=https://TU-TUNNEL.trycloudflare.com
VITE_API_KEY=mi_clave_segura
```

## Publicar frontend en GitHub Pages

Desde `front`:

```bash
npm run build:github
```

Despues publica la rama en GitHub Pages (source: rama `main`, carpeta `/ (root)`).

Importante: en produccion no uses localhost en `VITE_API_URL`. Debe ser la URL publica del tunnel.

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
- CORS solo permite `ALLOWED_ORIGIN` (sin wildcard).
- Todas las respuestas de error se devuelven en JSON.

Nota: cualquier variable `VITE_*` del frontend queda visible en el cliente. Usa una API key de bajo privilegio para frontend y rota esa clave cuando sea necesario.
