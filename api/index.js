export default async function handler(req, res) {
    const { app, initVercel } = await import("../dist/index.cjs");
    await initVercel();
    return app(req, res);
}
