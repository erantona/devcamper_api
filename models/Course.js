const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: [true, 'Please add a title'],
  },
  description: {
    type: String,
    require: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    require: [true, 'Please add number off week'],
  },
  tuition: {
    type: Number,
    require: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    require: [true, 'Please add minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
