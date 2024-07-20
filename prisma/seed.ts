import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  for (let i = 0; i < 100; i++) {
    await prisma.category.create({
      data: {
        name: faker.commerce.department(), // Using commerce.department() to generate category names
      },
    });
  }

  console.log('Data seeded successfully');
}

main()
  .catch(e => {
    console.error('Error seeding data:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
