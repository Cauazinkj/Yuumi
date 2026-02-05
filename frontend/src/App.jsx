import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"

function App() {
    return (
        <BrowserRouter>
            <Router>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Router>
        </BrowserRouter>
    )
}

export default App