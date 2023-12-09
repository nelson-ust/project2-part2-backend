const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const { body } = require("express-validator");

const app = express();

// Use body-parser middleware
app.use(bodyParser.json());

// Mock passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Mock the user object on the request
app.use((req, res, next) => {
  req.user = { /* mock user data here */ };
  next();
});

// Mock the routes with validation
app.post(
  "/register",
  [
    body("username").notEmpty().isString(),
    body("password").notEmpty().isString(),
    // Add more validation rules as needed
  ],
  (req, res) => {
    // Handle the route logic here
    res.status(200).json({ message: "Registration successful" });
  }
);


test("Registration route with validation", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ username: "admin", password: "admin" });
  
    console.log("Response body:", response.body);
  
    expect(response.status).toBe(200);
  });
  