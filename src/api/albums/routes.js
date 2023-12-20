const routes = (handler) => [
    {
      method: 'POST',
      path: '/albums',
      handler: handler.postAlbumHandler,
      // options: {
      //   auth: 'albumsapp_jwt',
      // },
    },
    // {
    //   method: 'GET',
    //   path: '/albums',
    //   handler: handler.getAlbumsHandler,
    //   options: {
    //     auth: 'albumsapp_jwt',
    //   },
    // },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: handler.getAlbumByIdHandler,
      // options: {
      //   auth: 'albumsapp_jwt',
      // },
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: handler.putAlbumByIdHandler,
      // options: {
      //   auth: 'albumsapp_jwt',
      // },
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: handler.deleteAlbumByIdHandler,
      // options: {
      //   auth: 'albumsapp_jwt',
      // },
    },
  ];
  
  module.exports = routes;
  