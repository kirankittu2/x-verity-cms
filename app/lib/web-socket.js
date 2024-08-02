import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8000 });
let scriptPath;

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    if (message === "update") {
      ws.send("Update started");

      if (process.env.NODE_ENV === "development") {
        scriptPath = path.join(__dirname, "../../../../update.sh");
      } else if (process.env.NODE_ENV === "production") {
        scriptPath = path.join(__dirname, "../../../update.sh");
      } else {
        console.log("NODE_ENV is not set");
      }

      exec(scriptPath, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          return "Update failed";
        }
        if (stderr) {
          console.error(`Script stderr: ${stderr}`);
          return "Update failed";
        }
        console.log(`Script stdout: ${stdout}`);
        return "Update triggered";
      });
    }
  });
});
