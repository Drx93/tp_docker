const Restaurant = require("../models/restaurants.model");
const mongoose = require("mongoose");
const UserRestaurants = require("../models/userRestaurants.model");

//------------------------------------------------------------------------------//
//--------------------------------------- GET ----------------------------------//
//------------------------------------------------------------------------------//

const getRestaurants = async (req, res) => {
  // Récupère tous les restaurants
  try {
    const restaurants = await Restaurant.find().lean();
    return res.json(restaurants);
  } catch (err) {
    console.error("getRestaurants erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getRestaurantById = async (req, res) => {
  // Récupère un restaurant par ID
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de restaurant invalide" });
    }
    const restaurant = await Restaurant.findById(id).lean();
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }

    // Marquer comme consulté si l'utilisateur est authentifié
    if (req.user && req.user.id) {
      try {
        // Créer le lien utilisateur-restaurant s'il n'existe pas
        const link = await UserRestaurants.linkUserToRestaurant(req.user.id, id);
        // Marquer comme consulté avec la date
        await UserRestaurants.updateViewedStatus(req.user.id, link.restaurant_id, true);
      } catch (err) {
        // On ignore les erreurs de tracking pour ne pas bloquer l'affichage du restaurant
        console.error("Erreur lors du marquage comme consulté:", err);
      }
    }

    return res.json(restaurant);
  } catch (err) {
    console.error("getRestaurantById erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getRestaurantsByType = async (req, res) => {
  // Récupère les restaurants par type
  try {
    const { type } = req.params;
    const restaurants = await Restaurant.find({ type }).lean();
    return res.json(restaurants);
  } catch (err) {
    console.error("getRestaurantsByType erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getRestaurantsByMinRating = async (req, res) => {
  // Récupère les restaurants par note minimale
  try {
    const { minRating } = req.params;
    const restaurants = await Restaurant.find({
      rating: { $gte: Number(minRating) },
    }).lean();
    return res.json(restaurants);
  } catch (err) {
    console.error("getRestaurantsByMinRating erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getRestaurantsByMaxRating = async (req, res) => {
  // Récupère les restaurants par note maximale
  try {
    const { maxRating } = req.params;
    const restaurants = await Restaurant.find({
      rating: { $lte: Number(maxRating) },
    }).lean();
    return res.json(restaurants);
  } catch (err) {
    console.error("getRestaurantsByMaxRating erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getRestaurantsByMinReviews = async (req, res) => {
  // Récupère les restaurants par nombre minimal d'avis
  try {
    const { minReviews } = req.params;
    const restaurants = await Restaurant.find({
      reviews: { $gte: Number(minReviews) },
    }).lean();
    return res.json(restaurants);
  } catch (err) {
    console.error("getRestaurantsByMinReviews erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getRestaurantsByMaxReviews = async (req, res) => {
  // Récupère les restaurants par nombre maximal d'avis
  try {
    const { maxReviews } = req.params;
    const restaurants = await Restaurant.find({
      reviews: { $lte: Number(maxReviews) },
    }).lean();
    return res.json(restaurants);
  } catch (err) {
    console.error("getRestaurantsByMaxReviews erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getRestaurantsByGoogleMapsRank = async (req, res) => {
  // Récupère les restaurants par classement Google Maps
  try {
    const { rank } = req.params;
    const restaurants = await Restaurant.find({
      googleMapsRank: { $gte: Number(rank) },
    }).lean();
    return res.json(restaurants);
  } catch (err) {
    console.error("getRestaurantsByGoogleMapsRank erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getRestaurantsByServiceOption = async (req, res) => {
  // Récupère les restaurants par option de service
  try {
    const { option } = req.params;
    const restaurants = await Restaurant.find({
      serviceOptions: option,
    }).lean();
    return res.json(restaurants);
  } catch (err) {
    console.error("getRestaurantsByServiceOption erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

//------------------------------------------------------------------------------//
//-------------------------------------- POST ----------------------------------//
//------------------------------------------------------------------------------//

const createRestaurant = async (req, res) => {
  // Crée un nouveau restaurant
  try {
    const restaurantData = req.body;
    const newRestaurant = new Restaurant(restaurantData);
    await newRestaurant.save();
    return res.status(201).json(newRestaurant);
  } catch (err) {
    console.error("createRestaurant erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

//------------------------------------------------------------------------------//
//--------------------------------------- PUT -----------------------------------//
//------------------------------------------------------------------------------//

const updateRestaurant = async (req, res) => {
  // Met à jour un restaurant par ID
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de restaurant invalide" });
    }
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();
    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }
    return res.json(updatedRestaurant);
  } catch (err) {
    console.error("updateRestaurant erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

//------------------------------------------------------------------------------//
//-------------------------------------- PATCH ----------------------------------//
//------------------------------------------------------------------------------//

const updateRestaurantField = (fieldName) => async (req, res) => {
  // Met à jour un champ spécifique (fieldName) d'un restaurant par ID
  try {
    const { id } = req.params;
    const updateValue = req.body[fieldName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de restaurant invalide" });
    }
    const updateData = {};
    updateData[fieldName] = updateValue;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();
    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }
    return res.json(updatedRestaurant);
  } catch (err) {
    console.error("updateRestaurantField erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

//------------------------------------------------------------------------------//
//------------------------------------- DELETE ---------------------------------//
//------------------------------------------------------------------------------//

const deleteRestaurant = async (req, res) => {
  // Supprime un restaurant par ID
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de restaurant invalide" });
    }
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id).lean();
    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }
    return res.json({ message: "Restaurant supprimé avec succès" });
  } catch (err) {
    console.error("deleteRestaurant erreur", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  // Exportation des fonctions du contrôleur
  getRestaurants,
  getRestaurantById,
  getRestaurantsByType,
  getRestaurantsByMinRating,
  getRestaurantsByMaxRating,
  getRestaurantsByMinReviews,
  getRestaurantsByMaxReviews,
  getRestaurantsByGoogleMapsRank,
  getRestaurantsByServiceOption,
  createRestaurant,
  updateRestaurant,
  updateRestaurantField,
  deleteRestaurant,
};
