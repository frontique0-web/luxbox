import "dotenv/config";
import { db } from '../server/db';
import { admins } from '../shared/schema';

async function main() {
    console.log('Creating default admin user...');

    try {
        const password = process.env.ADMIN_PASSWORD || 'admin';

        await db.insert(admins).values({
            username: 'admin',
            password: password
        });
        console.log('Admin user created:');
        console.log('Username: admin');
        console.log(`Password: ${password}`);
    } catch (error) {
        console.log('Admin user likely already exists or table not created yet.', error);
    }

    process.exit(0);
}

main();
