const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsByDist,
} = require('../controllers/bootcamps');

// Include Other Resourses
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resourses router
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;

router.route('/radius/:zipcode/:distance').get(getBootcampsByDist);
