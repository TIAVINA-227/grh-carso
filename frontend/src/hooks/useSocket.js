// //frontend/src/hooks/useSocket.js
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// // ✅ Configuration Socket.io avec reconnexion automatique
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
//     // Écouter la connexion
//     socket.on("connect", () => {
//       console.log("✅ Socket.io connecté:", socket.id);
//       setIsConnected(true);
      
//       // Envoyer l'ID utilisateur une fois connecté
//       if (userId) {
//         socket.emit("user-online", userId);
//       }
//     });

//     // Écouter la déconnexion
//     socket.on("disconnect", () => {
//       console.log("❌ Socket.io déconnecté");
//       setIsConnected(false);
//     });

//     // Écouter les erreurs de connexion
//     socket.on("connect_error", (error) => {
//       console.error("❌ Erreur de connexion Socket.io:", error.message);
//       setIsConnected(false);
//     });

//     // Écouter les utilisateurs en ligne
//     socket.on("online-users", (users) => {
//       console.log("👥 Utilisateurs en ligne:", users);
//       setOnlineUsers(users);
//     });

//     // Nettoyage : enlever les écouteurs mais garder la connexion
//     return () => {
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("connect_error");
//       socket.off("online-users");
//     };
//   }, [userId]);

//   // useEffect(() => {
//   //   if (userId && socket.connected) {
//   //     socket.emit("user-online", userId);
//   //   }
//   // }, [userId]);

//   // Fonction pour vérifier si un utilisateur est en ligne
//   const isUserOnline = (checkUserId) => {
//     return onlineUsers.includes(checkUserId);
//   };

//   return { 
//     onlineUsers, 
//     isConnected, 
//     isUserOnline,
//     socket 
//   };
// }

// frontend/src/hooks/useSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

export function useSocket(userId) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const onConnect = () => {
      console.log("✅ Socket.io connecté:", socket.id);
      setIsConnected(true);

      if (userId) {
        socket.emit("user-online", userId);
      }
    };

    const onDisconnect = () => {
      console.log("❌ Socket.io déconnecté");
      setIsConnected(false);
    };

    const onError = (error) => {
      console.error("❌ Erreur de connexion Socket.io:", error.message);
      setIsConnected(false);
    };

    const onOnlineUsers = (users) => {
      console.log("👥 Utilisateurs en ligne:", users);
      setOnlineUsers(users);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.on("online-users", onOnlineUsers);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.off("online-users", onOnlineUsers);
    };
  }, [userId]);

  // Réémettre l'ID si l'utilisateur change
  useEffect(() => {
    if (socket.connected && userId) {
      socket.emit("user-online", userId);
    }
  }, [userId]);

  const isUserOnline = (checkUserId) => onlineUsers.includes(checkUserId);

  return {
    onlineUsers,
    isConnected,
    isUserOnline,
    socket,
  };
}
