const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    if (userId !== null) {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    }
  });

  //send and get message
  // socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
  //   const user = getUser(receiverId);
  //   io.to(user.socketId).emit("getMessage", {
  //     senderId,
  //     text,
  //     conversationId,
  //   });
  // });
  socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        conversationId,
      });
    }
  });

  //send and get notifications

  socket.on(
    "sendNotification",
    ({ senderId, receiverId, type, notificationId }) => {
      console.log("reciever in socket", receiverId);
      const receiver = getUser(receiverId);
      // console.log("notification reciever in socket", receiver);
      if (receiver) {
        io.to(receiver.socketId).emit("getNotification", {
          senderId,
          type,
          notificationId,
        });
      }
    }
  );

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
