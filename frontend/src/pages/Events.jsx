import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { useAuthContext } from "../context/auth-context";
import { format } from "date-fns";
const Events = () => {
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState("");
  const { token, userId } = useAuthContext();
  const [events, setEvents] = useState([]);
  const [detailModal, setDetailModal] = useState("");
  useEffect(() => {
    const fetchEvents = async () => {
      const requestBody = {
        query: `
        query{events{_id title description price date creator{_id email}}}
        `,
      };
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const res = await response.json();
      setEvents(res.data.events);
    };
    fetchEvents();
  }, [token]);
  console.log(events);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenDetailModal = (eventId) => {
    setDetailModal(eventId);
  };
  const handleCloseDetailModal = () => {
    setDetailModal("");
  };
  const handleBook = async (eventId) => {
    const requestBody = {
      query: `
      mutation{bookEvent(eventId: "${eventId}"){ _id event{title _id} user{email _id} createdAt updatedAt}}
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
      if (response.ok) {
        const res = await response.json();
        alert(
          `successfully registered event "${res.data.bookEvent.event.title}"`
        );
        console.log(res.data);
      } else {
        if (response.status === 500) {
          const res = await response.json();
          alert(res.errors[0].message);
        }
      }
      handleCloseDetailModal();
    } catch (error) {
      throw error;
    }
  };

  const handleCreateEventSubmit = async (e) => {
    e.preventDefault();
    handleCloseModal();
    const requestBody = {
      query: `
      mutation{createEvent(eventInput: {title: "${title}", description: "${description}", price: ${parseFloat(
        price
      )}, date: "${date}"}){
      _id
      title
      description
      price
      date
      creator{
      _id
      email
      }
      }}
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
      console.log(res);
      setTitle("");
      setDescription("");
      setPrice(0);
      setDate("");
    } catch (error) {
      throw error;
    }
  };
  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <button
        onClick={handleOpenModal}
        className="px-6 py-3 bg-emerald-100 mb-8 rounded-lg"
      >
        Create Event
      </button>
      <Modal show={openModal} onClose={handleCloseModal}>
        <form onSubmit={handleCreateEventSubmit}>
          <div className="flex flex-col">
            <div className="flex flex-col mb-2">
              <label className="font-semibold text-xl text-emerald-400">
                Event Title
              </label>
              <input
                type="text"
                value={title}
                className="border px-2 py-1 text-lg"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-2">
              <label className="font-semibold text-xl text-emerald-400">
                Event Description
              </label>
              <textarea
                value={description}
                name=""
                cols="30"
                rows="5"
                className="border px-2 py-1 text-lg"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex flex-col mb-2">
              <label className="font-semibold text-xl text-emerald-400">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                className="border px-2 py-1 text-lg"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-2">
              <label className="font-semibold text-xl text-emerald-400">
                Date
              </label>
              <input
                type="date"
                value={date}
                className="border px-2 py-1 text-lg"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-100">
              Submit
            </button>
          </div>
        </form>
      </Modal>
      <div className="w-full flex flex-col items-center">
        <ul className="flex flex-col w-[70%]">
          {events.length > 0 &&
            events.map((event) => {
              return (
                <li
                  key={event._id}
                  className="mb-4 border border-emerald-300 min-h-16 pl-4 py-2 flex items-center justify-between"
                >
                  <div>
                    <p className="text-2xl font-bold text-emerald-300">
                      {event.title}
                    </p>
                    <p>{`Price : $${event.price}, Date : ${format(
                      new Date(event.date),
                      "MMMM do, yyyy"
                    )}`}</p>
                  </div>
                  <div>
                    {event.creator._id === userId ? (
                      <p className="pr-3">You are the owner of the event</p>
                    ) : (
                      <button
                        className="px-6 py-3 mr-3 bg-emerald-100"
                        onClick={() => handleOpenDetailModal(event._id)}
                      >
                        View Details
                      </button>
                    )}
                    <Modal
                      show={detailModal === event._id}
                      onClose={handleCloseDetailModal}
                    >
                      <div className="w-full py-3 px-1 bg-emerald-300 text-white mb-6 flex justify-center">
                        {event.title}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-col mb-6">
                          <p className="text-emerald-300 font-bold text-lg mb-2">
                            Description:{" "}
                          </p>
                          <p>{event.description}</p>
                        </div>
                        <div className=" flex gap-4">
                          <button
                            onClick={handleCloseDetailModal}
                            className="p-2 bg-emerald-300 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            className="p-2 bg-emerald-300 rounded-lg"
                            onClick={() => handleBook(event._id)}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </Modal>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Events;
