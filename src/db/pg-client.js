import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "todos",
  password: "docker",
  port: 5432,
});

export default pool;
