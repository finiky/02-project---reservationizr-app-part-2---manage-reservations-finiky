import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";

const CreateReservation = ({ restaurantName, id }) => {
  const [partySize, setPartySize] = useState(0);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = await getAccessTokenSilently();
    const reservation = { partySize, date, restaurantName };
    const response = fetch(`http://localhost:5001/restaurants/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reservation),
    });

    if(!response.ok) {
      setIsError(true);
      setErrorStatus(response.status);
    }else {
      setIsLoading(false);
      navigate("/reservations");
    }
  };
  if (isError) {
    return (
      <>
        <p className="no-reservation">
          Error creating a reservation (error status {errorStatus})
        </p>
        <Link to={`/restaurants/${id}`}>
          Return to restaurant
        </Link>
      </>
    );
  }
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
        <button disabled={isLoading}>Submit</button>
      </form>
    </>
  );
};

export default CreateReservation;
