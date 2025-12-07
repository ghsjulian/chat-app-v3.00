import { create } from "zustand";

const useApp = create((set, get) => ({
    isMenuActive : false,
    path : "",
    toggleMenu : ()=>{
        set({isMenuActive : !get().isMenuActive})
    },
    setPath : (p)=>{
        set({path : p})
    }
}))

export default useApp