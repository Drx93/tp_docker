const User = require('../models/users.model');

// Récupère la liste des utilisateurs, avec recherche (q), limite et offset
exports.listUsers = async (req, res, next) => {
  try {
    const { q, limit = 50, offset = 0 } = req.query;
    // Appel au modèle pour récupérer les utilisateurs
    const data = await User.findAll({ q, limit: Number(limit), offset: Number(offset) });
    // Renvoie le nombre d'éléments récupérés et les données
    return res.status(200).json({ total: data.length, data });
  } catch (e) { next(e); }
};

// Récupère un utilisateur par son id
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(Number(req.params.id));
    // Si non trouvé, renvoyer 404
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    // Sinon, renvoyer l'utilisateur
    return res.status(200).json(user);
  } catch (e) { next(e); }
};

// Crée un nouvel utilisateur
exports.createUser = async (req, res, next) => {
  try {
    const { lastname, firstname, email, password, role_id } = req.body;
    // Vérification des champs requis
    if (lastname === undefined || firstname === undefined || email === undefined || password === undefined) {
      return res.status(400).json({ error: 'lastname, firstname, email et password sont requis' });
    }
    // Normalisation de l'email (trim + lowercase)
    const normalizedEmail = String(email).trim().toLowerCase();
    // Vérifier si l'email existe déjà pour éviter la violation de contrainte d'unicité
    const existing = await User.findByEmail(normalizedEmail);
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé' });
    // Hash du mot de passe avant stockage
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(String(password), 10);
    try {
      // Insertion via le modèle
      const created = await User.createOne({ lastname, firstname, email: normalizedEmail, password_hash: hash, role_id: role_id || null });
      // Renvoie 201 avec l'utilisateur créé
      return res.status(201).json(created);
    } catch (e) {
      // Gérer la condition de concurrence où un autre requête a inséré le même email
      if (e && e.code === '23505') return res.status(409).json({ error: 'Email déjà utilisé' });
      throw e;
    }
  } catch (e) { next(e); }
};

// Met à jour un utilisateur existant
exports.updateUser = async (req, res, next) => {
  try {
    const updated = await User.updateOne(Number(req.params.id), req.body);
    // Si l'utilisateur n'existe pas, renvoyer 404
    if (!updated) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    // Sinon, renvoyer l'utilisateur mis à jour
    return res.status(200).json(updated);
  } catch (e) { next(e); }
};

// Supprime un utilisateur par son id
exports.deleteUser = async (req, res, next) => {
  try {
    const ok = await User.deleteOne(Number(req.params.id));
    // Si pas trouvé, renvoyer 404
    if (!ok) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    // Succès de la suppression : renvoyer 204 No Content
    return res.status(204).send();
  } catch (e) { next(e); }
};
