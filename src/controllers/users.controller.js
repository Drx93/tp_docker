const User = require('../models/users.model');

exports.listUsers = async (req, res, next) => {
  try {
    const { q, limit = 50, offset = 0 } = req.query;
    const data = await User.findAll({ q, limit: Number(limit), offset: Number(offset) });
    return res.status(200).json({ total: data.length, data });
  } catch (e) { next(e); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(Number(req.params.id));
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    return res.status(200).json(user);
  } catch (e) { next(e); }
};

exports.createUser = async (req, res, next) => {
  try {
    const { lastname, firstname, email, password, role_id } = req.body;
    if (lastname === undefined || firstname === undefined || email === undefined || password === undefined) {
      return res.status(400).json({ error: 'lastname, firstname, email et password sont requis' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    // Check existing email to avoid unique constraint violation
    const existing = await User.findByEmail(normalizedEmail);
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé' });
    // Hash password before storing
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(String(password), 10);
    try {
      const created = await User.createOne({ lastname, firstname, email: normalizedEmail, password_hash: hash, role_id: role_id || null });
      return res.status(201).json(created);
    } catch (e) {
      // Handle race condition where another request inserted the same email concurrently
      if (e && e.code === '23505') return res.status(409).json({ error: 'Email déjà utilisé' });
      throw e;
    }
  } catch (e) { next(e); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updated = await User.updateOne(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    return res.status(200).json(updated);
  } catch (e) { next(e); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const ok = await User.deleteOne(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    return res.status(204).send();
  } catch (e) { next(e); }
};
