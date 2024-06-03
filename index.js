const express = require('express');

// Data arrays to store rooms and customer information
const Rooms = [
  {
    room_id:101,
    room_name: "First_Class_with_AC",
    booked_status: true,
    price_for_1_hours: 8000,
  },
  {
    room_id: 102,
    room_name: "First_Class_With_Non_AC",
    booked_status: true,
    price_for_1_hours: 6000,
  },
  {
    room_id: 103,
    room_name: "Second_Class_with_AC",
    booked_status: true,
    price_for_1_hours: 4000,
  },
  {
    room_id:104,
    room_name: "Second_Class_with_Non_AC",
    booked_status: false,
    price_for_1_hours: 2000,
  }
];

const Customer = [
  {
    room_id: 101,
    customer_id: 11,
    name: "Amsa",
    date: "23/01/2024",
    start_time: "09:00:00 am",
    end_time: "12:20:12 pm",
  },
  {
    room_id:102,
    customer_id: 12,
    name: "Aruns",
    date: "24/05/2024",
    start_time: "06:40:09 am",
    end_time: "12:35:46 pm",
  },
  {
    room_id: 103,
    customer_id: 13,
    name: "Anu",
    date: "29/04/2024",
    start_time: "09:30:23 pm",
    end_time: "10:30:09 am",
  },
];

// Utility function to find the index of a room by its id
const findIndex = (array, id) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].room_id == id) {
      return i;
    }
  }
  return -1;
};

// Controller functions

// Home page
const homePage = (req, res) => {
  res.status(200).send(`
    <div>
      <h1>NodeJS Hall Booking API</h1>
      <ul>
        <li>Get all Rooms = endpoint: /rooms</li>
        <li>New Hall Booking = endpoint: /rooms/:id</li>
        <li>Take a list of Booked rooms = endpoint: /rooms/customer</li>
        <li>Create a new room = endpoint: /rooms/</li>
      </ul>
    </div>
  `);
};

// Get all booked rooms
const BookedRooms = (req, res) => {
  try {
    let BookedRoom = [];
    for (let i = 0; i < Rooms.length; i++) {
      for (let y = 0; y < Customer.length; y++) {
        if (Rooms[i].room_id === Customer[y].room_id) {
          BookedRoom.push({
            Room_Name: Rooms[i].room_name,
            Booked_Status: Rooms[i].booked_status,
            customer: Customer[y],
          });
        }
      }
      if (Rooms[i].booked_status === false) {
        BookedRoom.push(Rooms[i]);
      }
    }
    res.status(200).send(BookedRoom);
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// Get all customers
const allCustomer = (req, res) => {
  try {
    let BookedRoom = [];

    for (let i = 0; i < Rooms.length; i++) {
      for (let y = 0; y < Customer.length; y++) {
        if (Rooms[i].room_id === Customer[y].room_id) {
          BookedRoom.push({
            Customer: Customer[y].name,
            Room_Name: Rooms[i].room_name,
            Date: Customer[y].date,
            Start_Time: Customer[y].start_time,
            End_Tiem: Customer[y].end_time,
            Booked_Status: Rooms[i].booked_status,
          });
        }
      }
    }
    res.status(200).send(BookedRoom);
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// Create a new room
const CreateRoom = (req, res) => {
  try {
    const id = Rooms.length ? Rooms[Rooms.length - 1].room_id + 1 : 1;
    req.body.room_id = id;
    req.body.room_name = `room-${id}`;
    req.body.booked_status = false;

    Rooms.push(req.body);
    console.log(req.body);
    res.status(200).send({
      message: "Room Added Successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// Delete a room
const DeleteRoom = (req, res) => {
  try {
    const { id } = req.params;
    const index = findIndex(Rooms, id);
    if (index !== -1) {
      Rooms.splice(index, 1);
      res.status(200).send({
        message: "Room Deleted Successfully",
      });
    } else {
      res.status(400).send({
        message: "Invalid Room Id",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// Book a room
const Booking = (req, res) => {
  try {
    const { id } = req.params;
    const Room_id = +id;
    const index = findIndex(Rooms, id);
    const temp = { ...Rooms[index] };
    temp.booked_status = true;

    if (index !== -1 && Rooms[index].booked_status == false) {
      Rooms.splice(index, 1, temp); // Change room status
      const { name, date, start_time, end_time } = req.body;
      const id = Customer.length ? Customer[Customer.length - 1].customer_id + 1 : 1;
      const newCustomer = {
        customer_id: id,
        name,
        date,
        start_time,
        end_time,
        room_id: Room_id,
      };
      Customer.push(newCustomer); // Collect customer details
      res.status(200).send({
        message: "Room Booking Successfully",
      });
    } else if (Rooms[index].booked_status == true) {
      res.status(500).send({
        message: "This Room is already booked",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// Setup Express application
const app = express();
const PORT = 7000;

app.use(express.json());

// Define routes
app.get('/', homePage);
app.get('/rooms', BookedRooms);
app.get('/rooms/customer', allCustomer);
app.post('/rooms', CreateRoom);
app.delete('/rooms/:id', DeleteRoom);
app.post('/rooms/:id', Booking);

// let date = new Date().toLocaleTimeString();
// console.log(date);

app.listen(PORT, () => console.log(`Server Running at ${PORT}`));
