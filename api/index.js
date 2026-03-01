const { app, initVercel } = require("../dist/index.cjs");

module.exports = async (req, res) => {
    await initVercel();
    return app(req, res);
};
