import { create } from "zustand";

const useApp = create((set, get) => ({
    isMenuActive : false,
    toggleMenu : ()=>{
        set({isMenuActive : !get().isMenuActive})
    }
}))

export default useApp