# KIOSK RESTAURANT

### How to run program

## BACKEND
First, run this code to go to the backend
```bash
cd backend
```
- install package
```bash
npm install
```
- copy config
```bash
cp config-example config
```
- copy env
```bash
cp .env.example .env
```
- running migration
```bash
npx sequelize-cli db:migrate
```
- run program
```bash
npm start
```

## FRONTEND
First, run this code to go to the frontend
```bash
cd frontend
```
- install package
```bash
npm install
```
- copy env
```bash
cp .env.example .env
```
- run program
```bash
npm run dev
```

### Required SDK
- node version `20.19.2^`
- mysql version `10.4.18^`