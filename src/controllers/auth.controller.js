const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/users.model');

const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || '10m';

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role_id || null }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}

// No refresh-token support: authentication issues short-lived access tokens only.

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email et password requis' });

  // Find user by email
  const user = await Users.findByEmail(email);
  if (!user) return res.status(401).json({ error: 'Identifiants invalides' });

  // Compare password with stored hash
  const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });

    // Create access token only (no refresh token)
    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch (e) { next(e); }
};
// No refresh() or logout() exported — refresh-token feature removed.
