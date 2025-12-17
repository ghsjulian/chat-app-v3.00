import { create } from "zustand";
import axios from "../libs/axios";

const useChat = create((set, get) => ({
  selectedChat: "",

  setSelectedChat: (id) => {
    set({ selectedChat: id });
  },
}));

export default useChat;
