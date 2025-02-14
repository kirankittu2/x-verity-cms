"use client";

import { type } from "os";
import { useEffect, useState } from "react";
const env = process.env.NODE_ENV || "development";

export default function UpdateNotification() {
  const [messages, setMessages] = useState({});
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
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          setMessages(data);
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      } else if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (data) => {
          const readerData = data.currentTarget.result;
          const parsedData = JSON.parse(readerData);
          setMessages(parsedData);
        };
        reader.readAsText(event.data);
      } else {
        console.log("Unknown data type received:", event.data);
      }
    };

    websocket.onclose = (event) => {
      console.log("Disconnected from WebSocket server");
    };

    websocket.onerror = (error) => {
      console.log(error);
    };

    return () => {
      websocket.close();
    };
  }, []);

  return <div>{messages.message}</div>;
}
