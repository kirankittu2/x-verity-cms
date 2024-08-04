import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
const env = process.env.NODE_ENV || "development";

if (env === "development") {
  dotenv.config({ path: ".env.local" });
} else if (env === "production") {
  dotenv.config({ path: ".env.prod" });
}

var pool = mysql2.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 0,
  queueLimit: 0,
});

export default pool;
