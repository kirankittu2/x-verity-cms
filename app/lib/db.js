import mysql from "mysql";

var connection = mysql.createConnection({
  host: "localhost",
  user: "Kittu",
  password: "Kiran@2001",
  database: "today-app",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

export default connection;
