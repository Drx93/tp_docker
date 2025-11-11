const request = require("supertest");
const app = require("../src/app.js");
const mongoose = require("mongoose");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoose.connection.dropDatabase();
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await mongoose.connection.close();
});
test("POST /restaurants => 201", async () => { // Crée un nouveau restaurant
  const res = await request(app)
    .post("/restaurants")
    .send({
      title: "Monalisa",
      address: "54 Rue du Val, 77160 Provins, France",
      website: "http://monalisa-provins.fr/",
      phone: "+33 1 60 58 10 83",
      latitude: 48.5609513,
      longitude: 3.2960427,
      rating: 4.6,
      reviews: 122,
      type: "Italian restaurant",
      price: "$$",
      thumbnail:
        "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzk8hLzWUOMPke3_wgru5sTD0vQVONH3UkgC3eLqWC4KINqIrtrWgA0A2CPLFeYsSiXhuPVjzTtibsmwU3ON3pOq0gQ7KyHnuHRvWcfbheI8CJGvk_XArTCwEEtCTo_QrBIkY4r=w163-h92-k-no",
      description:
        "Restaurant italien convivial au cœur de Provins, offrant une cuisine authentique et un service chaleureux.",
      openState: "Open",
      serviceOptions: ["Dine-in", "Takeout", "Delivery"],
      keyword: ["Italian", "Pasta", "Pizza"],
      googleMapsRank: 32.0,
      dataId: "0x47ef31e9e31022d1:0x9e53a000454a5329",
      placeId: "ChIJ0SIQ4-kx70cRKVNKRQCgU54",
        mainEmail: "contact@monalisa-provins.fr",
        otherEmails: ["info@monalisa-provins.fr", "support@monalisa-provins.fr"]
    });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("title", "Monalisa");
  expect(res.body).toHaveProperty(
    "address",
    "54 Rue du Val, 77160 Provins, France"
  );
  expect(res.body).toHaveProperty("website", "http://monalisa-provins.fr/");
  expect(res.body).toHaveProperty("phone", "+33 1 60 58 10 83");
  expect(res.body).toHaveProperty("latitude", 48.5609513);
  expect(res.body).toHaveProperty("longitude", 3.2960427);
  expect(res.body).toHaveProperty("rating", 4.6);
  expect(res.body).toHaveProperty("reviews", 122);
  expect(res.body).toHaveProperty("type", "Italian restaurant");
    expect(res.body).toHaveProperty("price", "$$");
    expect(res.body).toHaveProperty("thumbnail", "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzk8hLzWUOMPke3_wgru5sTD0vQVONH3UkgC3eLqWC4KINqIrtrWgA0A2CPLFeYsSiXhuPVjzTtibsmwU3ON3pOq0gQ7KyHnuHRvWcfbheI8CJGvk_XArTCwEEtCTo_QrBIkY4r=w163-h92-k-no");
  expect(res.body).toHaveProperty(
    "description",
    "Restaurant italien convivial au cœur de Provins, offrant une cuisine authentique et un service chaleureux."
  );
    expect(res.body).toHaveProperty("openState", "Open");
    expect(res.body).toHaveProperty("serviceOptions", ["Dine-in", "Takeout", "Delivery"]);
    expect(res.body).toHaveProperty("keyword", ["Italian", "Pasta", "Pizza"]);
  expect(res.body).toHaveProperty("googleMapsRank", 32.0);
  expect(res.body).toHaveProperty("dataId", "0x47ef31e9e31022d1:0x9e53a000454a5329");
  expect(res.body).toHaveProperty("placeId", "ChIJ0SIQ4-kx70cRKVNKRQCgU54");
  expect(res.body).toHaveProperty("mainEmail", "contact@monalisa-provins.fr");
  expect(res.body).toHaveProperty("otherEmails", ["info@monalisa-provins.fr", "support@monalisa-provins.fr"]);
});

test("GET /restaurants => 200", async () => { // Récupère tous les restaurants
  const res = await request(app).get("/restaurants");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0]).toHaveProperty("title", "Monalisa");
});

test("GET /restaurants/:id => 200", async () => { // Récupère un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app).get(`/restaurants/${restaurantId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Monalisa");
});

test("GET /restaurants/type/:type => 200", async () => { // Récupère les restaurants par type
  const res = await request(app).get("/restaurants/type/Italian restaurant");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0]).toHaveProperty("type", "Italian restaurant");
});

test("GET /restaurants/rating/min/:minRating => 200", async () => { // Récupère les restaurants par note minimale
  const res = await request(app).get("/restaurants/rating/min/4.0");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0]).toHaveProperty("rating");
  expect(res.body[0].rating).toBeGreaterThanOrEqual(4.0);
});

test("GET /restaurants/rating/max/:maxRating => 200", async () => { // Récupère les restaurants par note maximale
  const res = await request(app).get("/restaurants/rating/max/5.0");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0]).toHaveProperty("rating");
  expect(res.body[0].rating).toBeLessThanOrEqual(5.0);
}); 

test("GET /restaurants/reviews/min/:minReviews => 200", async () => { // Récupère les restaurants par nombre minimal d'avis
  const res = await request(app).get("/restaurants/reviews/min/100");
  expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("reviews");
    expect(res.body[0].reviews).toBeGreaterThanOrEqual(100);
});

test("GET /restaurants/reviews/max/:maxReviews => 200", async () => { // Récupère les restaurants par nombre maximal d'avis
  const res = await request(app).get("/restaurants/reviews/max/200");
  expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("reviews");
    expect(res.body[0].reviews).toBeLessThanOrEqual(200);
});

test("GET /restaurants/GoogleMapsRank/:rank => 200", async () => { // Récupère les restaurants par classement Google Maps
  const res = await request(app).get("/restaurants/GoogleMapsRank/32");
  expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("googleMapsRank", 32);
});

test("GET /restaurants/serviceOptions/:option => 200", async () => { // Récupère les restaurants par option de service
  const res = await request(app).get("/restaurants/serviceOptions/Takeout");
  expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("serviceOptions");
    expect(res.body[0].serviceOptions).toContain("Takeout");
});

test("PUT /restaurants/:id => 200", async () => { // Met à jour un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .put(`/restaurants/${restaurantId}`)
    .send({
        title: "Monalisa Updated",
        address: "54 Rue du Val, 77160 Provins, France",
        website: "http://monalisa-provins.fr/",
        phone: "+33 1 60 58 10 83",
        latitude: 48.5609513,
        longitude: 3.2960427,
        rating: 4.7,
        reviews: 130,
        type: "Italian restaurant",
        price: "$$",
        thumbnail:
        "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzk8hLzWUOMPke3_wgru5sTD0vQVONH3UkgC3eLqWC4KINqIrtrWgA0A2CPLFeYsSiXhuPVjzTtibsmwU3ON3pOq0gQ7KyHnuHRvWcfbheI8CJGvk_XArTCwEEtCTo_QrBIkY4r=w163-h92-k-no",
        description:
        "Restaurant italien convivial au cœur de Provins, offrant une cuisine authentique et un service chaleureux.",
        openState: "Open",
        serviceOptions: ["Dine-in", "Takeout", "Delivery"],
        keyword: ["Italian", "Pasta", "Pizza"],
        googleMapsRank: 32.0,
        dataId: "0x47ef31e9e31022d1:0x9e53a000454a5329",
        placeId: "ChIJ0SIQ4-kx70cRKVNKRQCgU54",
        mainEmail: "monalisa@provins.fr",
        otherEmails: ["info@monalisa-provins.fr", "contact@monalisa-provins.fr"]
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Monalisa Updated");
    expect(res.body).toHaveProperty("rating", 4.7);
    expect(res.body).toHaveProperty("reviews", 130);
    expect(res.body).toHaveProperty("mainEmail", "monalisa@provins.fr");
    expect(res.body).toHaveProperty("otherEmails", ["info@monalisa-provins.fr", "contact@monalisa-provins.fr"]);
});

test("PATCH /restaurants/title/:id => 200", async () => { // Met à jour le titre d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/title/${restaurantId}`)
    .send({ title: "Monalisa Patched" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Monalisa Patched");
});

test("PATCH /restaurants/address/:id => 200", async () => { // Met à jour l'adresse d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/address/${restaurantId}`)
    .send({ address: "New Address, 77160 Provins, France" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("address", "New Address, 77160 Provins, France");
});

test("PATCH /restaurants/website/:id => 200", async () => { // Met à jour le site web d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/website/${restaurantId}`)
    .send({ website: "http://new-website.com" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("website", "http://new-website.com");
});

test("PATCH /restaurants/phone/:id => 200", async () => { // Met à jour le téléphone d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/phone/${restaurantId}`)
    .send({ phone: "+33 1 23 45 67 89" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("phone", "+33 1 23 45 67 89");
});

test("PATCH /restaurants/latitude/:id => 200", async () => { // Met à jour la latitude d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/latitude/${restaurantId}`)
    .send({ latitude: 48.123456 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("latitude", 48.123456);
}
);

test("PATCH /restaurants/longitude/:id => 200", async () => { // Met à jour la longitude d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/longitude/${restaurantId}`)
    .send({ longitude: 3.654321 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("longitude", 3.654321);
});

test("PATCH /restaurants/rating/:id => 200", async () => { // Met à jour la note d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/rating/${restaurantId}`)
    .send({ rating: 4.9 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("rating", 4.9);
});

test("PATCH /restaurants/reviews/:id => 200", async () => { // Met à jour le nombre d'avis d'un restaurant par ID
    const restaurantsRes = await request(app).get("/restaurants");
    const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/reviews/${restaurantId}`)
    .send({ reviews: 150 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("reviews", 150);
});

test("PATCH /restaurants/type/:id => 200", async () => { // Met à jour le type d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;  
    const res = await request(app)
    .patch(`/restaurants/type/${restaurantId}`)
    .send({ type: "Updated Type" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("type", "Updated Type");
}
);

test("PATCH /restaurants/price/:id => 200", async () => { // Met à jour le prix d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/price/${restaurantId}`)
    .send({ price: "$$$" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("price", "$$$");
});

test("PATCH /restaurants/thumbnail/:id => 200", async () => { // Met à jour la miniature d'un restaurant par ID
    const restaurantsRes = await request(app).get("/restaurants");
    const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/thumbnail/${restaurantId}`)
    .send({ thumbnail: "http://new-thumbnail.com/image.jpg" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("thumbnail", "http://new-thumbnail.com/image.jpg");
}
);

test("PATCH /restaurants/description/:id => 200", async () => { // Met à jour la description d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/description/${restaurantId}`)
    .send({ description: "Updated description of the restaurant." });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("description", "Updated description of the restaurant.");
}
);

test("PATCH /restaurants/openState/:id => 200", async () => { // Met à jour l'état d'ouverture d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/openState/${restaurantId}`)
    .send({ openState: "Closed" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("openState", "Closed");
}
);

test("PATCH /restaurants/serviceOptions/:id => 200", async () => { // Met à jour les options de service d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/serviceOptions/${restaurantId}`)
    .send({ serviceOptions: ["Dine-in", "Takeout"] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("serviceOptions", ["Dine-in", "Takeout"]);
}
);

test("PATCH /restaurants/keyword/:id => 200", async () => { // Met à jour le mot-clé d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/keyword/${restaurantId}`)
    .send({ keyword: ["Updated", "Keywords"] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("keyword", ["Updated", "Keywords"]);
}
);

test("PATCH /restaurants/googleMapsRank/:id => 200", async () => { // Met à jour le classement Google Maps d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/googleMapsRank/${restaurantId}`)
    .send({ googleMapsRank: 35.0 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("googleMapsRank", 35.0);
});

test("PATCH /restaurants/dataId/:id => 200", async () => { // Met à jour l'ID de données d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/dataId/${restaurantId}`)
    .send({ dataId: "newDataId12345" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("dataId", "newDataId12345");
}
);

test("PATCH /restaurants/placeId/:id => 200", async () => { // Met à jour l'ID de lieu d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/placeId/${restaurantId}`)
    .send({ placeId: "newPlaceId67890" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("placeId", "newPlaceId67890");
});

test("PATCH /restaurants/mainEmail/:id => 200", async () => { // Met à jour l'email principal d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/mainEmail/${restaurantId}`)
    .send({ mainEmail: "newemail@example.com" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("mainEmail", "newemail@example.com");
});

test("PATCH /restaurants/otherEmails/:id => 200", async () => { // Met à jour les autres emails d'un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app)
    .patch(`/restaurants/otherEmails/${restaurantId}`)
    .send({ otherEmails: ["newemail1@example.com", "newemail2@example.com"] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("otherEmails", ["newemail1@example.com", "newemail2@example.com"]);
});

test("DELETE /restaurants/:id => 200", async () => { // Supprime un restaurant par ID
  const restaurantsRes = await request(app).get("/restaurants");
  const restaurantId = restaurantsRes.body[0]._id;
    const res = await request(app).delete(`/restaurants/${restaurantId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Restaurant supprimé avec succès");
});