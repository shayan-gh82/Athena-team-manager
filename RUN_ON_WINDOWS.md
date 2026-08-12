# Run Aurora Team Manager on Windows / PowerShell

## 1. Open the final project folder

```powershell
cd "PATH_TO_PROJECT\HW-L04-02-Team-Task-Manager-Shayan-Ghane-Final"
```

## 2. Install dependencies

```powershell
npm install
```

## 3. Run the complete quality check

```powershell
npm run qa
```

This runs TypeScript checking, ESLint and the production Vite build.

## 4. Start the development server

```powershell
npm run dev
```

Open the address printed by Vite, normally:

```text
http://127.0.0.1:5173/
```

## Demo manager account

```text
Email: manager@aurora.local
Password: 123456
```

## Optional formatting check

```powershell
npm run format:check
```

To automatically format the project:

```powershell
npm run format
```

## Team reproducibility

After the first successful `npm install`, commit the generated `package-lock.json` to the shared GitHub repository so both teammates use the same resolved dependency tree.
