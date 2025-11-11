const mongoose = require('mongoose');

const { Schema } = mongoose;


const RestaurantSchema = new Schema({ //On définit le schéma de la collection "restaurants" en fonction des données scrappées auparavant
    title: {type : String, required: true},
    address: {type: String, required: true},
    website: {type: String},
    phone: {type: String},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    rating: {type: Number, required: true},
    reviews: {type: Number, required: true},
    type: {type: String, required: true},
    price: {type: String},
    thumbnail: {type: String, required: true},
    description: {type: String},
    openState: {type: String},
    serviceOptions: {type: [String]},
    keyword: {type: [String], required: true},
    googleMapsRank: {type: Number},
    dataId: {type: String, required: true},
    placeId: {type: String, required: true},
    mainEmail: {type: String},
    otherEmails: {type: [String]}
});
  

module.exports = mongoose.models.Restaurant || mongoose.model('Restaurant', RestaurantSchema); //On exporte le modèle Mongoose basé sur le schéma défini, en vérifiant d'abord s'il existe déjà pour éviter les erreurs de recompilation

