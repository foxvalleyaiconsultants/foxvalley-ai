# Fox Valley AI — Deployment Guide

## Overview

This is a full-stack web application built with:
- **Frontend**: React 19, Vite, Tailwind CSS 4, tRPC
- **Backend**: Express.js, tRPC, Drizzle ORM
- **Database**: MySQL
- **Authentication**: Standalone (bcrypt + JWT, no external OAuth)

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (copy from env.example.txt)
cp env.example.txt .env
# Edit .env with your database credentials and JWT secret

# 3. Push database schema
npm run db:push

# 4. Start development server
npm run dev
```

---

## Hostinger VPS Deployment

### Prerequisites

- Hostinger VPS with Node.js 18+ installed
- MySQL database created
- SSH access to the server
- Domain name pointed to the VPS IP

### Step 1: Prepare the Server

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Install Node.js 18+ (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx (for reverse proxy)
sudo apt-get install -y nginx

# Verify versions
node -v   # Should be 18+
npm -v
```

### Step 2: Create MySQL Database

```bash
# Log into MySQL
sudo mysql -u root

# Create database and user
CREATE DATABASE foxvalley_ai;
CREATE USER 'foxvalley_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON foxvalley_ai.* TO 'foxvalley_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Upload and Set Up the Application

```bash
# Create application directory
mkdir -p /var/www/foxvalley-ai
cd /var/www/foxvalley-ai

# Upload the zip file (from your local machine)
# scp foxvalley-ai-deploy.zip root@your-vps-ip:/var/www/foxvalley-ai/

# Extract
unzip foxvalley-ai-deploy.zip
mv foxvalley-ai-deploy/* .
rm -rf foxvalley-ai-deploy foxvalley-ai-deploy.zip

# Install dependencies
npm install

# Create .env file
cp env.example.txt .env
nano .env
```

### Step 4: Configure Environment Variables

Edit `.env` with your actual values:

```env
DATABASE_URL=mysql://foxvalley_user:YOUR_STRONG_PASSWORD@localhost:3306/foxvalley_ai
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
PORT=3000
NODE_ENV=production
```

### Step 5: Push Database Schema and Create Admin

```bash
# Push database schema
npm run db:push

# Create the first admin account
node seed-admin.mjs
# Follow the prompts to set username, password, name, and email
```

### Step 6: Build the Application

```bash
npm run build
```

### Step 7: Set Up PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start dist/index.js --name foxvalley-ai

# Save PM2 process list and set up auto-start
pm2 save
pm2 startup
```

### Step 8: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/foxvalley-ai
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/foxvalley-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Set Up SSL with Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Hostinger Web Hosting (Shared/Node.js Hosting)

If using Hostinger's managed Node.js hosting instead of VPS:

### Step 1: Upload Files

Upload the project files via File Manager or FTP to your hosting directory.

### Step 2: Configure via hPanel

1. Go to **Websites** → **Manage** → **Advanced** → **Node.js**
2. Set **Node.js version**: 18 or higher
3. Set **Application root**: the directory where you uploaded files
4. Set **Application startup file**: `dist/index.js`
5. Set **Application URL**: your domain

### Step 3: Set Environment Variables

In the Node.js configuration panel, add these environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `mysql://user:pass@host:3306/dbname` |
| `JWT_SECRET` | (generate a random 64-byte hex string) |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |

### Step 4: Install Dependencies and Build

Use the terminal or SSH:

```bash
npm install
npm run db:push
npm run build
node seed-admin.mjs
```

Then restart the Node.js application from hPanel.

---

## Project Structure

```
foxvalley-ai/
├── client/                 # React frontend
│   ├── public/            # Static assets (images, logo)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── _core/         # Auth hooks
│   │   ├── lib/           # tRPC client
│   │   └── App.tsx        # Routes
│   └── index.html         # HTML template
├── server/                # Express backend
│   ├── _core/            # Core server infrastructure
│   │   ├── index.ts      # Server entry point
│   │   ├── standalone-auth.ts  # JWT auth module
│   │   ├── auth-routes.ts     # Login/register endpoints
│   │   ├── context.ts    # tRPC context
│   │   ├── trpc.ts       # tRPC setup
│   │   └── vite.ts       # Vite dev/static serving
│   ├── db.ts             # Database queries
│   └── routers.ts        # tRPC API routes
├── drizzle/              # Database schema & migrations
│   └── schema.ts         # Table definitions
├── shared/               # Shared types & constants
├── dist/                 # Build output (after npm run build)
├── seed-admin.mjs        # Admin account creation script
├── env.example.txt       # Environment variable template
└── package.json          # Dependencies & scripts
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (frontend + backend) |
| `npm start` | Start production server |
| `npm run db:push` | Push database schema changes |
| `npm run check` | TypeScript type checking |
| `npm test` | Run tests |

---

## Admin Access

1. Navigate to `/login` on your deployed site
2. Log in with the admin credentials you created via `seed-admin.mjs`
3. Access the admin dashboard at `/admin`
4. From the admin panel you can:
   - Create, edit, and delete blog posts
   - View contact form submissions
   - Manage newsletter subscribers
   - Configure social media links

---

## Troubleshooting

### "Cannot find module" errors
Run `npm install` again to ensure all dependencies are installed.

### Database connection errors
- Verify `DATABASE_URL` in `.env` is correct
- Ensure MySQL is running and the database exists
- Check that the MySQL user has proper permissions

### Build fails
- Ensure Node.js 18+ is installed
- Run `npm install` before `npm run build`
- Check for TypeScript errors with `npm run check`

### Server won't start
- Check if port 3000 is already in use: `lsof -i :3000`
- Verify `.env` file exists and has correct values
- Check logs: `pm2 logs foxvalley-ai`

### Admin login not working
- Ensure you've run `node seed-admin.mjs` to create the admin account
- Verify the database schema is up to date: `npm run db:push`
