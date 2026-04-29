# Proyecto Listo (Front + Backend)

Estructura final limpia:

- `front`: frontend React/Vite
- `backend`: backend Express + SQLite
- `index.html` y `assets` en la raiz para GitHub Pages

## Si, subes solo el frontend a GitHub Pages

GitHub Pages solo sirve archivos estaticos. En tu caso:

- Se publica el frontend compilado (raiz del repo)
- El backend queda corriendo en tu PC
- Cloudflare Tunnel expone el backend de forma publica

## Variables de entorno

### Backend (`backend/.env`)

```env
PORT=3001
API_KEY=mi_clave_segura
ALLOWED_ORIGIN=https://TU_USUARIO.github.io
```

### Frontend local (`front/.env.development`)

```env
VITE_API_URL=http://localhost:3001
VITE_API_KEY=mi_clave_segura
```

### Frontend produccion (`front/.env.production`)

```env
VITE_API_URL=https://TU-TUNNEL.trycloudflare.com
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

3. Exponer backend con Cloudflare Tunnel:

```bash
cloudflared tunnel --url http://localhost:3001
```

4. Pegar la URL del tunnel en `front/.env.production`.

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
