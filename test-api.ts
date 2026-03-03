import https from 'https';

https.get('https://luxbox-gamma.vercel.app/api/admin/seed-test', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Seed Test:', res.statusCode, data));
}).on('error', console.error);
