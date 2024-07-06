import mysql from "mysql";

var connection = mysql.createConnection({
  host: "72.167.133.180",
  user: "qcadmin",
  password: `Dj"Hi4PaJt9Kt_^`,
  database: "qcadmin_xv_cms",
});

connection.connect((err) => {
  if (err) {
    console.error({
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState,
      fatal: err.fatal,
    });
    return;
  }
  console.log("Connected to the database");
});

export default connection;
