const formatReservation = require("./formatReservation");
describe("", () => {
  it("should return a formatted reservation with ._id property changed to .id when the orignal rservation is passed to the formatReservation function", () => {
    const expected = {
      date: "2023-11-17T06:30:00.000Z",
      id: "507f1f77bcf86cd799439011",
      partySize: 4,
      userId: "mock-user-id",
      restaurantName: "Island Grill",
    };
    const input = {
      date: "2023-11-17T06:30:00.000Z",
      _id: "507f1f77bcf86cd799439011",
      partySize: 4,
      userId: "mock-user-id",
      restaurantName: "Island Grill",
    };

    expect(expected).toEqual(formatReservation(input));
  });
});
