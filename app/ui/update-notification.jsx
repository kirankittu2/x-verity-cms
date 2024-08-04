"use client";

import { type } from "os";
import { useEffect, useState } from "react";
const env = process.env.NODE_ENV || "development";

export default function UpdateNotification() {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    let socketPath;
    if (env === "development") {
      socketPath = "ws://socket.qcentrio.com";
    } else if (env === "production") {
      socketPath = "wss://socket.qcentrio.com";
    }

    const websocket = new WebSocket(socketPath);

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

    websocket.onclose = (event) => {
      console.log(event);
      console.log("Disconnected from WebSocket server");
      console.log(`Code: ${event.code}, Reason: ${event.reason}`);
    };

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "load", message: "Successfull" }));
    }
  }, [ws]);

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
