### ChatApp 3.00 (Latest Version)
##### Developer & Designer : <a href="https://ghsresume.netlify.app" target="_blank">Ghs Julian</a>
##### Developer Facebook : <a href="https://fb.com/ghs.julian.85" target="_blank">https://fb.com/ghs.julian.85</a>
##### Developer Email : <a href="mailto://ghsjulian@outlook.com" target="_blank">ghsjulian@outlook.com</a>
##### Contact & Whatsapp : <a href="tel://+8801302661227" target="_blank">+8801302661227</a>
##### Project Starting Date : 11 December 2025
##### Project Ending Date : Still Working...
---

### Project Overview :

**In this project i have used this latest and modern technologies**

- **HTML5**
- **CSS3**
- **Vanila Javascript**
- **React JS**
- **node JS**
- **Express JS**
- **MongoDB**
- **JWT (JSON Web Token)**
- **Bcrypt JS (For Hashing Passwords)**
- **Cloudinary API**
- **REST API Design**
- **Node Mailer**
- **GIT & Github**
- **Termux & VS Code**
- **Netlify & Vercel**



---

### About this project : 
**This is latest updated version of my chat app where i added some new features and functionalities. It has more advanced functionalities that you can run it in your vps server easily.  It has also production ready version so that any one can deploy it's in his vps server.Supposed you have your own vps server then you can host i t there also. Here i have added all the steps that you can clone it anywhere weather you have vps or local machine.**

---

### How to clone ? 

**Here is all the steps that you can clone it on your vps server and install it easily. So let's follow that step and complete the installation process.**

---

```bash
git clone https://github.com/ghsjulian/chat-app-v3.00.git
cd chat-app-v3.00
cd app           # Go to app folder
npm install      # Install all dependensis
npm run app      # Run the app inside local machine

# Now let's start our backend server
cd server        # Go to server folder
nano .env        # Open .env file inside editor
# MONGO_URI      # ADD YOUR MONGO CLUSTER URI
npm install      # Install all dependnsis 
npm run server   # Start the backend server

```

---

### How to use?

**After finishing the installation visit <a href="http://localhost:5000" target="_blank">http://localhost:5000</a> You will see a beautiful login page. It is because you've just installed this app. Now you don't have any account. So no further late let's create an account and then we will able to use this in our local machine.**

**Okay! It's fine since you have created account now you can explore users and chat with them. But here you can't get moore users to chat that's why we need to host this application inside a live vps server.**

---

### How to host on vps server?

```bash
sudo apt update && apt upgrade -y
sudo apt install git curl nano
sudo apt install nginx 
sudo apt install ufw
sudo apt install nodejs
#-----------------------------------------------------------#
cd /var/www
git clone https://github.com/ghsjulian/chat-app-v3.00.git
cd chat-app-v3.00
cd app         
npm install   
npm run build    
cd ..
cd server       
nano .env  
npm install     
npm install pm2 -g
pm2 start server.js --name "server"
pm2 save 
pm2 logs server

```