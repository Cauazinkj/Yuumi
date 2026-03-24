import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateRecipe from './pages/CreateRecipe';
import RecipesList from './pages/RecipesList';
import RecipeDetail from './pages/RecipeDetail';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ToastContainer position="top-right" autoClose={4000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<RecipesList />} />
        <Route path="/recipes/new" element={<CreateRecipe />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;