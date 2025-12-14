import { create } from "zustand";
import axios from "../libs/axios"


const useApp = create((set, get) => ({
    isMenuActive : false,
    isSaving : false,
    chatSettings : {},
    path : "",
    toggleMenu : ()=>{
        set({isMenuActive : !get().isMenuActive})
    },
    setPath : (p)=>{
        set({path : p})
    },
    saveSettings : async(data,navigate)=>{
        try {
            set({isSaving:true})
            console.log(data)
        } catch (error) {
            console.log(error.message)
        }finally{
            set({isSaving:false})
        }
    }
    
}))

export default useApp