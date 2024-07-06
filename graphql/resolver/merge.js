import User from "../../models/user.js";
import Event from "../../models/event.js";
import { dateToString } from "../helper/date.js";
import DataLoader from "dataloader";

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});
const userLoader = new DataLoader((userIds) => {
  return User.find({ id: { $in: userIds } });
});
const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      password: null,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};
const events = async (eventsId) => {
  try {
    const events = await Event.find({ _id: { $in: eventsId } });
    const transformedEvents = events.map((event) => {
      return transformEvent(event);
    });
    console.log(transformedEvents);
    return transformedEvents;
  } catch (error) {
    throw error;
  }
};
const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId);
    return event;
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
