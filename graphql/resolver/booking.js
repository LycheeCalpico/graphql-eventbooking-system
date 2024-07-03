import Event from "../../models/event.js";
import Booking from "../../models/booking.js";
import { transformEvent, transformBooking } from "./merge.js";

export default {
  // return all the bookings

  bookings: async (_, req) => {
    if (!req.isAuth) {
      throw Error("Unauthenticated");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      if (req.isExpired) {
        throw new Error("Token expired! please relogin");
      }
      throw new Error("Unauthenticated");
    }
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw Error("Unauthenticated");
    }
    try {
      const booking = await Booking.findById({ _id: args.bookingId }).populate(
        "event"
      );
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
};
