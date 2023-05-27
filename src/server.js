import app from "./app.js";

const port = 9285;

// Run the server!
app.listen({ port, host: "0.0.0.0" }, function (err, address) {
  console.log(`Server listening on ${address}`);
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
