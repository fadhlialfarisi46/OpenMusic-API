require('dotenv').config();

const ClientError = require('./exceptions/ClientError');
const NotFoundError = require('./exceptions/NotFoundError');
const AuthorizationError = require('./exceptions/AuthorizationError');
const AuthenticationError = require('./exceptions/AuthenticationError');
const InvariantError = require('./exceptions/InvariantError');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// Storage
const StorageService = require('./services/storage/StorageService');

// cache
const CacheService = require('./services/redis/CacheService');
 
const init = async () => {
    const cacheService = new CacheService();
    const albumsService = new AlbumsService(cacheService);
    const songsService = new SongsService();
    const usersService = new UsersService();
    const playlistService = new PlaylistsService();
    const authenticationsService = new AuthenticationsService();
    const storageService = new StorageService('uploads/album/cover');

    const server = Hapi.server({
      port: process.env.PORT,
      host: process.env.HOST,
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });

    // registrasi plugin eksternal
    await server.register([
      {
        plugin: Jwt,
      },
      {
        plugin: Inert,
      },
    ]);

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('openmusicapp_jwt', 'jwt', {
      keys: process.env.ACCESS_TOKEN_KEY,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: process.env.ACCESS_TOKEN_AGE,
      },
      validate: (artifacts) => ({
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
        },
      }),
    });
  
    await server.register([
      {
        plugin: albums,
        options: {
          service: albumsService,
          storageService: storageService,
          validator: AlbumsValidator,
        },
      },
      {
        plugin: songs,
        options: {
          service: songsService,
          validator: SongsValidator,
        },
      },
      {
        plugin: users,
        options: {
          service: usersService,
          validator: UsersValidator,
        },
      },
      {
        plugin: playlists,
        options: {
          service: playlistService,
          validator: PlaylistsValidator,
        },
      },
      {
        plugin: authentications,
        options: {
          authenticationsService,
          usersService,
          tokenManager: TokenManager,
          validator: AuthenticationsValidator,
        },
      },
      {
        plugin: _exports,
        options: {
          service: ProducerService,
          playlistsService: playlistService,
          validator: ExportsValidator,
        },
      },
    ]);

    server.ext('onPreResponse', (request, h) => {
      const { response } = request;
      console.log(response)
      if (response instanceof Error) {
 
        // penanganan client error secara internal.
        if (response instanceof ClientError) {
          const newResponse = h.response({
            status: 'fail',
            message: response.message,
          });
          newResponse.code(response.statusCode);
          return newResponse;
        }

        if (response instanceof NotFoundError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
        
        if (response instanceof AuthenticationError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
        
        if (response instanceof AuthorizationError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
        
        if (response instanceof InvariantError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
        
        // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
        if (!response.isServer) {
          return h.continue;
        }
        // penanganan server error sesuai kebutuhan
        const newResponse = h.response({
          status: 'error',
          message: 'terjadi kegagalan pada server kami',
        });
        newResponse.code(500);
        return newResponse;
      }
      // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
      return h.continue;
    });
  
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  };
  
  init();
  