import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Layouts from "./layouts/Layouts"
import Home from "./pages/Home"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layouts />}>
                  <Route index element={<Home/>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
