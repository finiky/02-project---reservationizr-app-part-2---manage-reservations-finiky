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
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = await getAccessTokenSilently();
    const reservation = { partySize, date, restaurantName };
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/reservations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(reservation),
      }
    );

    if (!response.ok) {
      setIsError(true);
      setErrorStatus(response.status);
    } else {
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
      </>
    );
  }
  return (
    <>
      <h3 className="reserveRes">Reserve {restaurantName}</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="guests">
          <label htmlFor="guests">Number of guests</label>
          <input
            id="guests"
            type="text"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            required
          />
        </div>
        <div className="date">
          <label htmlFor="date">Date</label>
          <DatePicker
            id="date"
            selected={date}
            onChange={(date) => setDate(date)}
            showTimeSelect
            dateFormat="MM/dd/yyyy, hh:mm aa"
            required
          />
        </div>
        <button className="submit" disabled={isLoading}>
          Submit
        </button>
      </form>
    </>
  );
};

export default CreateReservation;
