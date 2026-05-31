import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main(){
  const result = await prisma.projectStudent.upsert({
    where: { projectId_userId: { projectId: 'f2222222-2222-4222-8222-222222222222', userId: 'd3333333-3333-4333-8333-333333333333' } },
    create: { id: 'temp-id', project: { connect: { id: 'f2222222-2222-4222-8222-222222222222' } }, user: { connect: { id: 'd3333333-3333-4333-8333-333333333333' } }, groupName: 'Grupo Teste' },
    update: { groupName: 'Grupo Teste' },
  });
  console.log('upsert result', result);
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());
