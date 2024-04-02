const express = require("express");
const multer = require("multer");
const cors = require("cors");
const sendMail = require("./mailer.js");

const productsRouter = require("./routes/products.router.js");
const database = require("./connectionDB.js");

const { ENV_PATH, DIR_PUBLIC_PATH } = require("./constants/paths.js");
const { ERROR_SERVER } = require("./constants/messages.js");

// variables de entorno
require("dotenv").config({ path: ENV_PATH });

// Configuración de express
const server = express();
const PORT = process.env.PORT || 3030;
const HOST = process.env.HOST || "localhost";

// configuración de CORS
server.use(cors());

// Middlewares
server.use(express.json());
server.use("/api/products", productsRouter);

// Configuración de carpeta estatica
server.use("/public", express.static(DIR_PUBLIC_PATH));

// Endpoint para obtener los coches. URL: http://127.0.0.1:3000/api/send-mail?marca=Fiat&anio=2021
server.get("/api/send-mail", async (req, res) => {
    res.set({ "Content-Type": "application/json" });

    try {
        const { to, subject, content } = req.query;

        if (!to || !subject || !content) {
            return res.status(400).send({ error: "Faltan datos relevantes" });
        }

        const result = await sendMail(to, subject, content);
        console.log(result);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: MESSAGE_500 });
    }
});

// Control de errores
server.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(error.code).send({ success: false, message: error.field });
    }

    res.status(500).send({ success: false, message: ERROR_SERVER });
});

// Control de rutas inexistentes
server.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

// Método oyente de solicitudes
server.listen(PORT, HOST, () => {
    console.log(`Server NodeJS version: ${process.version}`);
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
    database.connect(process.env.DATABASE_URL, process.env.DATABASE_NAME);
});

// Método para desconectar MongoDB
process.on("SIGINT", async () => {
    await database.desconnect();
    process.exit();
});