CREATE TABLE roles ( /* Table pour les rôles des utilisateurs (administrateurs, éditeurs, lecteurs) */
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users ( /* Table pour les utilisateurs */
    id SERIAL PRIMARY KEY,
    lastname text NOT NULL,
    firstname text NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_restaurant_status (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    restaurant_id VARCHAR NOT NULL,

    -- Favori
    is_favorite BOOLEAN DEFAULT FALSE,
    favorited_at TIMESTAMP,

    -- Consultation
    is_viewed BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP,

    -- Contact
    is_contacted BOOLEAN DEFAULT FALSE,
    contacted_at TIMESTAMP,

    UNIQUE (user_id, restaurant_id),

    -- Contraintes pour garantir la cohérence boolean <-> timestamp
    CHECK (
        (is_favorite = false AND favorited_at IS NULL)
        OR
        (is_favorite = true AND favorited_at IS NOT NULL)
    ),
    CHECK (
        (is_viewed = false AND viewed_at IS NULL)
        OR
        (is_viewed = true AND viewed_at IS NOT NULL)
    ),
    CHECK (
        (is_contacted = false AND contacted_at IS NULL)
        OR
        (is_contacted = true AND contacted_at IS NOT NULL)
    )
);