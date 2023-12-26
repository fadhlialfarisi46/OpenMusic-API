const path = require('path');

const routes = (handler) => [
    {
      method: 'POST',
      path: '/albums',
      handler: handler.postAlbumHandler,
    },
    {
      method: 'POST',
      path: '/albums/{id}/covers',
      handler: handler.postAlbumCoversHandler,
      options: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
          output: 'stream',
          maxBytes: 512000,
        },
      },
    },
    {
      method: 'GET',
      path: '/uploads/album/cover/{param*}',
      handler: {
        directory: {
          path: path.resolve(__dirname, '../../..', 'uploads/album/cover/'),
        },
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: handler.getAlbumByIdHandler,
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: handler.putAlbumByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: handler.deleteAlbumByIdHandler,
    },
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: handler.postLikeAlbumHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}/likes',
      handler: handler.getLikeAlbumHandler,
    },
    {
      method: 'DELETE',
      path: '/albums/{id}/likes',
      handler: handler.deleteLikeAlbumHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
  ];
  
  module.exports = routes;
  