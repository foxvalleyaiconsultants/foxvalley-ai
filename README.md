# Fox Valley AI Consultants

A modern, full-stack web application for Fox Valley AI Consultants built with React, Express, tRPC, and MySQL.

## 🚀 Features

- **Modern Tech Stack**: React 19, Vite 7, Express 4, tRPC 11, Tailwind CSS 4
- **Type-Safe API**: End-to-end type safety with tRPC
- **Authentication**: Standalone username/password authentication with JWT
- **Database**: MySQL with Drizzle ORM
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Blog System**: Full-featured blog with posts and comments
- **Contact Forms**: Contact form with database storage
- **Newsletter**: Newsletter signup functionality
- **Admin Panel**: Admin dashboard for content management

## 📋 Prerequisites

- Node.js 20 or higher
- MySQL 8.0
- npm or pnpm

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/foxvalley-ai.git
cd foxvalley-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=mysql://your_user:your_password@localhost:3306/foxvalley_ai
JWT_SECRET=your_generated_secret_here
PORT=3000
NODE_ENV=development
```

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Setup MySQL Database

Connect to MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS foxvalley_ai;
CREATE USER IF NOT EXISTS 'foxvalley_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
GRANT ALL PRIVILEGES ON foxvalley_ai.* TO 'foxvalley_user'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Run database migrations

```bash
npm run db:push
```

### 6. Create admin account

```bash
node seed-admin.mjs
```

Follow the prompts to create your admin username and password.

### 7. Start development server

```bash
npm run dev
```

Visit http://localhost:3000

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

### Deploy to Hostinger

See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for detailed Hostinger deployment instructions.

### Deploy to Other Platforms

The application can be deployed to any Node.js hosting platform that supports:
- Node.js 20+
- MySQL database
- Environment variables

## 🗂️ Project Structure

```
foxvalley-ai/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utilities and tRPC client
│       └── App.tsx        # Main app component
├── server/                # Backend Express application
│   ├── _core/            # Core server functionality
│   ├── db.ts             # Database query helpers
│   └── routers.ts        # tRPC API routes
├── drizzle/              # Database schema and migrations
│   ├── schema.ts         # Database schema
│   └── relations.ts      # Table relations
├── shared/               # Shared types and constants
└── build.mjs             # Build script

```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Run database migrations
- `npm test` - Run tests

## 🛡️ Security

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection via Drizzle ORM
- Environment variable protection
- CORS configuration

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Authors

- Fox Valley AI Consultants

## 🐛 Bug Reports

If you discover a bug, please open an issue on GitHub.

## 📞 Support

For support, email support@foxvalleyai.com or visit our website.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database ORM by [Drizzle](https://orm.drizzle.team/)
# foxvalley-ai
# foxvalley-ai
