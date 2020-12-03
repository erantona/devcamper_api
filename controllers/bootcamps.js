// @desc Get all bootcamps
// @route GET => /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ sucess: true, msg: 'Show all bootcampss' });
};

// @desc Get single bootcamps
// @route GET => /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ sucess: true, msg: `Get bootcamp ${req.params.id}` });
};

// @desc Create new bootcamps
// @route POST => /api/v1/bootcamps/
// @access Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ sucess: true, msg: 'Create new bootcamps' });
};

// @desc Update new bootcamps
// @route PUT => /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, msg: `Update bootcamp ${req.params.id}` });
};

// @desc Delete new bootcamps
// @route DELETE => /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, msg: `Delete bootcamp ${req.params.id}` });
};
