const validId = require("./validId");

describe("validId", () => {
  it("should return boolean true if the id is valid", () => {
    const objectId = "616005cae3c8e880c13dc0b9";
    const received = validId(objectId);
    expect(received).toEqual(true);
  });

  it("should return false if the id is invalid", () => {
    const objectId = "invalid-id";
    const received = validId(objectId);
    expect(received).toEqual(false);
  });
});
