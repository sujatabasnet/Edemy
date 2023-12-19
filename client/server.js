//so the aim is to use cookie based authentication system
//for that, the server and the client must be running on the same domain
//in production mode not a problem
// in dev mode, they are different(3000, 8000)
//so we create proxy to act as a custom server on the client side
// a proxy is an intermediary server or application that sits between a client
// (such as a web browser or a client-side application) and a destination server
// (such as a web server or an API server). 
//you can read next js custom server documention to know more about this

const express = require('express')
const next = require('next')
const {createProxyMiddleware} = require("http-proxy-middleware")

const dev = process.env.NODE_ENV !== "production"
const app = next({dev});
const handle = app.getRequestHandler();

app
.prepare()
.then(() => {

    const server = express();

  //apply proxy in dev mode
  //  In development mode, requests to /api are forwarded to a server running on http://localhost:8000.
  // This is typically useful when your frontend (client) and backend (server) run on different ports during development, and you want to avoid cross-origin issues.
  if (dev) {
    server.use(
      "/api",
      createProxyMiddleware({
        target: "http://localhost:8000",
        changeOrigin: true,
      })
    );
  }

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:8000");
  });
})
.catch((err) => {
    console.log("Error", err);
});
