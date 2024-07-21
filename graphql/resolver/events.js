import { dateToString } from "../helper/date.js";
import Event from "../../models/event.js";
import User from "../../models/user.js";
import { transformEvent } from "./merge.js";

export default {
  Query: {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map((event) => {
          return transformEvent(event);
        });
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createEvent: async (args, req) => {
      if (!req.isAuth) {
        throw Error("Unauthenticated");
      }
      try {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: dateToString(args.eventInput.date),
          creator: req.userId,
        });
        const res = await event.save();
        const createdEvent = transformEvent(res);
        const creatorUser = await User.findById(req.userId);
        if (!creatorUser) {
          throw new Error("the User doesn't exist");
        }
        creatorUser.createdEvents.push(event);
        await creatorUser.save();
        return createdEvent;
      } catch (error) {
        throw error;
      }
    },
  },
};
