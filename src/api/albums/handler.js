const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({
      name, year,
    });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async postAlbumCoversHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateAlbumCoverPayload(cover.hapi.headers);

    const fileName = await this._storageService.writeFile(cover, cover.hapi);
    const albumartURL = `http://${process.env.HOST}:${process.env.PORT}/${this._storageService.getDirectory()}/${fileName}`;
    const { id: albumId } = request.params;
    await this._service.addAlbumartURLById(albumartURL, albumId);

    return h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      }).code(201);
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    await this._service.verifyAlbumExistence(albumId);

    const { id: userId } = request.auth.credentials;
    await this._service.isAlbumLikedByUser(userId, albumId);

    await this._service.addLikeAlbum(userId, albumId);

    return h
      .response({
        status: 'success',
        message: 'Berhasil like album',
      })
      .code(201);
  }

  async getLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    await this._service.verifyAlbumExistence(albumId);

    const { likes, fromCache } = await this._service.getAlbumLikesCount(albumId);
    const response = h
      .response({
        status: 'success',
        message: 'Berhasil mendapatkan jumlah like album.',
        data: {
          likes,
        },
      })

    if (fromCache) {
      return response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deleteLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    await this._service.verifyAlbumExistence(albumId);

    const { id: userId } = request.auth.credentials;
    await this._service.deleteLikeAlbum(userId, albumId);

    return h
      .response({
        status: 'success',
        message: 'Berhasil unlike album',
      })
  }

}

module.exports = AlbumsHandler;
