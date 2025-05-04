const User = require("./users.model");

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
  create: [bodyDataHas("username"), bodyDataHas("email"), create]
};
