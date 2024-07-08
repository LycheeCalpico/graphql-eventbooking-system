import User from "../../models/user.js";
import Event from "../../models/event.js";
import { dateToString } from "../helper/date.js";
import DataLoader from "dataloader";

const eventLoader = new DataLoader(async (eventIds) => {
  const eventsMap = {};
  const events = await Event.find({ _id: { $in: eventIds } });
  for (const event of events) {
    eventsMap[event._id] = event;
  }
  return eventIds.map((eventId) => eventsMap[eventId]);
});
const userLoader = new DataLoader(async (userIds) => {
  const userMap = {};
  const users = await User.find({ _id: { $in: userIds } });
  for (const user of users) {
    userMap[user._id] = user;
  }
  return userIds.map((userId) => userMap[userId]);
});
const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
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
    return transformedEvents;
  } catch (error) {
    throw error;
  }
};
const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
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
