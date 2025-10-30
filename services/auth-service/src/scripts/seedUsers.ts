// Use the bundled/generated Prisma client to avoid relying on `prisma generate` in this environment.
import bcrypt from 'bcrypt';
const GeneratedPrisma = require('../../generated/prisma');
// const PrismaClient = GeneratedPrisma.PrismaClient || GeneratedPrisma.default?.PrismaClient || GeneratedPrisma.Prisma;
const prisma = new (GeneratedPrisma.PrismaClient || GeneratedPrisma.PrismaClient || GeneratedPrisma.Prisma)();

async function seed() {
  try {
    const saltRounds = 10;
    const users = [
      { email: 'testplayer1@example.com', name: 'testplayer1', password: 'password1' },
      { email: 'testplayer2@example.com', name: 'testplayer2', password: 'password2' }
    ];
    ;
    for (const u of users) {
      const existing = await prisma.user.findUnique({ where: { email: u.email } });
      if (existing) {
        console.log(`User ${u.email} already exists, skipping`);
        continue;
      }
      const hash = await bcrypt.hash(u.password, saltRounds);
      const created = await prisma.user.create({ data: { email: u.email, name: u.name, password: hash } });
      console.log('Created user:', created.email);
    }
  } catch (err) {
    console.error('Seeding failed', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
