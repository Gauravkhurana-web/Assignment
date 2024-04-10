const express = require("express");
const connectDb = require("./config/dbConnection");
const Ticket = require("./models/tickets");

connectDb();
const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the app");
});

app.post("/booking", (req, res) => {
  //const bookseats = 5;
  const bookseats = req.body.bookseats;
  let array = new Array();
  let str;
  Ticket.findOne()
    .then((result) => {
      let { row, column, available } = result;
      let matrix = result.data;
      if (bookseats == 0) {
        return res.json("Please Enter Seats greater than 0");
      } else if (bookseats > 7) {
        return res.json("You can book upto 7 seats at a time");
      } else if (available == 0) {
        return res.json("No Seats are left");
      } else if (available < bookseats) {
        return res.json(
          `Only ${available} are lefts.Please choose less tickets.`
        );
      } else {
        let seatbooked = 0;
        for (let i = 0; i < row; i++) {
          for (let j = 0; j < column; j++) {
            if (matrix[i][j] == 0 && seatbooked != bookseats) {
              matrix[i][j] = 1;
              available--;
              seatbooked++;
              let seatNumber = Math.abs(i * 7 + j + 1);
              console.log("Your seat number is", seatNumber);
              array.push(seatNumber);
              str = array.join(",");
              console.log("available seats", available);
            }
          }
        }
        Ticket.findOne()
          .then((resp) => {
            console.log("in update section ", resp);
            resp.data = matrix;
            resp.available = available;
            return resp.save();
          })
          .then((data) => {
            return res.json(`Hey! Gaurav ,Your seats number is ${str}`);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on ${PORT}`);
});
