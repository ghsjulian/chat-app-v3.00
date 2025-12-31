import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Layouts from "./layouts/Layouts";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import useAuth from "./store/useAuth";
import useSocket from "./store/useSocket";

const App = () => {
     const { user } = useAuth();
    const { createSocket, disconnectSocket, onlineUsers, connected } =
        useSocket();
    useEffect(() => {
        if (!user || connected) return;
        createSocket();
        return () => {
            disconnectSocket();
        };
    }, [user, createSocket, onlineUsers]);
    

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        user && user._id ? (
                            <Layouts />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
                <Route
                    path="/signup"
                    element={!user ? <Signup /> : <Navigate to="/" />}
                />
                <Route
                    path="/login"
                    element={!user ? <Login /> : <Navigate to="/" />}
                />
                <Route
                    path="/verify-otp"
                    element={
                        user?.isVerified ? <Navigate to="/" /> : <VerifyOtp />
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        !user ? <Navigate to="/login" /> : <ResetPassword />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
