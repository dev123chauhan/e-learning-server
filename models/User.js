  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;
  const UserSchema = new Schema(
    {
      username: { type: String, required: true, unique: true, trim: true },
      password: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      profileImage: { type: String, default: "" }, // This will store the path to the uploaded image
      gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
      mobileNumber: { type: String, trim: true },
      dateOfBirth: { type: Date },
      address: { type: String, trim: true }, 
      date: { type: Date, default: Date.now },
      // role: { type: String, required: true, enum: ['student', 'educator'] },
      // courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
    },
    {
      timestamps: true,
    }
  );

  const User = mongoose.model("User", UserSchema);

  module.exports = User;


  // models/User.js
// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['student', 'educator'], required: true },
//   personalInfo: {
//     dateOfBirth: Date,
//     address: String,
//     phoneNumber: String
//   },
//   // For students
//   enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
//   // For educators
//   coursesTaught: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
// });

// module.exports = mongoose.model('User', UserSchema);

// // models/Course.js
// const mongoose = require('mongoose');

// const CourseSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// });

// module.exports = mongoose.model('Course', CourseSchema);