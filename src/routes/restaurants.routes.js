const router = require("express").Router();
const ctrl = require("../controllers/restaurants.controller");

//-------------------------------- CRUD Restaurants ----------------------------//

//------------------------------------------------------------------------------//
//--------------------------------------- GET ----------------------------------//
//------------------------------------------------------------------------------//

router.get("/restaurants", ctrl.getRestaurants); // Récupère tous les restaurants
router.get("/restaurants/:id", ctrl.getRestaurantById); // Récupère un restaurant par ID
router.get("/restaurants/type/:type", ctrl.getRestaurantsByType); // Récupère les restaurants par type
router.get("/restaurants/rating/min/:minRating", ctrl.getRestaurantsByMinRating); // Récupère les restaurants par note minimale
router.get("/restaurants/rating/max/:maxRating", ctrl.getRestaurantsByMaxRating); // Récupère les restaurants par note maximale
router.get("/restaurants/reviews/min/:minReviews", ctrl.getRestaurantsByMinReviews); // Récupère les restaurants par nombre minimal d'avis
router.get("/restaurants/reviews/max/:maxReviews", ctrl.getRestaurantsByMaxReviews); // Récupère les restaurants par nombre maximal d'avis
router.get("/restaurants/GoogleMapsRank/:rank", ctrl.getRestaurantsByGoogleMapsRank); // Récupère les restaurants par classement Google Maps
router.get("/restaurants/serviceOptions/:option", ctrl.getRestaurantsByServiceOption); // Récupère les restaurants par option de service

//------------------------------------------------------------------------------//
//--------------------------------------- POST ---------------------------------//
//------------------------------------------------------------------------------//

router.post("/restaurants", ctrl.createRestaurant); // Crée un nouveau restaurant

//------------------------------------------------------------------------------//
//--------------------------------------- PUT ----------------------------------//
//------------------------------------------------------------------------------//

router.put("/restaurants/:id", ctrl.updateRestaurant); // Met à jour un restaurant par ID

//------------------------------------------------------------------------------//
//-------------------------------------- PATCH ---------------------------------//
//------------------------------------------------------------------------------//

router.patch("/restaurants/title/:id", ctrl.updateRestaurantField('title')); // Met à jour le titre d'un restaurant par ID
router.patch("/restaurants/address/:id", ctrl.updateRestaurantField('address')); // Met à jour l'adresse d'un restaurant par ID
router.patch("/restaurants/website/:id", ctrl.updateRestaurantField('website')); // Met à jour le site web d'un restaurant par ID
router.patch("/restaurants/phone/:id", ctrl.updateRestaurantField('phone')); // Met à jour le téléphone d'un restaurant par ID
router.patch("/restaurants/latitude/:id", ctrl.updateRestaurantField('latitude')); // Met à jour la latitude d'un restaurant par ID
router.patch("/restaurants/longitude/:id", ctrl.updateRestaurantField('longitude')); // Met à jour la longitude d'un restaurant par ID
router.patch("/restaurants/rating/:id", ctrl.updateRestaurantField('rating')); // Met à jour la note d'un restaurant par ID
router.patch("/restaurants/reviews/:id", ctrl.updateRestaurantField('reviews')); // Met à jour le nombre d'avis d'un restaurant par ID
router.patch("/restaurants/type/:id", ctrl.updateRestaurantField('type')); // Met à jour le type d'un restaurant par ID
router.patch("/restaurants/price/:id", ctrl.updateRestaurantField('price')); // Met à jour le prix d'un restaurant par ID
router.patch("/restaurants/thumbnail/:id", ctrl.updateRestaurantField('thumbnail')); // Met à jour la miniature d'un restaurant par ID
router.patch("/restaurants/description/:id", ctrl.updateRestaurantField('description')); // Met à jour la description d'un restaurant par ID
router.patch("/restaurants/openState/:id", ctrl.updateRestaurantField('openState')); // Met à jour l'état d'ouverture d'un restaurant par ID
router.patch("/restaurants/serviceOptions/:id", ctrl.updateRestaurantField('serviceOptions')); // Met à jour les options de service d'un restaurant par ID
router.patch("/restaurants/keyword/:id", ctrl.updateRestaurantField('keyword')); // Met à jour le mot-clé d'un restaurant par ID
router.patch("/restaurants/googleMapsRank/:id", ctrl.updateRestaurantField('googleMapsRank')); // Met à jour le classement Google Maps d'un restaurant par ID
router.patch("/restaurants/dataId/:id", ctrl.updateRestaurantField('dataId')); // Met à jour l'ID de données d'un restaurant par ID
router.patch("/restaurants/placeId/:id", ctrl.updateRestaurantField('placeId')); // Met à jour l'ID de lieu d'un restaurant par ID
router.patch("/restaurants/mainEmail/:id", ctrl.updateRestaurantField('mainEmail')); // Met à jour l'email principal d'un restaurant par ID
router.patch("/restaurants/otherEmails/:id", ctrl.updateRestaurantField('otherEmails')); // Met à jour les autres emails d'un restaurant par ID

//------------------------------------------------------------------------------//
//--------------------------------------- DELETE --------------------------------//
//------------------------------------------------------------------------------//

router.delete("/restaurants/:id", ctrl.deleteRestaurant); // Supprime un restaurant par ID


module.exports = router;

