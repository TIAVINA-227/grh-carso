// // frontend/src/hooks/useSocket.js
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   withCredentials: true,
//   transports: ["websocket", "polling"],
//   reconnection: true,
//   reconnectionDelay: 1000,
//   reconnectionAttempts: 5,
// });

// export function useSocket(userId) {
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     const onConnect = () => {
//       console.log("✅ Socket.io connecté:", socket.id);
//       setIsConnected(true);

//       if (userId) {
//         socket.emit("user-online", userId);
//       }
//     };

//     const onDisconnect = () => {
//       console.log("❌ Socket.io déconnecté");
//       setIsConnected(false);
//     };

//     const onError = (error) => {
//       console.error("❌ Erreur de connexion Socket.io:", error.message);
//       setIsConnected(false);
//     };

//     const onOnlineUsers = (users) => {
//       console.log("👥 Utilisateurs en ligne:", users);
//       setOnlineUsers(users);
//     };

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);
//     socket.on("connect_error", onError);
//     socket.on("online-users", onOnlineUsers);

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("disconnect", onDisconnect);
//       socket.off("connect_error", onError);
//       socket.off("online-users", onOnlineUsers);
//     };
//   }, [userId]);

//   // Réémettre l'ID si l'utilisateur change
//   useEffect(() => {
//     if (socket.connected && userId) {
//       socket.emit("user-online", String(userId));
//     }
//   }, [userId]);

//   const isUserOnline = (checkUserId) => onlineUsers.includes(checkUserId);

//   return {
//     onlineUsers,
//     isConnected,
//     isUserOnline,
//     socket,
//   };
// }


// frontend/src/hooks/useSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket = null;
let onlineUsersGlobal = [];
let listeners = [];

// Initialiser le socket une seule fois
const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ Socket.io connecté:", socket.id);
      notifyListeners();
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket.io déconnecté");
      notifyListeners();
    });

    socket.on("online-users", (users) => {
      console.log("👥 Utilisateurs en ligne:", users);
      onlineUsersGlobal = users.map(String); // ✅ Force la conversion en string
      notifyListeners();
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Erreur Socket.io:", error.message);
      notifyListeners();
    });
  }
  return socket;
};

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useSocket(userId) {
  const [onlineUsers, setOnlineUsers] = useState(onlineUsersGlobal);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const updateState = () => {
      setOnlineUsers([...onlineUsersGlobal]);
      setIsConnected(socket.connected);
    };

    listeners.push(updateState);
    updateState();

    return () => {
      listeners = listeners.filter(l => l !== updateState);
    };
  }, []);

  // Émettre l'ID utilisateur dès que disponible
  useEffect(() => {
    if (userId) {
      const socket = getSocket();
      const safeUserId = String(userId);
      
      if (socket.connected) {
        console.log("📤 Émission user-online:", safeUserId);
        socket.emit("user-online", safeUserId);
      } else {
        socket.once("connect", () => {
          console.log("📤 Émission user-online (après reconnexion):", safeUserId);
          socket.emit("user-online", safeUserId);
        });
      }
    }
  }, [userId]);

  const isUserOnline = (checkUserId) => onlineUsersGlobal.includes(String(checkUserId));

  return {
    onlineUsers,
    isConnected,
    isUserOnline,
    socket: getSocket(),
  };
}