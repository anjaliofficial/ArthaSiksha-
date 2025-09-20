import React, { useEffect, useState } from "react";
import { FaEnvelopeOpenText, FaArrowLeft } from "react-icons/fa";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarAfterLogin from "../components/NavbarAfterLogin";
import Footer from "../components/footer";
import "./Notifications.css";

const socket = io("http://localhost:3000");

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      try {
        const resProfile = await axios.get(
          "http://localhost:3000/api/profile",
          { withCredentials: true }
        );
        const id = resProfile.data.id;
        setUserId(id);

        // fetch notifications
        const resNotif = await axios.get(
          `http://localhost:3000/api/notification/${id}`
        );
        setNotifications(resNotif.data.notifications || []);

        // join socket room safely
        if (id) socket.emit("join", id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserAndNotifications();

    // listen for new notifications
    socket.on("new_notification", (newNote) => {
      setNotifications((prev) => [newNote, ...prev]);
    });

    return () => socket.off("new_notification");
  }, []);

  const markAllRead = async () => {
    try {
      await Promise.all(
        notifications.map((n) =>
          axios.put(`http://localhost:3000/api/notification/${n.id}/read`)
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="notification-page">
      <NavbarAfterLogin unreadCount={unreadCount} />

      {/* Back Button */}
      <div className="back-button" onClick={() => navigate("/homepage")}>
        <FaArrowLeft size={20} /> Back to Homepage
      </div>

      <section className="hero">
        <div className="hero-card">
          <h1>Notifications</h1>
          <p>Stay updated with your latest alerts and messages</p>
          {unreadCount > 0 && (
            <button className="mark-read-btn" onClick={markAllRead}>
              Mark all as read
            </button>
          )}
        </div>
      </section>

      <section className="notifications">
        {notifications.length === 0 && <p>No notifications yet</p>}
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`notification-card ${note.is_read ? "read" : "unread"}`}
          >
            <div className="icon-section">
              <FaEnvelopeOpenText size={20} />
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

export default Notifications;
