const Router = require("express");
const { validateProduct } = require("../validations/products.validation.js");
const { send } = require("../controllers/consults.controller.js");

const routes = Router();

routes
    .post("/send-consult", validateProduct, (req, res) => {
        send(req, res);
    });

module.exports = routes;