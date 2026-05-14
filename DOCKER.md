# Docker

Setup ini menjalankan tiga service:

- `frontend`: Next.js production standalone di port `3000`
- `backend`: Express + Socket.IO di port `4000`
- `mysql`: MySQL 8.4 di port host `3307` dan port container `3306`

Node image memakai `node:20.19.1-alpine`, yang kecil dan sesuai target Node 20.19.1 / npm 10.8.2. Container tidak memakai `npm start` atau `npm run dev`; runtime langsung menjalankan file production dengan `node`.

## Jalankan

```bash
docker compose up --build
```

Frontend:

```txt
http://localhost:3000
```

Backend:

```txt
http://localhost:4000
```

## Database

MySQL dibuat otomatis dengan:

```txt
database: kiosk_restaurant
user: root
password: root
host dari backend container: mysql
port dari host machine: 3307
```

Backend akan menunggu koneksi database lalu menjalankan migration yang belum pernah dijalankan. Untuk mematikan auto migration:

```yaml
RUN_MIGRATIONS: "false"
```

di service `backend` pada `docker-compose.yml`.

## Login Session di Localhost

Untuk local Docker yang masih memakai `http://localhost`, backend memakai:

```yaml
SESSION_COOKIE_SECURE: "false"
SESSION_COOKIE_SAME_SITE: lax
```

Jika deploy ke HTTPS production, ubah menjadi:

```yaml
SESSION_COOKIE_SECURE: "true"
SESSION_COOKIE_SAME_SITE: none
```

## Rebuild Bersih

```bash
docker compose down -v
docker compose up --build
```

Perintah `down -v` akan menghapus volume database, jadi semua data MySQL ikut hilang.
