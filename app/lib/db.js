import mysql2 from "mysql2/promise";

var pool = mysql2.createPool({
  host: "72.167.133.180",
  user: "qcadmin",
  password: `Dj"Hi4PaJt9Kt_^`,
  database: "qcadmin_xv_cms",
  waitForConnections: true,
  connectionLimit: 0,
  queueLimit: 0,
});

export default pool;
