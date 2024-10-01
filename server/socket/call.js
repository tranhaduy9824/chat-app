const messageController = require("../controllers/messageController");
const User = require("../models/userModel");

const activeCalls = new Set();

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

        const isAnyMemberInCall = members.some(
          (member) =>
            activeCalls.has(member) && !members.every((m) => activeCalls.has(m))
        );

        console.log("activeCalls", activeCalls);

        if (isAnyMemberInCall) {
          socket.emit("error", {
            message:
              "Cannot start call. One or more members are already in a call.",
          });
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

        members.forEach((member) => activeCalls.add(member));
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

      const isAnyMemberInCall = members.some(
        (member) =>
          activeCalls.has(member) && !members.every((m) => activeCalls.has(m))
      );

      console.log("activeCalls", activeCalls);

      if (isAnyMemberInCall) {
        socket.emit("error", {
          message:
            "Cannot start call. One or more members are already in a call.",
        });
        return;
      }

      console.log("Ending call");

      members.forEach((member) => {
        const recipient = onlineUsers.find((user) => user.userId === member);
        if (recipient) {
          io.to(recipient.socketId).emit("callEnded");
        }
        activeCalls.delete(member);
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
        activeCalls.delete(member);
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
  handleVideoCall,
};
