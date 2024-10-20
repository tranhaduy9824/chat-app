const handleChangeNickname = (io, socket, onlineUsers) => {
  socket.on("changeNickname", (data) => {
    const { chatId, userId, newNickname, members } = data;

    if (Array.isArray(members)) {
      members.forEach((memberId) => {
        const user = onlineUsers.find((user) => user.userId === memberId);
        if (user) {
          io.to(user.socketId).emit("nicknameChanged", {
            chatId,
            userId,
            newNickname,
          });
        }
      });
    } else {
      console.error("Members list is not defined or not an array.");
    }
  });
};

module.exports = { handleChangeNickname };
