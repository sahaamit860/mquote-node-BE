const AdminSignup = require("./Schema");

exports.signup = (req, res) => {
  var adminUser = new AdminSignup(req.body);
  adminUser.save((err, user) => {
    if (err) {
      res.status(400).json({ err: "Not able to save user!" });
    } else {
      res.json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        message: "Signup Success",
      });
    }
  });
};
