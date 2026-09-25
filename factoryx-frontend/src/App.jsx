import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Machines from "./pages/Machines";
import Production from "./pages/Production";
import Maintenance from "./pages/Maintenance";
import Inventory from "./pages/Inventory";
import Quality from "./pages/Quality";
import Incidents from "./pages/Incidents";
import AIAssistant from "./pages/AIAssistant";
import Documents from "./pages/Documents";
import Reports from "./pages/Reports";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/machines"
                    element={<Machines />}
                />

                <Route
                    path="/production"
                    element={<Production />}
                />

                <Route
                    path="/maintenance"
                    element={<Maintenance />}
                />

                <Route path="/inventory" element={<Inventory />} />

                <Route
                    path="/quality"
                    element={<Quality />}
                />

                <Route path="/incidents" element={<Incidents />} />


                <Route path="/ai-assistant" element={<AIAssistant />} />

                <Route path="/documents" element={<Documents />} />

                <Route path="/reports" element={<Reports />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;