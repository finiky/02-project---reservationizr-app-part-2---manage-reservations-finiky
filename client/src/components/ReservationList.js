import "./ReservationList.css";
import { formatDate } from "../utils/formatDate";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const fetchUrl = "http://localhost:5001/reservations";
      const response = await fetch(fetchUrl, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setReservations(data);
    };
    fetchData();
  }, [getAccessTokenSilently]);
  if (reservations.length === 0) {
    return (
      <>
        <p className="noReservation">You don't have any reservations</p>
        <a className="linkToRests" href="http://localhost:3000">
          View the restaurants
        </a>
      </>
    );
  }
  return (
    <>
      <h1 className="upcomingRes">Upcoming reservations</h1>
      <ul className="reservationList">
        {reservations.map(({ restaurantName, date, id }) => {
          return (
            <li key={id} className="reservation">
              <h2 className="nameReservation">{restaurantName}</h2>
              <p className="dateReservation">{formatDate(date)}</p>
              <a
                className="linkReservation"
                href={`http://localhost:3000/reservations/${id}`}
              >
                View details &rarr;
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ReservationList;
