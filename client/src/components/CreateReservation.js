import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";


const CreateReservation = ({ restaurantName, id }) => {
  const [partySize, setPartySize] = useState(0);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = await getAccessTokenSilently();
    const reservation = { partySize, date, restaurantName };
    fetch(`http://localhost:5001/restaurants/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
