"use strict";

/**
* @author Raviel Chausse Silveira
*/
module.exports = (app) => {

    app.get("/principal", (req, res) => {

        return res.status(200).send("Bem vindo ao Node Service Engine!");
    });
}
