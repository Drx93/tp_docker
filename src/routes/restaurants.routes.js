const router = require("express").Router();
const ctrl = require("../controllers/restaurants.controller");

//-------------------------------- CRUD Restaurants ----------------------------//

//------------------------------------------------------------------------------//
//--------------------------------------- GET ----------------------------------//
//------------------------------------------------------------------------------//

router.get("/", ctrl.getRestaurants); // Récupère tous les restaurants
router.get("/:id", ctrl.getRestaurantById); // Récupère un restaurant par ID
router.get("/type/:type", ctrl.getRestaurantsByType); // Récupère les restaurants par type
router.get("/rating/min/:minRating", ctrl.getRestaurantsByMinRating); // Récupère les restaurants par note minimale
router.get("/rating/max/:maxRating", ctrl.getRestaurantsByMaxRating); // Récupère les restaurants par note maximale
router.get("/reviews/min/:minReviews", ctrl.getRestaurantsByMinReviews); // Récupère les restaurants par nombre minimal d'avis
router.get("/reviews/max/:maxReviews", ctrl.getRestaurantsByMaxReviews); // Récupère les restaurants par nombre maximal d'avis
router.get("/GoogleMapsRank/:rank", ctrl.getRestaurantsByGoogleMapsRank); // Récupère les restaurants par classement Google Maps
router.get("/serviceOptions/:option", ctrl.getRestaurantsByServiceOption); // Récupère les restaurants par option de service

//------------------------------------------------------------------------------//
//--------------------------------------- POST ---------------------------------//
//------------------------------------------------------------------------------//

router.post("", ctrl.createRestaurant); // Crée un nouveau restaurant

//------------------------------------------------------------------------------//
//--------------------------------------- PUT ----------------------------------//
//------------------------------------------------------------------------------//

router.put("/:id", ctrl.updateRestaurant); // Met à jour un restaurant par ID

//------------------------------------------------------------------------------//
//-------------------------------------- PATCH ---------------------------------//
//------------------------------------------------------------------------------//

router.patch("/title/:id", ctrl.updateRestaurantField('title')); // Met à jour le titre d'un restaurant par ID
router.patch("/address/:id", ctrl.updateRestaurantField('address')); // Met à jour l'adresse d'un restaurant par ID
router.patch("/website/:id", ctrl.updateRestaurantField('website')); // Met à jour le site web d'un restaurant par ID
router.patch("/phone/:id", ctrl.updateRestaurantField('phone')); // Met à jour le téléphone d'un restaurant par ID
router.patch("/latitude/:id", ctrl.updateRestaurantField('latitude')); // Met à jour la latitude d'un restaurant par ID
router.patch("/longitude/:id", ctrl.updateRestaurantField('longitude')); // Met à jour la longitude d'un restaurant par ID
router.patch("/rating/:id", ctrl.updateRestaurantField('rating')); // Met à jour la note d'un restaurant par ID
router.patch("/reviews/:id", ctrl.updateRestaurantField('reviews')); // Met à jour le nombre d'avis d'un restaurant par ID
router.patch("/type/:id", ctrl.updateRestaurantField('type')); // Met à jour le type d'un restaurant par ID
router.patch("/price/:id", ctrl.updateRestaurantField('price')); // Met à jour le prix d'un restaurant par ID
router.patch("/thumbnail/:id", ctrl.updateRestaurantField('thumbnail')); // Met à jour la miniature d'un restaurant par ID
router.patch("/description/:id", ctrl.updateRestaurantField('description')); // Met à jour la description d'un restaurant par ID
router.patch("/openState/:id", ctrl.updateRestaurantField('openState')); // Met à jour l'état d'ouverture d'un restaurant par ID
router.patch("/serviceOptions/:id", ctrl.updateRestaurantField('serviceOptions')); // Met à jour les options de service d'un restaurant par ID
router.patch("/keyword/:id", ctrl.updateRestaurantField('keyword')); // Met à jour le mot-clé d'un restaurant par ID
router.patch("/googleMapsRank/:id", ctrl.updateRestaurantField('googleMapsRank')); // Met à jour le classement Google Maps d'un restaurant par ID
router.patch("/dataId/:id", ctrl.updateRestaurantField('dataId')); // Met à jour l'ID de données d'un restaurant par ID
router.patch("/placeId/:id", ctrl.updateRestaurantField('placeId')); // Met à jour l'ID de lieu d'un restaurant par ID
router.patch("/mainEmail/:id", ctrl.updateRestaurantField('mainEmail')); // Met à jour l'email principal d'un restaurant par ID
router.patch("/otherEmails/:id", ctrl.updateRestaurantField('otherEmails')); // Met à jour les autres emails d'un restaurant par ID

//------------------------------------------------------------------------------//
//--------------------------------------- DELETE --------------------------------//
//------------------------------------------------------------------------------//

router.delete("/:id", ctrl.deleteRestaurant); // Supprime un restaurant par ID


module.exports = router;

