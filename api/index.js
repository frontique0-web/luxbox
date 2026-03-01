import init from "../dist/index.cjs";

export default async function handler(req, res) {
    await init.initVercel();
    return init.app(req, res);
}
