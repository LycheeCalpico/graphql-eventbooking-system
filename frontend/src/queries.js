export const GET_BOOKINGS = gql`
  query {
    bookings {
      _id
      event {
        _id
        title
      }
      user {
        _id
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const CANCEL_BOOKING = gql`
    mutation{CancelBooking($bookingId: ID!){cancelBooking(bookingId: "${bookingId}"){ _id
    event{ _id title}
    user{ _id email }
    createdAt
    updatedAt}}}
`;
