const router = require("express").Router();
const ctrl = require("../controllers/restaurants.controller");
const auth = require('../middlewares/auth');

// Protect all restaurant endpoints: require a valid JWT access token
router.use(auth);

/**
 * @openapi
 * /api/restaurants:
 *   get:
 *     tags: [Restaurants]
 *     summary: Liste de tous les restaurants Mongo
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/", ctrl.getRestaurants);

/**
 * @openapi
 * /api/restaurants/{id}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Récupère un restaurant par identifiant Mongo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId du restaurant
 *     responses:
 *       200:
 *         description: Restaurant trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Restaurant non trouvé
 */
router.get("/:id", ctrl.getRestaurantById);

/**
 * @openapi
 * /api/restaurants/type/{type}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Recherche par type de cuisine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste filtrée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/type/:type", ctrl.getRestaurantsByType);

/**
 * @openapi
 * /api/restaurants/rating/min/{minRating}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Restaurants avec une note minimale
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: minRating
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Liste filtrée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/rating/min/:minRating", ctrl.getRestaurantsByMinRating);

/**
 * @openapi
 * /api/restaurants/rating/max/{maxRating}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Restaurants avec une note maximale
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: maxRating
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Liste filtrée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/rating/max/:maxRating", ctrl.getRestaurantsByMaxRating);

/**
 * @openapi
 * /api/restaurants/reviews/min/{minReviews}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Restaurants avec un nombre minimal d'avis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: minReviews
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste filtrée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/reviews/min/:minReviews", ctrl.getRestaurantsByMinReviews);

/**
 * @openapi
 * /api/restaurants/reviews/max/{maxReviews}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Restaurants avec un nombre maximal d'avis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: maxReviews
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste filtrée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/reviews/max/:maxReviews", ctrl.getRestaurantsByMaxReviews);

/**
 * @openapi
 * /api/restaurants/GoogleMapsRank/{rank}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Restaurants par rang Google Maps minimum
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rank
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste filtrée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/GoogleMapsRank/:rank", ctrl.getRestaurantsByGoogleMapsRank);

/**
 * @openapi
 * /api/restaurants/serviceOptions/{option}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Restaurants par option de service
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: option
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste filtrée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get("/serviceOptions/:option", ctrl.getRestaurantsByServiceOption);

/**
 * @openapi
 * /api/restaurants:
 *   post:
 *     tags: [Restaurants]
 *     summary: Crée un nouveau restaurant dans MongoDB
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantCreateInput'
 *     responses:
 *       201:
 *         description: Restaurant créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.post("", ctrl.createRestaurant);

/**
 * @openapi
 * /api/restaurants/{id}:
 *   put:
 *     tags: [Restaurants]
 *     summary: Remplace un restaurant existant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantUpdateInput'
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Restaurant non trouvé
 */
router.put("/:id", ctrl.updateRestaurant);

/**
 * @openapi
 * /api/restaurants/title/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour uniquement le titre
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/title/:id", ctrl.updateRestaurantField('title'));

/**
 * @openapi
 * /api/restaurants/address/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour l'adresse
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [address]
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/address/:id", ctrl.updateRestaurantField('address'));

/**
 * @openapi
 * /api/restaurants/website/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour le site web
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [website]
 *             properties:
 *               website:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/website/:id", ctrl.updateRestaurantField('website'));

/**
 * @openapi
 * /api/restaurants/phone/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour le téléphone
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/phone/:id", ctrl.updateRestaurantField('phone'));

/**
 * @openapi
 * /api/restaurants/latitude/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour la latitude
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [latitude]
 *             properties:
 *               latitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/latitude/:id", ctrl.updateRestaurantField('latitude'));

/**
 * @openapi
 * /api/restaurants/longitude/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour la longitude
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [longitude]
 *             properties:
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/longitude/:id", ctrl.updateRestaurantField('longitude'));

/**
 * @openapi
 * /api/restaurants/rating/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour la note
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/rating/:id", ctrl.updateRestaurantField('rating'));

/**
 * @openapi
 * /api/restaurants/reviews/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour le nombre d'avis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reviews]
 *             properties:
 *               reviews:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/reviews/:id", ctrl.updateRestaurantField('reviews'));

/**
 * @openapi
 * /api/restaurants/type/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour le type de cuisine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/type/:id", ctrl.updateRestaurantField('type'));

/**
 * @openapi
 * /api/restaurants/price/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour la gamme de prix
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [price]
 *             properties:
 *               price:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/price/:id", ctrl.updateRestaurantField('price'));

/**
 * @openapi
 * /api/restaurants/thumbnail/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour la miniature
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [thumbnail]
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/thumbnail/:id", ctrl.updateRestaurantField('thumbnail'));

/**
 * @openapi
 * /api/restaurants/description/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour la description
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description]
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/description/:id", ctrl.updateRestaurantField('description'));

/**
 * @openapi
 * /api/restaurants/openState/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour l'état d'ouverture
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [openState]
 *             properties:
 *               openState:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/openState/:id", ctrl.updateRestaurantField('openState'));

/**
 * @openapi
 * /api/restaurants/serviceOptions/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour les options de service
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceOptions]
 *             properties:
 *               serviceOptions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/serviceOptions/:id", ctrl.updateRestaurantField('serviceOptions'));

/**
 * @openapi
 * /api/restaurants/keyword/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour les mots-clés
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [keyword]
 *             properties:
 *               keyword:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/keyword/:id", ctrl.updateRestaurantField('keyword'));

/**
 * @openapi
 * /api/restaurants/googleMapsRank/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour le classement Google Maps
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [googleMapsRank]
 *             properties:
 *               googleMapsRank:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/googleMapsRank/:id", ctrl.updateRestaurantField('googleMapsRank'));

/**
 * @openapi
 * /api/restaurants/dataId/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour le dataId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dataId]
 *             properties:
 *               dataId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/dataId/:id", ctrl.updateRestaurantField('dataId'));

/**
 * @openapi
 * /api/restaurants/placeId/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour le placeId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [placeId]
 *             properties:
 *               placeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/placeId/:id", ctrl.updateRestaurantField('placeId'));

/**
 * @openapi
 * /api/restaurants/mainEmail/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour l'email principal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mainEmail]
 *             properties:
 *               mainEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/mainEmail/:id", ctrl.updateRestaurantField('mainEmail'));

/**
 * @openapi
 * /api/restaurants/otherEmails/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Met à jour les autres emails
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otherEmails]
 *             properties:
 *               otherEmails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.patch("/otherEmails/:id", ctrl.updateRestaurantField('otherEmails'));

/**
 * @openapi
 * /api/restaurants/{id}:
 *   delete:
 *     tags: [Restaurants]
 *     summary: Supprime un restaurant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant supprimé
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Restaurant non trouvé
 */
router.delete("/:id", ctrl.deleteRestaurant);

module.exports = router;

