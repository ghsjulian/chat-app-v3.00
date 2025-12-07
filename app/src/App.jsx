import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Layouts from "./layouts/Layouts"
import Home from "./pages/Home"
import Chats from "./pages/Chats"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layouts />}>
                  <Route index element={<Home/>}/>
                  <Route path="/chats" element={<Chats/>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
