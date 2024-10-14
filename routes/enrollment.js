// routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');

// Enroll in a course
router.post('/enroll', async (req, res) => {
  try {
    const { firstName, lastName, email, courseId, duration } = req.body;

    // Check if the user is already enrolled in this specific course
    const existingEnrollment = await Enrollment.findOne({ email, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course.' });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      firstName,
      lastName,
      email,
      courseId,
      duration
    });

    await enrollment.save();
    res.status(201).json({ success: true, message: 'Enrollment successful', enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error enrolling in course', error: error.message });
  }
});

// Get all enrollments for a user
router.get('/enrollments/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const enrollments = await Enrollment.find({ email }).populate('courseId', 'name');
    res.json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching enrollments', error: error.message });
  }
});
router.get("/enrolled-courses", async (req, res) => {
  try {
    // In a real application, you'd get the user ID from the authenticated session
    // For now, we'll just fetch all enrolled courses
    const enrollments = await Enrollment.find().populate("courseId");
    const enrolledCourses = enrollments.map(
      (enrollment) => enrollment.courseId
    );
    res.json(enrolledCourses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete('/enrolled-courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    // In a real application, you'd get the user email from the authenticated session
    // For this example, we'll remove the first matching enrollment
    const result = await Enrollment.findOneAndDelete({ courseId });

    if (result) {
      res.json({ success: true, message: 'Enrollment removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
  } catch (error) {
    console.error("Error removing enrollment:", error);
    res.status(500).json({ success: false, message: 'Error removing enrollment', error: error.message });
  }
});

module.exports = router;













// const express = require("express");
// const router = express.Router();
// const Enrollment = require("../models/Enrollment");

// router.post("/enroll", async (req, res) => {
//   try {
//     const { courseId, firstName, lastName, email, duration } = req.body;
//     console.log(req.body);
//     // Validate input
//     if (!courseId || !firstName || !lastName || !email || !duration) {
//       return res.status(400).send("Missing required fields");
//     }

//     // Check if the user is already enrolled
//     const existingEnrollment = await Enrollment.findOne({ email });
//     if (existingEnrollment) {
//       return res.status(400).send("User is already enrolled");
//     }
//     // Create new enrollment
//     const enrollment = await Enrollment.create({
//       courseId,
//       firstName,
//       lastName,
//       email,
//       duration,
//     });

//     res.status(200).json({ success: true, enrollment });
//   } catch (error) {
//     console.error("Error enrolling user:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// router.get("/enrolled-courses", async (req, res) => {
//   try {
//     // In a real application, you'd get the user ID from the authenticated session
//     // For now, we'll just fetch all enrolled courses
//     const enrollments = await Enrollment.find().populate("courseId");
//     const enrolledCourses = enrollments.map(
//       (enrollment) => enrollment.courseId
//     );
//     res.json(enrolledCourses);
//   } catch (error) {
//     console.error("Error fetching enrolled courses:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;


