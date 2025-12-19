import { create } from "zustand";
import axios from "../libs/axios";

const useChat = create((set, get) => ({
    selectedChat: null,
    chatUsers: [],
    isLoadingUsers: false,
    isFetchingChats: false,
    isSendingMessage : false,

    getChat: async id => {
        set({ isFetchingChats: true });
        try {
            const response = await axios("/chats/get-chats?id=" + id);
            if (response?.data?.success) {
                set({ selectedChat: response?.data?.user });
                console.log(response?.data);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            set({ isFetchingChats: false });
        }
    },
    renderUsers: async (term, filter = {}) => {
        set({ isLoadingUsers: true });
        try {
            const response = await axios.get(
                `/chats/get-chat-users?term=${term}&limit=10`
            );
            if (response?.data?.success) {
                set({ chatUsers: response?.data?.users });
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            set({ isLoadingUsers: false });
        }
    },
    sendMessage : async(data)=>{
        try {
            set({isSendingMessage:true})
            const response = await axios.post("/chats/send-message?id="+get()?.selectedChat?._id,data,{headers: {
      "Content-Type": "multipart/form-data"
    }})
            if(response?.data?.success){
            console.log(response.data)
            }
        } catch (error) {
            console.log("error : ",error.message)
        }finally{
            set({isSendingMessage:false})
        }
    }
    
}));

export default useChat;
