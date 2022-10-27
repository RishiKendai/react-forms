const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const serverPort = process.env.SERVER_PORT;
const port = process.env.PORT || serverPort;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect Mongodb
const uri = process.env.MONGO_URL;
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      res.status(503).json({ status: false, msg: `Service unavailable` });
    }
  }
);

const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log(`MongoDB Connected to port ${uri}`);
// });

// Require Routes
const Admin = require('./routes/adminRoute');
const User = require('./routes/userRoute');
const Form = require('./routes/formRoute');
// Routes
app.use('/api/admin', Admin);
app.use('/api/user', User);
app.use('/api', Form);

// app.listen(port, () => {
//   console.log(`server running on port ${port}`);
// });
app.listen(port);
