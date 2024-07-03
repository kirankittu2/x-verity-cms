import mysql from "mysql";

var connection = mysql.createConnection({
  host: "localhost",
  user: "qcadmin_admin",
  password: "SbI!J2mshKy@pm2",
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
