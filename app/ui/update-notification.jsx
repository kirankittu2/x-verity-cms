"use client";

import { useEffect, useState } from "react";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
if (env === "development") {
  dotenv.config({ path: ".env.local" });
} else if (env === "production") {
  dotenv.config({ path: ".env.prod" });
}

export default function UpdateNotification() {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    console.log(process.env.WEB_SOCKET_PATH);
    const websocket = new WebSocket(process.env.WEB_SOCKET_PATH);

    websocket.onopen = () => {
      console.log("Connected to WebSocket server");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      console.log(event.data);
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, data]);
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      } else if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (data) => {
          const readerData = data.currentTarget.result;
          const parsedData = JSON.parse(readerData);
          setMessages((prevMessages) => [...prevMessages, parsedData]);
        };
        reader.readAsText(event.data);
      } else {
        console.log("Unknown data type received:", event.data);
      }
    };

    websocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <div>
      Update Messages
      {messages.map((msg, index) => (
        <li
          key={index}
          style={{ color: msg.type === "error" ? "red" : "green" }}>
          {msg.message}
        </li>
      ))}
    </div>
  );
}
