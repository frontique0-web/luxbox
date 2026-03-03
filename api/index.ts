import { app, initVercel } from '../server';

export default async function handler(req: any, res: any) {
    // DIAGNOSTIC 1: Check if Vercel is providing the DATABASE_URL
    if (!process.env.DATABASE_URL) {
        return res.status(500).json({
            error: "CRITICAL: DATABASE_URL is totally missing from Vercel Environment Variables.",
            help: "Please go to Vercel -> Settings -> Environment Variables and add DATABASE_URL, then Redeploy."
        });
    }

    try {
        await initVercel();
        return app(req, res);
    } catch (error: any) {
        console.error('Vercel API error:', error);
        res.status(500).json({
            error: 'Internal Server Error during Vercel Initialization',
            message: error.message || String(error),
            stack: error.stack
        });
    }
}
