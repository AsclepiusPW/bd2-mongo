const { createClient } = require('redis');

const client = createClient({
    password: 'xzJNgF3uTH2UjdyDJvycQa5rVv5vYlKg',
    socket: {
        host: 'redis-10374.c308.sa-east-1-1.ec2.cloud.redislabs.com',
        port: 10374
    }
});

const connect = async () => {
    client.on("error", (err) => console.log("Erro no Redis Client", err));
    await client.connect();
  };

connect();

module.exports = client;