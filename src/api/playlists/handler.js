const autoBind = require('auto-bind');

class PlaylistsHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
  
      autoBind(this);
    }
  
    async postPlaylistHandler(request, h) {
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
  
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
  
      response.code(201);
      return response;
    }
  
    async getPlaylistsHandler(request) {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._service.getPlaylists(credentialId);

      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    }
  
    async deletePlaylistByIdHandler(request, h) {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistById(id, credentialId);
  
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    }

    async postPlaylistSongHandler(request, h) {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: owner } = request.auth.credentials;

      await this._service.verifyPlaylistOwner( playlistId, owner );
      await this._service.verifySongIsExist( songId );
      await this._service.addPlaylistSong(playlistId, songId);
  
      const response = h.response({
        status: 'success',
        message: 'Playlist song berhasil ditambahkan',
      });
  
      response.code(201);
      return response;
    }
  
    async getPlaylistByIdHandler(request, h) {
      const { id } = request.params;
      const { id: owner } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, owner);
      const playlist = await this._service.getPlaylistById(id);
      return {
        status: 'success',
        data: {
          playlist,
        },
      };
    }

    async deletePlaylistSongByIdHandler(request, h) {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: owner } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(playlistId, owner);
      await this._service.deletePlaylistSongById(playlistId, songId);
  
      return {
        status: 'success',
        message: 'Playlist song berhasil dihapus',
      };
    }
  }
  
  module.exports = PlaylistsHandler;
  