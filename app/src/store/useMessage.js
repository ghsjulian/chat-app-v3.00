import { create } from "zustand";

const useMessage = create((set, get) => ({
    selected_chat_id : "",
    setSelectedChat : (id)=>{
        set({selected_chat_id : id})
    },
    sendMessage : (data)=>{
        console.log(data)
    }
}))

export default useMessage