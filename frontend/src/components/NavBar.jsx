import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="w-full bg-emerald-100 flex justify-start items-center py-4">
      <h1 className="px-10 text-2xl text-black font-bold">EasyEvent</h1>
      <div className="flex gap-5">
        <Link to="/auth" className="hover:text-yellow-300">
          Authentication
        </Link>
        <Link to="/events" className="hover:text-yellow-300">
          Events
        </Link>
        <Link to="/bookings" className="hover:text-yellow-300">
          Bookings
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
