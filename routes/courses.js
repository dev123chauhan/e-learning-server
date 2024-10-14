const express = require('express');
const Course = require('../models/Course');
const router = express.Router();
const coursesContent = require('../courseData'); 
const mongoose = require('mongoose');

// Function to insert courses if the database is empty
const insertCoursesIfEmpty = async () => {
  const count = await Course.countDocuments();
  if (count === 0) {
    try {
      await Course.insertMany(coursesContent);
      console.log('Courses added successfully');
    } catch (err) {
      console.log('Error inserting courses:', err);
    }
  }
};

// Call this function when your server starts
insertCoursesIfEmpty();


// GET /api/courses - Get all courses or search courses
router.get('/courses', async (req, res) => {
  try {
    const { search } = req.query;
    let courses;

    if (search) {
      courses = await Course.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    } else {
      courses = await Course.find();
    }

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// GET /api/courses/:id - Get a specific course
// router.get('/courses/:id', async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (course) {
//       res.json(course);
//     } else {
//       res.status(404).json({ message: 'Course not found' });
//     }
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: err.message });
//   }
// });

router.get('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    // Check if courseId is defined and valid
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId);

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;







// GET /api/courses - Get all courses
// router.get('/courses', async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.json(courses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });









// const express = require('express');
// const router = express.Router();

// router.get('/courses', (req, res) => {
//   const { search } = req.query;

//   if (search) {
//     const lowerCaseSearch = search.toLowerCase();
//     const regex = new RegExp(lowerCaseSearch, 'i'); // 'i' flag for case-insensitive search

//     const filteredCourses = coursesContent.filter(course => 
//       regex.test(course.title) ||
//       regex.test(course.description) ||
//       regex.test(course.tag)
//     );

//     res.json(filteredCourses);
//   } else {
//     res.json(coursesContent);
//   }
// });


// router.get('/courses/:id', (req, res) => {
//   const courseId = parseInt(req.params.id);
//   const course = coursesContent.find(c => c.id === courseId);

//   if (course) {
//     res.json(course);
//   } else {
//     res.status(404).json({ message: 'Course not found' });
//   }
// });

// module.exports = router;



