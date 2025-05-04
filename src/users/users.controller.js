const User = require("./users.model");

async function userExists(req, res, next) {
  const { userId } = req.params;
  const foundUser = await User.findOne({ _id: userId });
  if (foundUser) {
    res.locals.user = foundUser;
    return next();
  }
  next({
    status: 404,
    message: `User id not found: ${userId}`
  });
}

function read(req, res, next) {
  res.json({ data: res.locals.user });
}


async function list(req, res) {
  const users = await User.find();
  res.send(users);
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `Must include a ${propertyName}`
    });
  };
}

async function create(req, res) {
  const { data: { username, email } = {} } = req.body;
  const newUser = new User({
    username: username,
    email: email
  });
  await newUser.save();
  res.status(201).json({ data: newUser });
}

module.exports = {
  list,
  create: [bodyDataHas("username"), bodyDataHas("email"), create],
  read: [userExists, read],
};
