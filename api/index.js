import { app, initVercel } from '../dist/index.cjs';

export default async function handler(req, res) {
    try {
        await initVercel();
        return app(req, res);
    } catch (error) {
        console.error('Vercel API error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
