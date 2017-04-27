"use strict";

/**
* @author Raviel Chausse Silveira
*/
module.exports = (socket) => {

    let client = $redis.createClient({ host: $env.REDIS_HOST, no_ready_check: true });

    socket.on("deslogar", ({ token }) => {

        client.del("laravel:" + token, (err, numRemoved) => {

            // TODO, tratar erro
        });

        client.quit();
    });

    socket.on("disconnect", () => {

        if (typeof socket.sessionControl !== "undefined") {

            clearInterval(socket.sessionControl);
        };
    });

    socket.on("log", (attributes) => {

        return socket.emit("log", attributes);
    });

    socket.on("joinRoom", (rooms) => {

        let message = "";
        let index = 0;

        if (typeof(rooms) === "string") {

            message = `Bem vindo ao grupo ${rooms}.`;
            socket.join(rooms);
        } else {

            message = "Bem vindo aos grupos";

            for (index in rooms) {

                message += ` ${rooms[index]},`;
                socket.join(rooms[index]);
            }

            message += "!";
        }

        return socket.emit("message", message);
    });

    socket.on("getRooms", () => {

        return socket.emit("setRooms", client.rooms);
    });

    socket.on("message", (message) => {

        return socket.emit("message", message);
    });

    socket.on("emitToRooms", ({ rooms, message }) => {

        let index = 0;

        if (typeof(rooms) === "string") {

            $io.to(rooms).emit(rooms, message);
        } else {

            for (index in rooms) {

                $io.to(rooms[index]).emit(rooms[index], message);
            }
        }

        return;
    });
};
