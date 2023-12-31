const routes = (handler) => [
    {
      method: 'POST',
      path: '/playlists',
      handler: handler.postPlaylistHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlists',
      handler: handler.getPlaylistsHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlists/{id}',
      handler: handler.deletePlaylistByIdHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    {
      method: 'POST',
      path: '/playlists/{id}/songs',
      handler: handler.postPlaylistSongHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlists/{id}/songs',
      handler: handler.getPlaylistByIdHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlists/{id}/songs',
      handler: handler.deletePlaylistSongByIdHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
  ];
  
  module.exports = routes;
  