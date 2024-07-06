const { GroupUserList, GroupRoom, GroupMsg } = require('./schema/Group');

const groupMsg = (io) => {
  io.of('/group').use(async (socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.log('err');
      return next(new Error('invalid userId'));
    }
    socket.userId = userId;
    await createGroupUser(userId, socket.id);
    next();
  });

  io.of('/group').use('connection', async (socket) => {
    const groupRoom = await GroupRoom.find({
      loginUserId: socket.userId,
    }).exec();
    socket.emit('group-list', groupRoom);

    socket.on('msgInit', async (res) => {
      const { targetId } = res;
      let roomName = null;
      roomName = targetId.join(',');
      const groupMsg = await GroupMsg.find({ roomNumber: roomName }).exec();

      io.of('/group')
        .to(roomName)
        .emit('group-msg-init', {
          msg: groupMsg || {},
        });
    });

    socket.on('reqGroupJoinRoom', async (res) => {
      const { socketId } = res;
      const groupUser = await GroupUserList.find()
        .where('userId')
        .in(socketId.split(','));
      groupUser.forEach((v) => {
        io.of('/group').to(v.socketId).emit('group-chat-req', {
          roomNumber: socketId,
          socketId: v.socketId,
          userId: socket.userId,
        });
      });
    });

    socket.on('groupMsg', async (res) => {
      const { msg, toUserSocketId, toUserId, formUserId, time } = res;
      socket.broadcast.in(toUserSocketId).emit('group-msg', {
        msg,
        toUserId,
        fromUserId,
        toUserSocketId,
        time,
      });
      await createMsgDocument(toUserSocketId, res);
    });

    socket.on('joinGroupRoom', async (res) => {
      const { roomNumber } = res;
      socket.join(roomNumber);
    });

    socket.on('resGroupJoinRoom', async (res) => {
      const { roomNUmber, socketId } = res;
      socket.join(roomNumber);
      await createGroupRoom(socket.userId, roomNumber, roomNumber);

      const groupRoom = await GroupRoom.find({
        loginUserId: socket.userId,
      }).exec();
      io.of('/group').to(socketId).emit('group-list', groupRoom);
    });
  });
};

async function createGroupRoom(loginUserId, userId, socketId) {
  if (loginUserId == null) return;
  return await GroupRoom.create({
    loginUserId,
    status: true,
    userId,
    socketId,
    type: 'group',
  });
}
async function createGroupUser(userId, socketId) {
  if (userId == null) return;
  const document = await GroupUserList.findOneAndUpdate(
    { userId },
    { socketId }
  );
  if (document) return document;
  return await GroupUserList.create({
    status: true,
    userId,
    socketId,
  });
}
async function createMsgDocument(roomNumber, res) {
  if (roomNumber == null) return;

  return await GroupMsg.create({
    roomNumber,
    msg: res.msg,
    toUserId: res.toUserId,
    fromUserId: res.fromUserId,
    time: res.time,
  });
}

module.exports.groupMsginit = groupMsg;
