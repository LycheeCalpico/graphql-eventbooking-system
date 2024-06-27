const events = (eventsId) => {
  return Event.find({ id: { $in: eventsId } })
    .then((events) => {
      return events.map((event) => {
        return {
          ...event._doc,
          creator: user.bind(this, event.creator),
          date: new Date(event._doc.date).toISOString(),
        };
      });
    })
    .catch((err) => {
      throw err; // Corrected without 'return'
    });
};

//----------then chaining version ---------
const user = (userId) => {
  return User.findById(userId).then((user) => {
    return {
      ...user._doc,
      password: null,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  });
};

export default {
  events: () => {
    return Event.find()
      .then((res) => {
        return res.map((event) => {
          return {
            ...event._doc,
            creator: user.bind(this, event.creator),
            date: new Date(event.date).toISOString(),
          };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "6679dcbf607c151fe26585ad",
    });
    let createdEvent;
    return event
      .save()
      .then((res) => {
        createdEvent = {
          ...res._doc,
          creator: user.bind(this, res.creator),
          date: new Date(event.date).toISOString(),
        };
        return User.findById("6679dcbf607c151fe26585ad");
      })
      .then((user) => {
        if (!user) {
          throw new Error("the User doesn't exist");
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then((res) => {
        return createdEvent;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  createUser: (args) => {
    return User.findOne({ email: args.userInput.email }).then((user) => {
      if (user) {
        throw new Error("User Exists Already");
      }
      return bcrypt.hash(args.userInput.password, 12).then((hashedPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });
        return user
          .save()
          .then((res) => {
            console.log(res);
            return { ...res._doc, password: null };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      });
    });
  },
};
