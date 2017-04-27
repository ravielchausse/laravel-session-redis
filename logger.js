"use strict";

let winston = require("winston");
let fs = require("fs");

if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}

module.exports = new winston.Logger({
	transports: [
		new winston.transports.File({
			level: "info",
			filename: "logs/session.log",
			maxsize: 10000,
			maxFiles: 10,
            timestamp: () => { return $moment().format("YYYY-MM-DD HH:mm:ss") }
		})
	]
});
