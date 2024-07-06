import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/auth-context";

const NavBar = () => {
  const location = useLocation();
  const { token, logout } = useAuthContext();
  const [active, setActive] = useState();
  useEffect(() => {
    setActive(location.pathname.slice(1));
  }, [location]);
  return (
    <div className="w-full bg-emerald-100 flex justify-between items-center py-4">
      <h1 className="px-10 text-2xl text-black font-bold">EasyEvent</h1>
      <div className="flex gap-20 px-20 justify-center items-center">
        {!token && (
          <Link
            to="/auth"
            className={`${
              active === "auth"
                ? "bg-white px-4 py-2 rounded-lg text-emerald-600"
                : "px-4 py-2 rounded-lg"
            }`}
          >
            Authentication
          </Link>
        )}
        <Link
          to="/events"
          className={`${
            active === "events"
              ? "bg-white px-4 py-2 rounded-lg text-emerald-600"
              : "px-4 py-2 rounded-lg"
          }`}
        >
          Events
        </Link>
        <Link
          to="/bookings"
          className={`${
            active === "bookings"
              ? "bg-white px-4 py-2 rounded-lg text-emerald-600"
              : "px-4 py-2 rounded-lg"
          }`}
        >
          Bookings
        </Link>
        {token && (
          <Link
            to="/auth"
            className="px-4 py-2 rounded-lg"
            onClick={() => logout()}
          >
            logout
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
