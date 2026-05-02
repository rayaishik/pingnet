const Redis = require('ioredis');
const { REDIS_URL } = require('../config/env');

let publisher = null;
let subscriber = null;

const getPublisher = () => {
  if (!publisher) {
    publisher = new Redis(REDIS_URL);
    publisher.on('error', (err) => console.error('Redis Publisher error:', err.message));
  }
  return publisher;
};

const getSubscriber = () => {
  if (!subscriber) {
    subscriber = new Redis(REDIS_URL);
    subscriber.on('error', (err) => console.error('Redis Subscriber error:', err.message));
  }
  return subscriber;
};

const publish = async (channel, data) => {
  const pub = getPublisher();
  await pub.publish(channel, JSON.stringify(data));
};

const subscribe = (channel, callback) => {
  const sub = getSubscriber();
  sub.subscribe(channel);
  sub.on('message', (ch, message) => {
    if (ch === channel) {
      try {
        callback(JSON.parse(message));
      } catch {
        callback(message);
      }
    }
  });
};

module.exports = { getPublisher, getSubscriber, publish, subscribe };
