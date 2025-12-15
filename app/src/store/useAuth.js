import { create } from "zustand";
import axios from "../libs/axios";

const useAuth = create((set, get) => ({
    user: JSON.parse(localStorage.getItem("chat-user")) || null,
    isLoggingIn: false,
    isSiginingUp: false,
    isVerifying: false,
    isResending: false,
    isReseting: false,
    isLogout: false,

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
                    localStorage.setItem(
                    "chat-settings",
                    JSON.stringify({
                        isSound: true,
                        appTheme: "white",
                        chatTheme: "white"
                    })
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
                    localStorage.setItem(
                    "chat-settings",
                    JSON.stringify({
                        isSound: true,
                        appTheme: "white",
                        chatTheme: "white"
                    }))
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
    verifyOtp: async (otp, showMessage) => {
        try {
            if (get().user === null || get().user?.isVerified){
            showMessage("Please login!")
            return 
            }

            set({ isVerifying: true });
            const response = await axios.post("/auth/verify-otp", {
                otp            });
            console.log(response.data);
            if (response?.data?.success) {
                showMessage(response.data.message, true);
                return true
            }
        } catch (error) {
            showMessage(error.response.data.message, false);
            return false
        } finally {
            set({ isVerifying: false });
        }
    },
    resendOtp: async (showMessage) => {
        try {
            if (get().user === null || get().user?.isVerified){
                showMessage("Please login!")
            return 
            }
            
            set({ isResending: true });
            const response = await axios.post("/auth/resend-otp");
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
            
            set({isLogout:true})
            const response = await axios.post("/auth/logout");
            if (response?.data?.success) {
                set({ user: null });
                    localStorage.removeItem("chat-user");
                    localStorage.removeItem("chat-settings")
                navigate("/login")
            }
        } catch (error) {
            console.log(error.message)
        }finally{
            set({isLogout:false})
        }
    },
    resetPassword: async (data,showMessage,navigate) => {
        try {
            if (get().user === null) {
                showMessage("Please login!")
            return 
            }
            set({isReseting:true})
            const response = await axios.post("/auth/reset-password",data);
            if (response?.data?.success) {
                showMessage(response?.data?.message,true)
               setTimeout(()=>{
                navigate("/")
               },1500)
            }
        } catch (error) {
            showMessage(error.response.data.message, false);
        }finally{
            set({isReseting:false})
        }
    }
}));

export default useAuth;
