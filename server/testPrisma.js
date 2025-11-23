const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database!");
  } catch (err) {
    console.error("❌ Failed to connect:", err);
  } finally {
    await prisma.$disconnect();
  }
})();
