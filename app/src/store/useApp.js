import { create } from "zustand";
import axios from "../libs/axios";
import useAuth from "./useAuth";

const useApp = create((set, get) => ({
     api : "http://localhost:3000/uploads",
    isMenuActive: false,
    isSaving: false,
    isMediaOpen: false,
    previewMediaObj : null,
    chatSettings: JSON.parse(localStorage.getItem("chat-settings")) || {
        isSound: true,
        appTheme: "white",
        chatTheme: "white"
    },
    path: "",

    toggleMenu: () => {
        set({ isMenuActive: !get().isMenuActive });
    },
    setPath: p => {
        set({ path: p });
    },
    saveSettings: async (data, showMessage, navigate) => {
        try {
            set({ isSaving: true });
            const info = {
                avatar: data.avatar,
                name: data.name,
                email: data.email,
                isAvatar: data.avatar ? true : false,
                isChangingPassword: data.isChangingPassword,
                oldPassword: data.oldPassword || "",
                newPassword: data.newPassword || ""
            };
            const response = await axios.put("/auth/save-settings", info);
            if (response?.data?.success) {
                showMessage(response.data.message, true);
                let appInfo = {
                    isSound: data.isSound,
                    appTheme: data.appTheme,
                    chatTheme: data.chatTheme
                };
                set({ chatSettings: appInfo });
                localStorage.setItem(
                    "chat-settings",
                    JSON.stringify({
                        isSound: data.isSound,
                        appTheme: data.appTheme,
                        chatTheme: data.chatTheme
                    })
                );
                localStorage.setItem(
                    "chat-user",
                    JSON.stringify(response.data.user)
                );
                useAuth.setState({ user: response.data.user });
                if (document.body.hasAttribute("class")) {
                    document.body.removeAttribute("class");
                }
                document.body.classList.add(data.appTheme);
                if (get().chatSettings.appTheme === "dark") {
                    document.body.style = "#000000";
                } else {
                    document.body.style = "#ffffffff";
                }
            }
        } catch (error) {
            showMessage(error.response.data.message, false);
        } finally {
            set({ isSaving: false });
        }
    },
    previewMedia: (data) => {
        set({ isMediaOpen: true,previewMediaObj:data });
        
    },
    closeMedia: () => {
        set({ isMediaOpen: false,previewMediaObj:null });
    }
}));

export default useApp;
