/**
 * Created by Yuan on 2016/4/20.
 */
var redis = require('redis');
var client  = redis.createClient(6379, '127.0.0.1');

client.set("string key", "string val", redis.print);
client.hset("yy", "age", "25", redis.print);
client.hset(["yy", "sex", "nv"], redis.print);
client.hkeys("yy", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
        client.hget('yy',reply,redis.print)
    });
    client.quit();
});