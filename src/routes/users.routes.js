// Routes pour la gestion des utilisateurs
const router = require("express").Router();
// Import du contrôleur qui contient la logique des routes utilisateurs
const ctrl = require("../controllers/users.controller");

// Récupère la liste de tous les utilisateurs
router.get("/", ctrl.listUsers);
// Récupère un utilisateur par son identifiant (paramètre :id)
router.get("/:id", ctrl.getUser);
// Crée un nouvel utilisateur (données dans le corps de la requête)
router.post("/", ctrl.createUser);
// Met à jour un utilisateur existant identifié par :id
router.put("/:id", ctrl.updateUser);
// Supprime un utilisateur identifié par :id
router.delete("/:id", ctrl.deleteUser);

// Export du routeur pour être utilisé par l'application principale
module.exports = router;
