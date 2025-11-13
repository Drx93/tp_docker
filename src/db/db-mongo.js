import mongoose from "mongoose";
import { MONGO_URI } from "../../env.js"; // Assurez-vous que MONGO_URI est défini dans env.js

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connecté à MongoDB");

        mongoose.connection.on("error", (err) =>
            console.error("Erreur de connexion MongoDB :", err)
        );
        mongoose.connection.on("disconnected", () =>
            console.log("MongoDB déconnecté")
        );

        // Gestion de la fermeture propre de la connexion
        const gracefulShutdown = async () => {
            await mongoose.disconnect();
            console.log("Connexion MongoDB fermée");
            process.exit(0);
        };
        process.on("SIGINT", gracefulShutdown);
        process.on("SIGTERM", gracefulShutdown);
    } catch (error) {
        console.error("Erreur de connexion à MongoDB :", error);
        throw error;
    }
};
