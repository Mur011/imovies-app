import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <div className="bg-light min-vh-100">
        <NavigationBar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/movie/:id" element={<BookingPage user={user} />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;