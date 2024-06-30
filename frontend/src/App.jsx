import { useState } from "react";
import Events from "./pages/Events";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Auth from "./pages/Auth";
import Bookings from "./pages/Bookings";
import { useAuthContext } from "./context/auth-context";

function App() {
  const { token } = useAuthContext();
  return (
    <BrowserRouter>
      <div className="h-screen w-screen">
        <div className="w-full h-full flex flex-col">
          <NavBar />
          <div className="h-full flex justify-center items-center">
            <Routes>
              <Route path="/" element={null} />
              <Route path="/auth" element={!token && <Auth />} />
              <Route path="/bookings" element={token && <Bookings />} />
              <Route path="/events" element={<Events />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
