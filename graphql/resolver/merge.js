import User from "../../models/user.js";
import Event from "../../models/event.js";
import { dateToString } from "../helper/date.js";

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      password: null,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};
const events = async (eventsId) => {
  try {
    const events = await Event.find({ _id: { $in: eventsId } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (error) {
    throw error;
  }
};
const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return { ...event._doc, creator: user.bind(this, event.creator) };
  } catch (error) {
    throw error;
  }
};
export const transformEvent = (event) => {
  return {
    ...event._doc,
    creator: user.bind(this, event.creator),
    date: dateToString(event._doc.date),
  };
};
export const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};
