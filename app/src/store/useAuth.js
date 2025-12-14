import { create } from "zustand";
import axios from "../libs/axios";

const useAuth = create((set, get) => ({
    user: JSON.parse(localStorage.getItem("chat-user")) || null,
    isLoggingIn: false,
    isSiginingUp: false,
    isVerifying: false,
    isResending: false,

    signupNow: async (data, showMessage, navigate) => {
        try {
            set({ isSiginingUp: true });
            const response = await axios.post("/auth/signup", data);
            console.log(response.data);
            if (response?.data?.success) {
                showMessage(response.data.message, true);
                setTimeout(() => {
                    set({ user: response.data.user });
                    localStorage.setItem(
                        "chat-user",
                        JSON.stringify(response.data.user)
                    );
                    navigate("/verify-otp");
                }, 2500);
            } else {
                showMessage(response.data.message, false);
            }
        } catch (error) {
            showMessage(error.response.data.message, false);
        } finally {
            set({ isSiginingUp: false });
        }
    },
    loginNow: async (data, showMessage, navigate) => {
        try {
            set({ isLoggingIn: true });
            const response = await axios.post("/auth/login", data);
            console.log(response.data);
            if (response?.data?.success) {
                showMessage(response.data.message, true);
                setTimeout(() => {
                    set({ user: response.data.user });
                    localStorage.setItem(
                        "chat-user",
                        JSON.stringify(response.data.user)
                    );
                    navigate("/");
                }, 2500);
            } else {
                showMessage(response.data.message, false);
            }
        } catch (error) {
            showMessage(error.response.data.message, false);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    verifyOtp: async (otp, showMessage, navigate) => {
        try {
            if (get().user === null || get().user?.isVerified) return;

            set({ isVerifying: true });
            const response = await axios.post("/auth/verify-otp", {
                otp,
                email: get().user.email
            });
            console.log(response.data);
            if (response?.data?.success) {
                showMessage(response.data.message, true);
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                showMessage(response.data.message, false);
            }
        } catch (error) {
            showMessage(error.response.data.message, false);
        } finally {
            set({ isVerifying: false });
        }
    },
    resendOtp: async (showMessage) => {
        try {
            if (get().user === null || get().user?.isVerified) return;

            set({ isResending: true });
            const response = await axios.post("/auth/resend-otp", {
                email: get().user.email
            });
            console.log(response.data);
            if (response?.data?.success) {
                showMessage(response.data.message, true);
            } else {
                showMessage(response.data.message, false);
            }
        } catch (error) {
            showMessage(error.response.data.message, false);
        } finally {
            set({ isResending: false });
        }
    },
    userLogout: async (navigate) => {
        try {
            if (get().user === null) return;
            const response = await axios.post("/auth/logout");
            if (response?.data?.success) {
                navigate("/login")
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}));

export default useAuth;
