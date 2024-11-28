import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'securepassword';
    const hashedPassword = bcrypt.hashSync(adminPassword, bcrypt.genSaltSync(10));

    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!admin) {
        await prisma.user.create({
            data: {
                name: '',
                surname: '',
                email: adminEmail,
                password: hashedPassword,
                roles: ['ADMIN'],
            },
        });
        console.log(`Admin user created with email: ${adminEmail}`);
    } else {
        console.log(`Admin user with email ${adminEmail} already exists.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
