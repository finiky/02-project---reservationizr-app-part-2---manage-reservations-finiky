import "./ReservationList.css";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reservations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setReservations(data);
    };
    fetchData();
  }, [getAccessTokenSilently]);
  if (reservations.length === 0) {
    return (
      <>
        <h1 className="upcomingRes">Upcoming reservations</h1>
        <p className="noReservation">You don't have any reservations</p>
        <Link className="linkToRests" to="/">
          View the restaurants
        </Link>
      </>
    );
  }
  return (
    <>
      <h1 className="upcomingRes">Upcoming reservations</h1>
      <ul className="reservationList">
        {reservations.map(({ restaurantName, date, id }) => {
          const link = `/reservations/${id}`;
          return (
            <li key={id} className="reservation">
              <h2 className="nameReservation">{restaurantName}</h2>
              <p className="dateReservation">{formatDate(date)}</p>

              <Link className="linkReservation" to={link}>
                View details &rarr;
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ReservationList;
