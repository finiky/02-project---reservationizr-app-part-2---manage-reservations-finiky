const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./app");

describe("app", () => {
  test("aap.get('/restaurants'), should respond with a list of avaialbe restaurants", async () => {
    const expected = [
      {
        id: "616005cae3c8e880c13dc0b9",
        name: "Curry Place",
        description:
          "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
        image: "https://i.ibb.co/yftcRcF/indian.jpg",
      },
      {
        id: "616005e26d59890f8f1e619b",
        name: "Thai Isaan",
        description:
          "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
        image: "https://i.ibb.co/HPjd2jR/thai.jpg",
      },
      {
        id: "616bd284bae351bc447ace5b",
        name: "Italian Feast",
        description:
          "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
        image: "https://i.ibb.co/0r7ywJg/italian.jpg",
      },
    ];
    await request(app)
      .get("/restaurants")
      .expect((response) => expect(response.body).toEqual(expected))
      .expect(200);
  });

  test("app.get('/restaurants/:id'), should return a single restuarant object", async () => {
    const expected = {
      id: "616005cae3c8e880c13dc0b9",
      name: "Curry Place",
      description:
        "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
      image: "https://i.ibb.co/yftcRcF/indian.jpg",
    };
    await request(app)
      .get("/restaurants/616005cae3c8e880c13dc0b9")
      .expect((response) => expect(response.body).toEqual(expected))
      .expect(200);
  });

  test("app.get('/restaurants/invalid-id'), should return a message saying id provided is invalid and a 400 status code", async () => {
    const expected = { message: "id provided is invalid" };
    await request(app)
      .get("/restaurants/invalid-id")
      .expect((response) => expect(response.body).toEqual(expected))
      .expect(400);
  });

  test("app.get('/restaurants/:id'), should respond with a id not found and a 404 status", async () => {
    const expected = {
      message: "id not found",
    };
    await request(app)
      .get("/restaurants/507f1f77bcf86cd799439015")
      .expect((response) => expect(response.body).toEqual(expected))
      .expect(404);
  });

  test("app.get('/reservations'), should return a list of reservations and a 200 ok status", async () => {
    const expected = [
      {
        date: "2023-11-17T06:30:00.000Z",
        id: "507f1f77bcf86cd799439011",
        partySize: 4,
        userId: "mock-user-id",
        restaurantName: "Island Grill",
      },
      {
        date: "2023-12-03T07:00:00.000Z",
        id: "614abf0a93e8e80ace792ac6",
        partySize: 2,
        userId: "mock-user-id",
        restaurantName: "Green Curry",
      },
      {
        date: "2023-12-03T07:00:00.000Z",
        id: "61679189b54f48aa6599a7fd",
        partySize: 2,
        userId: "another-user-id",
        restaurantName: "Green Curry",
      },
    ];

    await request(app)
      .get("/reservations")
      .expect((response) => expect(response.body).toEqual(expected))
      .expect(200);
  });

  test("app.get('/reservations/:id), should return a single reservation and a 200 ok status", async () => {
    const expected = {
      date: "2023-11-17T06:30:00.000Z",
      id: "507f1f77bcf86cd799439011",
      partySize: 4,
      userId: "mock-user-id",
      restaurantName: "Island Grill",
    };
    await request(app)
      .get("/reservations/507f1f77bcf86cd799439011")
      .expect((response) => expect(response.body).toEqual(expected))
      .expect(200);
  });

  test("app.get('/reservations/invalid-id), should return {message: 'id provided is invalid'} and a 400 ok status", async () => {
    const expected = {
      message: "id provided is invalid",
    };
    await request(app)
      .get("/reservations/invalid-id")
      .expect((response) => expect(response.body).toEqual(expected))
      .expect(400);
  });

  test("app.get('/reservations/:id), should return {message: 'id not found'} and a 404 ok status", async () => {
    const expected = {
      message: "id not found",
    };
    await request(app)
      .get("/reservations/507f1f77bcf86cd799439012")
      .expect((response) => expect(response.body).toEqual(expected))
      .expect(404);
  });

  test("app.post('/restaurant/616005cae3c8e880c13dc0b9'), should add a reservation object to the list of reservation and return all the reservations including the newly added reservation", async () => {
    const body = {
      partySize: 50,
      date: "2025-11-17T06:30:00.000Z",
      userId: "mock-id",
      restaurantName: "Palace Grill",
    };
    let id;
    await request(app)
      .post("/restaurants/616005cae3c8e880c13dc0b9")
      .send(body)
      .set("Accept", "application/json")
      .expect(201)
      .expect((response) => {
        id = response.body[response.body.length - 1].id;
        expect(response.body).toContainEqual(expect.objectContaining(body));
        expect(response.body[response.body.length - 1]).toEqual(
          expect.objectContaining(body)
        );
        expect(id).toBeTruthy();
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        expect(isValidId).toEqual(true);
      });
    // check the new document by retriving it
    await request(app)
      .get(`/reservations/${id}`)
      .expect(200)
      .expect((response) => {
        const expected = {
          id,
          ...body,
        };
        expect(response.body).toEqual(expected);
      });
  });

  test("app.post('/restaurant/616005cae3c8e880c13dc0b9'), should respond with a Validation error and a 400 status code when the user fails to send required data", async () => {
    const body = {
      date: "2025-11-17T06:30:00.000Z",
      userId: "mock-id",
      restaurantName: "Palace Grill",
    };
    await request(app)
      .post("/restaurants/616005cae3c8e880c13dc0b9")
      .send(body)
      .set("Accept", "application/json")
      .expect(400);
  });
});
