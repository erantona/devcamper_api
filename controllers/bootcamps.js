const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc Get all bootcamps
// @route GET => /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  // Field to be exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create operators ($lt, $gt, etc)
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finiding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: 'courses',
    select: 'name description',
  });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  query = query.skip(startIndex).limit(limit);

  const total = await Bootcamp.countDocuments();

  const bootcamps = await query;

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    sucess: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc Get single bootcamps
// @route GET => /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ sucess: true, data: bootcamp });
});

// @desc Create new bootcamps
// @route POST => /api/v1/bootcamps/
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    sucess: true,
    data: bootcamp,
  });
});

// @desc Update new bootcamps
// @route PUT => /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ sucess: true, data: bootcamp });
});

// @desc Delete new bootcamps
// @route DELETE => /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404)
    );
  }
  bootcamp.remove();
  res.status(200).json({ sucess: true, data: 'Deleted' });
});

// @desc Find by distance and zipcode
// @route GET => /api/v1/bootcamps/radius/:zipcode/:distance(in KM)
// @access Public
//
exports.getBootcampsByDist = asyncHandler(async (req, res, next) => {
  const loc = await geocoder.geocode(req.params.zipcode);
  const lat = loc[0].latitude;
  const lon = loc[0].longitude;
  // Earth redius 6371 KM
  const radius = req.params.distance / 6371;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
  });

  res.status(200).json({
    sucess: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// tesr
