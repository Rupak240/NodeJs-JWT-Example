const express = require("express");
const jsonwbtoken = require("jsonwebtoken");

const app = express();

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

const verifyToken = async (req, res, next) => {
  // Get the auth header value
  const bearerHeader = req.headers["authorization"];

  // Check if bearer is undefined
  if (bearerHeader) {
    // Split at the space & get the token
    const bearer = bearerHeader.split(" ")[1];
    console.log(bearer);

    // Set the token
    req.token = bearer;

    next();
  } else {
    // forbidden
    return res.json({ msg: "Forbidden request." });
  }
};

app.get("/api", (req, res) => {
  res.json({ msg: "Welcome to the API." });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jsonwbtoken.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      return res.json({ msg: "Token expires." });
    } else {
      res.json({ msg: "Post created successfully.", authData });
    }
  });
});

app.post("/api/login", (req, res) => {
  // Mock user
  const user = { id: 1, username: "Rupak", email: "rupak@gmail.com" };

  jsonwbtoken.sign(
    { user },
    "secretKey",
    { expiresIn: "30s" },
    (err, token) => {
      res.json({ token });
    }
  );
});

const PORT = 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
