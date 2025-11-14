import mongoose from "mongoose";
import { MONGO_URI } from "../../env.js"; // MONGO_URI doit être défini dans env.js

// Fonction pour établir la connexion à MongoDB
export const connectToMongoDB = async () => {
    try {
        // Connexion à MongoDB avec l'URI fourni
        await mongoose.connect(MONGO_URI);
        console.log("Connecté à MongoDB");

        // Écoute des erreurs de connexion
        mongoose.connection.on("error", (err) =>
            console.error("Erreur de connexion MongoDB :", err)
        );
        // Événement lorsque la connexion est déconnectée
        mongoose.connection.on("disconnected", () =>
            console.log("MongoDB déconnecté")
        );

        // Gestionnaire pour fermer proprement la connexion avant l'arrêt du processus
        const gracefulShutdown = async () => {
            try {
                await mongoose.disconnect();
                console.log("Connexion MongoDB fermée");
            } catch (err) {
                console.error("Erreur lors de la fermeture de MongoDB :", err);
            } finally {
                // Quitte le processus après la déconnexion
                process.exit(0);
            }
        };

        // Capturer les signaux d'arrêt pour effectuer une fermeture propre
        process.on("SIGINT", gracefulShutdown);   // Ctrl+C
        process.on("SIGTERM", gracefulShutdown);  // kill ou arrêt du système
    } catch (error) {
        // Log et remontée de l'erreur en cas d'échec de connexion
        console.error("Erreur de connexion à MongoDB :", error);
        throw error;
    }
};
