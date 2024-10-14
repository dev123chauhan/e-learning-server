const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  name: { type: String },
  image: String,
  title: String, 
  description: String,
  bullets: [String],
  tag: String,
  duration: String,
  price: String
});


module.exports = mongoose.model('Course', CourseSchema);



// CourseSchema.plugin(AutoIncrement, {inc_field: 'id'});
// const AutoIncrement = require('mongoose-sequence')(mongoose);





// const mongoose = require('mongoose');

// const courseSchema = new mongoose.Schema({
//   id: Number,
//   title: String,
//   image: String,
//   tag: String,
//   duration: String,
//   text: String,
//   price: String,
// });

// const Course = mongoose.model('Course', courseSchema);

// module.exports = Course;
