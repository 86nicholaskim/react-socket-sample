const { PrivateRoom, PrivateMsg } = require('./schema/Private');

const privateMsg = (io) => {};

async function getRoomNumber(fromId, toId) {}
async function findOrCreateRoomDocument(room) {}
async function createMsgDocument(roomNumber, res) {}

module.exports.privateMsginit = privateMsg;
