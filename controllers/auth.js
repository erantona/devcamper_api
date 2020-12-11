const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Register User
// @route Post => /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //   Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponce(user, 200, res);
});

// @desc Login User
// @route Post => /api/v1/auth/register
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //   validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email & password ', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invaild Email or Password', 401));
  }

  // Check if pw matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invaild Email or Password', 401));
  }

  sendTokenResponce(user, 200, res);
});

// Get token from model, create cookie and send responce
const sendTokenResponce = (user, statusCode, res) => {
  //   Create Token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

// @desc Get logged in user details
// @route GET => /api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});
