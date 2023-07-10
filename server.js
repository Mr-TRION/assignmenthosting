const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const server = require("http").Server(app);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require("dotenv").config({ path: "./config.env" });
const connectDb = require("./utilsServer/connectDb");
connectDb();
app.use(express.json());
const PORT = process.env.PORT || 5000;


nextApp.prepare().then(() => {
    fs.readdirSync(path.resolve(`./api`)).map(filePath =>
        app.use(`/api/${filePath.split(".")[0]}`, require(`./api/${filePath}`))
    );

    app.all("*", (req, res) => handle(req, res));

    server.listen(PORT, err => {
        if (err) throw err;
        console.log("Express server running");
    });
});