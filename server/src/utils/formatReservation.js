const formatReservation = (reservation) => {
  return {
    date: reservation.date,
    id: reservation._id,
    partySize: reservation.partySize,
    userId: reservation.userId,
    restaurantName: reservation.restaurantName,
  };
};

module.exports = formatReservation;
