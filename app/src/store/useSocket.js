import { create } from "zustand";
import { io } from "socket.io-client";
import useAuth from "./useAuth";

const SOCKET_SERVER = "http://localhost:3000";

const useSocket = create((set, get) => ({
  socket: null,
  connected: false,

  createSocket: () => {
    if (get().socket) return;

    const user = useAuth.getState().user;
    if (!user) return;

    const socket = io(SOCKET_SERVER, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token: user },
      autoConnect: false,
    });

    /* =======================
       CORE
    ======================= */
    socket.on("connect", () => {
      set({ connected: true });
    });

    socket.on("disconnect", () => {
      set({ connected: false });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    /* =======================
       RECEIVE MESSAGE
    ======================= */
    socket.on("message:receive", (msg) => {
      window.dispatchEvent(new CustomEvent("chat:message", { detail: msg }));

      socket.emit("message:read", { from: msg.from });
    });

    /* =======================
       DELIVERY
    ======================= */
    socket.on("message:delivered", (data) => {
      window.dispatchEvent(new CustomEvent("chat:delivered", { detail: data }));
    });

    /* =======================
       READ
    ======================= */
    socket.on("message:read", (data) => {
      window.dispatchEvent(new CustomEvent("chat:read", { detail: data }));
    });

    /* =======================
       TYPING
    ======================= */
    socket.on("typing:start", (userId) => {
      window.dispatchEvent(
        new CustomEvent("chat:typing:start", { detail: userId })
      );
    });

    socket.on("typing:stop", (userId) => {
      window.dispatchEvent(
        new CustomEvent("chat:typing:stop", { detail: userId })
      );
    });

    socket.connect();
    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (!socket) return;

    socket.removeAllListeners();
    socket.disconnect();
    set({ socket: null, connected: false });
  },

  sendMessage: ({ to, message, tempId }) => {
    const socket = get().socket;
    if (!socket || !get().connected) return;

    socket.emit("message:send", {
      to,
      message,
      tempId,
    });
  },

  startTyping: (to) => {
    get().socket?.emit("typing:start", to);
  },

  stopTyping: (to) => {
    get().socket?.emit("typing:stop", to);
  },
}));

export default useSocket;
