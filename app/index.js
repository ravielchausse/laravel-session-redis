"use strict";

let expressValidator = require("express-validator");
let bodyParser = require("body-parser");
let express = require("express");
let morgan = require("morgan");
let http = require("http");
let cors = require("cors");
let exp = express();

exp.use(cors());

exp.use(morgan("common", {
    stream: { write: (message) => $logger.info(message.replace(/\[.*\]/gi, `[ ${$moment().format("YYYY-MM-DD HH:mm:ss")} ]`)) }
}));

exp.use(bodyParser.json({limit: "5mb"}));
exp.use(bodyParser.urlencoded({limit: "5mb", extended: true}));

exp.use(expressValidator());

exp.set("json spaces", 4);

$consign({ cwd: APP_PATH }).include("/router.js").into(exp);

module.exports = http.createServer(exp);
