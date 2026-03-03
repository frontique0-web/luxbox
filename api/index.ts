import { app, initVercel } from '../server';

export default async function handler(req: any, res: any) {
    try {
        await initVercel();
        return app(req, res);
    } catch (error) {
        console.error('Vercel API error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
