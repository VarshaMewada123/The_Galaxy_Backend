const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL.split(","),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("rider_location_update", (data) => {
      try {
        const { orderId, lat, lng } = data;

        const parsedLat = Number(lat);
        const parsedLng = Number(lng);

        // ✅ validate
        if (!orderId || isNaN(parsedLat) || isNaN(parsedLng)) {
          console.warn("Invalid location data:", data);
          return;
        }

        io.to(orderId).emit("location_update", {
          lat: parsedLat,
          lng: parsedLng,
        });

        io.to("admin_room").emit("admin_rider_location", {
          riderId: socket.id,
          lat: parsedLat,
          lng: parsedLng,
          orderId,
        });
      } catch (err) {
        console.error("Socket error:", err);
      }
    });

    socket.on("join_order_room", (orderId) => {
      if (orderId) {
        socket.join(orderId);
      }
    });

    socket.on("join_admin", () => {
      socket.join("admin_room");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};

const getIO = () => io;

module.exports = { initSocket, getIO };
