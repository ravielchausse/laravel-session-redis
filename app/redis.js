'use strict';

let OneUnserialize = require('php-serialization').unserialize;
let TwoUnserialize = require('php-unserialize').unserialize;

let redisControl = function (socket, token) {

    let client = $redis.createClient({ host: $env.REDIS_HOST, no_ready_check: true });

    client.get('laravel:' + token, (err, value) => {

        if (value === null || typeof value === 'undefined') {

            socket.emit(token, { sessao_nao_encontrada: true });

            clearInterval(this);
        }
        else {

            let session = TwoUnserialize(OneUnserialize(value));
            let now = parseInt(new Date().getTime() / 1000);
            let maxIdleTime = $env.MAX_IDLE_TIME_SESSION || 15;
            let timeout = maxIdleTime * 60;

            console.log({ tempo_sem_atividade: (now - session.lastUsed) });

            if ((now - session.lastUsed) > timeout) {

                socket.emit(token, { sessao_expirada: true });

                clearInterval(this);

                client.del('laravel:' + token, (err, numRemoved) => { return; });
            }
        }
    });
};

/**
* @author Raviel Chausse Silveira
*/
module.exports = (socket) => {

    let client = $redis.createClient({ host: $env.REDIS_HOST, no_ready_check: true });

    client.subscribe('channel');
    client.on("message", (channel, data) => {

        socket.emit(channel, data);
    });

    socket.on('sessao', ({ token }) => {

        socket.sessionControl = setInterval(redisControl, 1000, socket, token);
    });
};
