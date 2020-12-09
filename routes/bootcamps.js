const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsByDist,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middleware/advancedResults');

// Include Other Resourses
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resourses router
router.use('/:bootcampId/courses', courseRouter);
router
  .route('/')
  .get(
    advancedResults(Bootcamp, {
      path: 'courses',
      select: 'name description',
    }),
    getBootcamps
  )
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsByDist);

router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;
