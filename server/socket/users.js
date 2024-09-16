const handleUserConnection = (io, socket, onlineUsers) => {
  socket.on("addNewUser", (userId) => {
    const existingUserIndex = onlineUsers.findIndex(
      (user) => user.userId === userId
    );

    if (existingUserIndex !== -1) {
      onlineUsers[existingUserIndex].socketId = socket.id;
    } else {
      onlineUsers.push({ userId, socketId: socket.id });
    }

    console.log("onlineUsers", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
};

const handleUserDisconnection = (io, socket, onlineUsers) => {
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
};

module.exports = {
  handleUserConnection,
  handleUserDisconnection,
};
