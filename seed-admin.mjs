// ============================================================
// FILE: seed-admin.mjs (NEW FILE — place in project root)
// Run once after deployment to create the initial admin user.
//
// Usage:
//   DATABASE_URL="mysql://user:pass@host:3306/dbname" \
//   JWT_SECRET="your-secret" \
//   node seed-admin.mjs
//
// You will be prompted for username, password, name, and email.
// ============================================================

import { createInterface } from "readline";
import { drizzle } from "drizzle-orm/mysql2";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

// ---- Prompt helper ----
function prompt(question, hidden = false) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL environment variable is required.");
    console.error(
      'Usage: DATABASE_URL="mysql://user:pass@host:3306/dbname" node seed-admin.mjs'
    );
    process.exit(1);
  }

  console.log("=== Fox Valley AI — Admin Account Setup ===\n");

  const username = await prompt("Admin username: ");
  const password = await prompt("Admin password (min 8 chars): ");
  const name = await prompt("Display name: ");
  const email = await prompt("Email (optional, press Enter to skip): ");

  if (!username || !password || !name) {
    console.error("ERROR: Username, password, and name are required.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("ERROR: Password must be at least 8 characters.");
    process.exit(1);
  }

  console.log("\nCreating admin account...");

  try {
    const db = drizzle(databaseUrl);
    const passwordHash = await bcrypt.hash(password, 12);
    const openId = nanoid();

    await db.execute({
      sql: `INSERT INTO users (openId, username, passwordHash, name, email, loginMethod, role, lastSignedIn)
            VALUES (?, ?, ?, ?, ?, 'local', 'admin', NOW())
            ON DUPLICATE KEY UPDATE
              passwordHash = VALUES(passwordHash),
              name = VALUES(name),
              role = 'admin'`,
      params: [openId, username, passwordHash, name, email || null],
    });

    console.log(`\n✅ Admin account created successfully!`);
    console.log(`   Username: ${username}`);
    console.log(`   Role: admin`);
    console.log(`\nYou can now log in at: https://your-domain.com/login`);
  } catch (error) {
    console.error("ERROR: Failed to create admin account:", error.message);
    process.exit(1);
  }

  process.exit(0);
}

main();
