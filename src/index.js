"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify = require('fastify')({ logger: true });
const utils_1 = require("./utils");
const server = fastify;
fastify.register(require('@fastify/multipart'));
server.post('/analyse', async (req, reply) => {
    let result;
    const data = await req.file();
    try {
        const textLines = await (0, utils_1.anaysisImage)(data);
        result = await (0, utils_1.anaysisTextLines)(textLines);
    }
    catch (error) {
        if (error instanceof Error) {
            reply.status(500).send({ error: error.message });
        }
        else {
            console.log("Unexpected error", error);
        }
    }
    reply.status(200).send({ result: result });
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
