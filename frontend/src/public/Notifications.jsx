import React, { useState, useEffect } from "react";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { io } from "socket.io-client";
import axios from "axios";
import Header from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import "./Notifications.css";

const socket = io("http://localhost:3000");

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = "12345"; // replace with logged-in user id

  useEffect(() => {
    socket.emit("join", userId);

    const fetchData = async () => {
      const res = await axios.get(
        `http://localhost:3000/api/notifications/${userId}`
      );
      setNotifications(res.data);
    };
    fetchData();

    socket.on("notification", (newNote) => {
      setNotifications((prev) => [newNote, ...prev]);
    });

    return () => socket.off("notification");
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    const updated = await Promise.all(
      notifications.map((n) =>
        axios.put(`http://localhost:3000/api/notifications/${n.id}/read`)
      )
    );
    setNotifications(updated.map((res) => res.data));
  };

  return (
    <div className="notification-page">
      <Header unreadCount={unreadCount} />

      <section className="hero">
        <div className="hero-card">
          <h1>Notifications</h1>
          <p>Stay updated with your latest alerts and messages</p>
          <button className="mark-read-btn" onClick={markAllRead}>
            Mark all as read
          </button>
        </div>
      </section>

      <section className="notifications">
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`notification-card ${note.is_read ? "read" : "unread"}`}
          >
            <div className="icon-section">
              <FaEnvelopeOpenText size={20} className="note-icon" />
            </div>
            <div className="text-section">
              <p>{note.message}</p>
              <span>{new Date(note.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default Notification;
