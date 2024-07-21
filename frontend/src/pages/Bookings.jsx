import React, { useState, useEffect } from "react";

import { useAuthContext } from "../context/auth-context";
import { tr } from "date-fns/locale";
import { useQuery, useMutation } from "@apollo/client";
import { CANCEL_BOOKING, GET_BOOKINGS } from "../queries";
const Bookings = () => {
  const { token, userId } = useAuthContext();
  const [bookings, setBookings] = useState([]);
  const requestBody = {
    query: `
    query{bookings{ _id
  event{ _id title}
  user{ _id email }
  createdAt
  updatedAt}}
    `,
  };
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const res = await response.json();
      console.log(res);
      setBookings(res.data.bookings);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);
  const handleCancelBooking = async (bookingId) => {
    const requestBody = {
      query: `
      mutation{cancelBooking(bookingId: "${bookingId}"){ _id
    event{ _id title}
    user{ _id email }
    createdAt
    updatedAt}}
      `,
    };
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const res = await response.json();
      fetchData();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return (
    <div className="w-full h-full mt-32">
      <ul className="w-full flex flex-col items-center">
        {bookings.length > 0 &&
          bookings.map((booking) => {
            if (booking.user._id === userId) {
              return (
                <li className="w-[80%] h-[80px] ml-10 border flex items-center justify-between">
                  <p className="pl-6">{booking.event.title}</p>
                  <button
                    className="mr-12 py-2 px-6 bg-emerald-300 rounded-lg hover:scale-110"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel
                  </button>
                </li>
              );
            }
          })}
      </ul>
    </div>
  );
};

export default Bookings;
