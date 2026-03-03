import https from 'https';

const candidates = [
    'rest-express-lux-box',
    'lux-box',
    'luxbox',
    'rest-express',
    'lux-box-ecommerce',
    'lux-box-mu',
    'lux-box-phi',
];

async function checkDomains() {
    for (const name of candidates) {
        const url = `https://${name}.vercel.app/api/admin/seed-test`;
        console.log(`Checking ${url}...`);
        try {
            const resp = await new Promise<string>((resolve, reject) => {
                https.get(url, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => resolve(`HTTP ${res.statusCode}: ${data}`));
                }).on('error', reject);
            });
            if (!resp.includes('404: Not Found') && !resp.includes('DEPLOYMENT_NOT_FOUND')) {
                console.log(`\n\n🎯 FOUND DOMAIN: ${name}.vercel.app !!!`);
                console.log(`Response: ${resp}\n\n`);
            }
        } catch (e) {
            // ignore
        }
    }
}

checkDomains();
