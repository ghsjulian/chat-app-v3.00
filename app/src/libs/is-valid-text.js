const words = ["<",">","{","}","/"]
const isValid = (text)=>{
   if(!text || text.trim() === "") return false
   if(words.includes(text)) return false 
   return true
}

export default isValid