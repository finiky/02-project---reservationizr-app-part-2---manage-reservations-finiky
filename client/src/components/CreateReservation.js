import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";
// add a userId as a destructured parameter afterwards 
// as it is required in mongoose schema
const CreateReservation = ({ restaurantName, id }) => {
  const [partySize, setPartySize] = useState(0);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const reservation = { partySize, date, restaurantName };
    fetch(`http://localhost:5001/restaurants/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    }).then(() => {
      navigate("/reservations");
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="guests">Number of guests</label>
        <input
          id="guests"
          type="text"
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
          required
        />
        <label htmlFor="date">Date</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          showTimeSelect
          dateFormat="dd/MM/yyyy, h: mm aa"
          required
        />
        <button>Submit</button>
      </form>
    </>
  );
};

export default CreateReservation;
