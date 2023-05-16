import app from "./app.js";

const port = 8496;

// Run the server!
app.listen({ port }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
