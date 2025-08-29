const { User } = require('../models');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// const JWT_SECRET =store in env
const JWT_SECRET = process.env.JWT_SECRET;


exports.register = async (req, res , next) => {
    try {

        const { email, password, role } = req.body;
        


        // check existing user
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "User already exists" });
        }

        // hash password
        const hashed = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({ email, password: hashed, role });

        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // IMPORTANT: fetch with password
    const user = await User.scope('withPassword').findOne({
      where: { email: email.toLowerCase() }
    });

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // bcryptjs: use compareSync (or callback-based compare)
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // your JWT logic
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // never send password back
    const { password: _pw, ...safeUser } = user.toJSON();
    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    next(err);
  }
};