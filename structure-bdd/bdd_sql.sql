CREATE TABLE roles ( /* Table pour les rôles des utilisateurs (administrateurs, éditeurs, lecteurs) */
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users ( /* Table pour les utilisateurs */
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_restaurant_status ( /* Table pour enregistrer les status entre utilisateurs et restaurants */
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    restaurant_mongo_id VARCHAR(40) NOT NULL, /* dataId du restaurant */
    status TEXT[] DEFAULT '{}' CHECK (status IS NULL OR status <@ ARRAY['contacté','consulté','favori']::text[]),
    PRIMARY KEY (user_id, restaurant_mongo_id)
);
