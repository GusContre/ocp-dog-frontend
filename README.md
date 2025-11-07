# OCP Dog Frontend

Aplicación estática (HTML + JS) que consulta el servicio `ocp-dog-frontend-api` para mostrar una imagen aleatoria de perros.

## Requisitos
- Docker 20+
- Acceso de red al servicio `ocp-dog-frontend-api` dentro del mismo cluster/red

## Variables de entorno
- `FRONTEND_API_URL` (opcional): URL base del backend. Por defecto `http://ocp-dog-frontend-api:5001`.

## Ejecutar con Docker
```bash
docker build -t ocp-dog-frontend .
```

```bash
docker run --rm -p 8080:80 \
  -e FRONTEND_API_URL="http://ocp-dog-frontend-api:5001" \
  ocp-dog-frontend
```

Abre `http://localhost:8080` en el navegador y presiona **Ver perro 🐶** para pedir una nueva imagen desde la API.

## Probar localmente sin Docker
Abre `index.html` con un servidor estático local (por ejemplo `python -m http.server`). Debes asegurarte de que la variable `FRONTEND_API_URL` sea accesible desde tu entorno o editar `env-config.js` con la URL del backend.
