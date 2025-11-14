const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const { PORT = 3000, SWAGGER_SERVER_URL } = process.env;
const localUrl = SWAGGER_SERVER_URL || `http://localhost:${PORT}`;

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Orion Agence API',
    description: 'Documentation de base OpenAPI pour l\'API (à compléter).',
    version: '1.0.0'
  },
  servers: [
    {
      url: localUrl,
      description: 'Serveur local'
    }
  ],
  tags: [
    {
      name: 'Users',
      description: 'Gestion des utilisateurs Postgres'
    },
    {
      name: 'Restaurants',
      description: 'Catalogue Mongo de restaurants'
    },
    {
      name: 'Auth',
      description: 'Authentification JWT'
    },
    {
      name: 'User Restaurants',
      description: 'Lien entre utilisateurs et restaurants'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          firstname: { type: 'string', example: 'Ada' },
          lastname: { type: 'string', example: 'Lovelace' },
          email: { type: 'string', format: 'email', example: 'ada@example.com' },
          role_id: { type: ['integer', 'null'], example: 2 },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      UserCreateInput: {
        type: 'object',
        required: ['firstname', 'lastname', 'email', 'password'],
        properties: {
          firstname: { type: 'string', example: 'Ada' },
          lastname: { type: 'string', example: 'Lovelace' },
          email: { type: 'string', format: 'email', example: 'ada@example.com' },
          password: { type: 'string', example: 'Secret#123' },
          role_id: { type: ['integer', 'null'], example: 1 }
        }
      },
      UserUpdateInput: {
        type: 'object',
        properties: {
          firstname: { type: 'string' },
          lastname: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          role_id: { type: ['integer', 'null'] }
        }
      },
      Restaurant: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6650dbecf1f1a2a3c4d5e6f7' },
          title: { type: 'string', example: 'Le Bistrot' },
          address: { type: 'string', example: '10 rue de Paris, 75000 Paris' },
          website: { type: 'string', format: 'uri' },
          phone: { type: 'string', example: '+33 1 23 45 67 89' },
          latitude: { type: 'number', example: 48.8566 },
          longitude: { type: 'number', example: 2.3522 },
          rating: { type: 'number', example: 4.6 },
          reviews: { type: 'integer', example: 1200 },
          type: { type: 'string', example: 'Français' },
          price: { type: 'string', example: '$$' },
          thumbnail: { type: 'string', format: 'uri' },
          description: { type: 'string' },
          openState: { type: 'string', example: 'Ouvert' },
          serviceOptions: { type: 'array', items: { type: 'string' } },
          keyword: { type: 'array', items: { type: 'string' } },
          googleMapsRank: { type: 'integer', example: 3 },
          dataId: { type: 'string', example: '0x123456' },
          placeId: { type: 'string', example: 'ChIJ123456789' },
          mainEmail: { type: 'string', format: 'email' },
          otherEmails: { type: 'array', items: { type: 'string', format: 'email' } }
        }
      },
      RestaurantCreateInput: {
        type: 'object',
        required: ['title', 'address', 'latitude', 'longitude', 'rating', 'reviews', 'type', 'thumbnail', 'keyword', 'dataId', 'placeId'],
        properties: {
          title: { type: 'string' },
          address: { type: 'string' },
          website: { type: 'string', format: 'uri' },
          phone: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          rating: { type: 'number' },
          reviews: { type: 'integer' },
          type: { type: 'string' },
          price: { type: 'string' },
          thumbnail: { type: 'string', format: 'uri' },
          description: { type: 'string' },
          openState: { type: 'string' },
          serviceOptions: { type: 'array', items: { type: 'string' } },
          keyword: { type: 'array', items: { type: 'string' } },
          googleMapsRank: { type: 'integer' },
          dataId: { type: 'string' },
          placeId: { type: 'string' },
          mainEmail: { type: 'string', format: 'email' },
          otherEmails: { type: 'array', items: { type: 'string', format: 'email' } }
        }
      },
      RestaurantUpdateInput: {
        type: 'object',
        description: 'Payload complet utilisé en PUT',
        properties: {
          title: { type: 'string' },
          address: { type: 'string' },
          website: { type: 'string', format: 'uri' },
          phone: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          rating: { type: 'number' },
          reviews: { type: 'integer' },
          type: { type: 'string' },
          price: { type: 'string' },
          thumbnail: { type: 'string', format: 'uri' },
          description: { type: 'string' },
          openState: { type: 'string' },
          serviceOptions: { type: 'array', items: { type: 'string' } },
          keyword: { type: 'array', items: { type: 'string' } },
          googleMapsRank: { type: 'integer' },
          dataId: { type: 'string' },
          placeId: { type: 'string' },
          mainEmail: { type: 'string', format: 'email' },
          otherEmails: { type: 'array', items: { type: 'string', format: 'email' } }
        },
        additionalProperties: true
      },
      AuthLoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' }
        }
      },
      AuthLoginResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' }
        }
      },
      AuthValidateResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 42 },
              role: { type: ['integer', 'null'], example: 1 }
            }
          }
        }
      },
      UserRestaurantSelectionRequest: {
        type: 'object',
        required: ['userId', 'restaurantId'],
        properties: {
          userId: { type: 'integer', example: 1 },
          restaurantId: { type: 'string', example: 'ChIJ123456789' }
        }
      },
      UserRestaurantLink: {
        type: 'object',
        properties: {
          userId: { type: 'integer', example: 1 },
          restaurant: { $ref: '#/components/schemas/Restaurant' },
          status: {
            type: 'array',
            items: { type: 'string', example: 'favori' }
          }
        }
      },
      UserRestaurantStatusUpdateRequest: {
        type: 'object',
        required: ['restaurantId'],
        properties: {
          restaurantId: { type: 'string', example: 'ChIJ123456789' }
        }
      },
      UserRestaurantStatusUpdateResponse: {
        type: 'object',
        properties: {
          userId: { type: 'integer', example: 1 },
          restaurantDataId: { type: 'string', example: '0x123' },
          status: {
            type: 'array',
            items: { type: 'string', example: 'favori' }
          }
        }
      },
      UserRestaurantStatusRow: {
        type: 'object',
        properties: {
          restaurant_mongo_id: { type: 'string' },
          status: {
            type: 'array',
            items: { type: 'string', example: 'favori' }
          }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: [
    path.join(__dirname, '..', 'routes', '*.js'),
    path.join(__dirname, '..', 'controllers', '*.js')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
