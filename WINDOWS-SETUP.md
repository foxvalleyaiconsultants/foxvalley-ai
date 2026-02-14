# Windows Setup Guide

This guide helps you run the Fox Valley AI project on Windows.

## Prerequisites

- Node.js 20+ installed
- MySQL 8.0 installed and running
- Git Bash or PowerShell

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create .env File

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
DATABASE_URL=mysql://foxvalley_user:your_password@localhost:3306/foxvalley_ai
JWT_SECRET=<run the command below to generate>
PORT=3000
NODE_ENV=development
```

To generate JWT_SECRET, run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 3: Setup Database

### Create MySQL Database and User

Open MySQL command line as root:

```bash
mysql -u root -p
```

Run these commands:

```sql
CREATE DATABASE IF NOT EXISTS foxvalley_ai;
CREATE USER IF NOT EXISTS 'foxvalley_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
GRANT ALL PRIVILEGES ON foxvalley_ai.* TO 'foxvalley_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Run Migrations

```bash
npm run db:push
```

## Step 4: Create Admin Account

```bash
node seed-admin.mjs
```

Follow the prompts to create your admin username and password.

## Step 5: Start Development Server

```bash
npm run dev
```

The server will start on http://localhost:3000

## Step 6: Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### "NODE_ENV is not recognized"
- Make sure you created the `.env` file with NODE_ENV=development
- The scripts have been updated to not require inline environment variables

### Database connection errors
- Check that MySQL is running
- Verify your DATABASE_URL in .env is correct
- Make sure the user has proper permissions (see Step 3)

### Port already in use
- Change PORT in .env to a different number (e.g., 3001)
- Or kill the process using port 3000

## Common Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Run database migrations
- `npm test` - Run tests
