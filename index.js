"use strict";

global.$axios = require("axios");
global.$consign = require("consign");
global.$moment = require("moment");
require("moment-precise-range-plugin");
global.$redis = require("redis");

global.$path = require("path");
global.BASE_PATH = $path.resolve(__dirname, "./")
global.APP_PATH = $path.join(BASE_PATH, "/app");

let SocketIO = require("socket.io");
let dotenv = require("dotenv");
let app = require(APP_PATH);

dotenv.config({ path: $path.join(BASE_PATH, "/.env") });
global.$env = process.env;
global.$logger = require($path.join(BASE_PATH, "/logger.js"));

const { APP_PORT, AXIOS_PROTOCOL, AXIOS_HOST, AXIOS_PORT, AXIOS_PATH } = $env;

$axios.defaults.baseURL = `${AXIOS_PROTOCOL}://${AXIOS_HOST}:${AXIOS_PORT}/${AXIOS_PATH}`;
$axios.defaults.headers.post["Content-Type"] = "application/json";

global.$io = new SocketIO(app);

$io.on("connection", (socket) => {

    $consign({ cwd: APP_PATH }).include("/redis.js").then("/socket.js").into(socket);
});

app.listen(APP_PORT, () => console.log("Servidor rodando na porta %s.", APP_PORT) );
