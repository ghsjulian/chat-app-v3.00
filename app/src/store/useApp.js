import { create } from "zustand";
import axios from "../libs/axios";

const useApp = create((set, get) => ({
  isMenuActive: false,
  isSaving: false,
  chatSettings: JSON.parse(localStorage.getItem("chat-settings")) || null,
  path: "",
  toggleMenu: () => {
    set({ isMenuActive: !get().isMenuActive });
  },
  setPath: (p) => {
    set({ path: p });
  },
  saveSettings: async (data, showMessage, navigate) => {
    try {
      set({ isSaving: true });
      const info = {
        avatar: data.avatar,
        name: data.name,
        email: data.email,
        isChangingPassword: data.isChangingPassword,
        oldPassword: data.oldPassword || "",
        newPassword: data.newPassword || "",
      };
      const response = await axios.put("/auth/save-settings", info);
      if (response?.data?.success) {
        let appInfo = {
          isSound: data.isSound,
          appTheme: data.appTheme,
          chatTheme: data.chatTheme,
        };
        set({ chatSettings: appInfo });
        localStorage.setItem(
          "chat-settings",
          JSON.stringify({
            isSound: data.isSound,
            appTheme: data.appTheme,
            chatTheme: data.chatTheme,
          })
        );
        document.body.classList.add(data.appTheme);
        showMessage(response.data.message, true);
      }
    } catch (error) {
      showMessage(error.response.data.message, false);
    } finally {
      set({ isSaving: false });
    }
  },
}));

export default useApp;
