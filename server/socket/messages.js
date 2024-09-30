const messageController = require("../controllers/messageController");
const User = require("../models/userModel");

const handleSendMessage = (io, socket, onlineUsers) => {
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotifications", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });
};

const handleReactToMessage = (io, socket, onlineUsers) => {
  socket.on("reactToMessage", (reactionData) => {
    const { messageId, reaction, members } = reactionData;

    if (Array.isArray(members)) {
      members.forEach((userId) => {
        const user = onlineUsers.find((user) => user.userId === userId);
        if (user) {
          io.to(user.socketId).emit("messageReaction", {
            messageId,
            reaction,
            senderId: userId,
          });
        }
      });
    } else {
      console.error("Members list is not defined or not an array.");
    }
  });
};

const handleReplyToMessage = (io, socket, onlineUsers) => {
  socket.on("replyToMessage", (replyData) => {
    const { message, members } = replyData;

    if (Array.isArray(members)) {
      members.forEach((userId) => {
        const user = onlineUsers.find((user) => user.userId === userId);
        if (user) {
          io.to(user.socketId).emit("messageReply", message);
          io.to(user.socketId).emit("getNotifications", {
            senderId: message.senderId,
            isRead: false,
            date: new Date(),
          });
        }
      });
    } else {
      console.error("Members list is not defined or not an array.");
    }
  });
};

const handleDeleteMessage = (io, socket, onlineUsers) => {
  socket.on("deleteMessage", (deleteData) => {
    const { messageId, members } = deleteData;

    if (Array.isArray(members)) {
      members.forEach((userId) => {
        const user = onlineUsers.find((user) => user.userId === userId);
        if (user) {
          io.to(user.socketId).emit("messageDeleted", messageId);
        }
      });
    } else {
      console.error("Members list is not defined or not an array.");
    }
  });
};

const handleEditMessage = (io, socket, onlineUsers) => {
  socket.on("editMessage", (editData) => {
    const { messageId, text, members } = editData;

    if (Array.isArray(members)) {
      members.forEach((userId) => {
        const user = onlineUsers.find((user) => user.userId === userId);
        if (user) {
          io.to(user.socketId).emit("messageEdited", { messageId, text });
        }
      });
    } else {
      socket.emit("error", {
        message: "Members list is not defined or not an array.",
      });
    }
  });
};

const handleVideoCall = (io, socket, onlineUsers) => {
  socket.on(
    "startCall",
    async ({ chatId, userId, members, offer, canNotAccept = false }) => {
      try {
        if (!Array.isArray(members)) {
          socket.emit("error", {
            message: "Members list is not defined or not an array.",
          });
          return;
        }

        console.log("Starting call", userId, members);

        const callerOnline = onlineUsers.find((user) => user.userId === userId);
        if (!callerOnline) {
          return;
        }

        const caller = await User.findById(userId).select("fullname avatar");
        if (!caller) {
          return;
        }

        members.forEach((member) => {
          if (member !== userId) {
            const recipient = onlineUsers.find(
              (user) => user.userId === member
            );
            if (recipient) {
              io.to(recipient.socketId).emit("incomingCall", {
                chatId,
                callerId: userId,
                callerName: caller.fullname,
                callerAvatar: caller.avatar,
                offer,
                members,
                canNotAccept,
              });
            }
          }
        });
      } catch (error) {
        console.error("Error handling startCall:", error);
      }
    }
  );

  socket.on("answerCall", async ({ chatId, userId, members, answer }) => {
    try {
      if (!Array.isArray(members)) {
        socket.emit("error", {
          message: "Members list is not defined or not an array.",
        });
        return;
      }

      console.log("Answering call", userId, members);

      members.forEach((member) => {
        if (member !== userId) {
          const caller = onlineUsers.find((user) => user.userId === member);
          if (caller) {
            io.to(caller.socketId).emit("callAnswered", { answer });
          }
        }
      });
    } catch (error) {
      console.error("Error handling answerCall:", error);
    }
  });

  socket.on("iceCandidate", ({ candidate, chatId, members }) => {
    try {
      if (!Array.isArray(members)) {
        socket.emit("error", {
          message: "Members list is not defined or not an array.",
        });
        return;
      }

      members.forEach((member) => {
        const recipient = onlineUsers.find((user) => user.userId === member);
        if (recipient) {
          io.to(recipient.socketId).emit("iceCandidate", candidate);
        }
      });
    } catch (error) {
      console.error("Error handling iceCandidate:", error);
    }
  });

  socket.on("endCall", async ({ chatId, userId, members }) => {
    try {
      if (!Array.isArray(members)) {
        socket.emit("error", {
          message: "Members list is not defined or not an array.",
        });
        return;
      }

      console.log("Ending call");

      members.forEach((member) => {
        const recipient = onlineUsers.find((user) => user.userId === member);
        if (recipient) {
          io.to(recipient.socketId).emit("callEnded");
        }
      });
      await messageController.createCallMessage(
        chatId,
        userId,
        "Video",
        "ended"
      );
    } catch (error) {
      console.error("Error handling endCall:", error);
    }
  });

  socket.on("rejectCall", async ({ chatId, userId, members }) => {
    try {
      if (!Array.isArray(members)) {
        socket.emit("error", {
          message: "Members list is not defined or not an array.",
        });
        return;
      }

      members.forEach((member) => {
        if (member !== userId) {
          const recipient = onlineUsers.find((user) => user.userId === member);
          if (recipient) {
            io.to(recipient.socketId).emit("callRejected");
          }
        }
      });
      await messageController.createCallMessage(
        chatId,
        userId,
        "Video",
        "missed"
      );
    } catch (error) {
      console.error("Error handling rejectCall:", error);
    }
  });
};

module.exports = {
  handleSendMessage,
  handleReactToMessage,
  handleReplyToMessage,
  handleDeleteMessage,
  handleEditMessage,
  handleVideoCall,
};
