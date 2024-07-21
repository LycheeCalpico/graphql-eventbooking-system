import eventResolver from "./events.js";
import authResolver from "./auth.js";
import bookingResolver from "./booking.js";

const rootResolver = {
  Query: {
    ...eventResolver.Query,
    ...bookingResolver.Query,
    ...authResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...eventResolver.Mutation,
    ...bookingResolver.Mutation,
  },
};

export default rootResolver;
