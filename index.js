const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require('path');
const userRoutes = require("./routes/users");
const coursesRoute = require("./routes/courses");
const googleRoute = require("./routes/google")
const enrollmentRoutes = require('./routes/enrollment');
const subscribeRoutes = require('./routes/subscribe');
const helmet = require('helmet');
const morgan = require('morgan');
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors()); 
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
mongoose.connect(process.env.MONGODB_URI, {
});

const connection = mongoose.connection;
connection.once("open", () => { 
  console.log("MongoDB database connection established successfully");
});
 
app.use('/api/contact', require('./routes/contact'));
app.use('/api/subscribe', subscribeRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use("/api", userRoutes);
app.use("/api", coursesRoute);
app.use("/api", googleRoute);
app.use('/api', enrollmentRoutes);

mongoose.connect(process.env.MONGODB_URI, { })
  .then(() => console.log("MongoDB database connection established successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

  
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});



