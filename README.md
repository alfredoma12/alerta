# Proyecto Listo (Front + Backend)

Estructura final limpia:

- `front`: frontend React/Vite
- `backend`: backend Express + SQLite
- `index.html` y `assets` en la raiz para GitHub Pages

## Si, subes solo el frontend a GitHub Pages

GitHub Pages solo sirve archivos estaticos. En tu caso:

- Se publica el frontend compilado (raiz del repo)
- El backend queda desplegado en Render

## Variables de entorno

### Backend (`backend/.env`)

```env
PORT=3001
API_KEY=mi_clave_segura
ALLOWED_ORIGIN=https://alfredoma12.github.io
```

### Frontend local (`front/.env.development`)

```env
VITE_API_URL=http://localhost:3001
VITE_API_KEY=mi_clave_segura
```

### Frontend produccion (`front/.env.production`)

```env
VITE_API_URL=https://tu-api-fjlx.onrender.com
VITE_API_KEY=mi_clave_segura
```

## Flujo de trabajo

1. Levantar backend:

```bash
cd backend
npm install
npm start
```

2. Levantar frontend local:

```bash
cd front
npm install
npm run dev
```

3. Deploy backend en Render:

- En Render crea un Web Service desde `backend`
- Start command: `npm start`
- Variables: `PORT`, `API_KEY`, `ALLOWED_ORIGIN=https://alfredoma12.github.io`
- URL publica: `https://tu-api-fjlx.onrender.com`

4. Pegar la URL de Render en `front/.env.production`.

5. Compilar frontend para GitHub Pages (deja `index.html` en raiz):

```bash
cd front
npm run build:github
```

6. Subir cambios a GitHub y publicar Pages desde `main` en `/ (root)`.

## Notas

- No usar localhost en produccion.
- `VITE_*` es visible en frontend, por lo que esa API key no es secreta real.
- Se mantiene rate limit, CORS estricto y validaciones en backend.
