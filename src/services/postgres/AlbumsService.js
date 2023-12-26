const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({
    name, year,
  }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBToModel);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
 
    return result.rows.map(mapDBToModel)[0];
  
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addAlbumartURLById(url, id) {
    const addAlbumCoverQuery = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2;',
      values: [url, id],
    };
    await this._pool.query(addAlbumCoverQuery);
  }

  async addLikeAlbum(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const addLikeQuery = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id;',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(addLikeQuery);

    if (!result.rows[0].id) {
      throw new InvariantError(
        'Gagal menyukai album'
      );
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getAlbumLikesCount(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      const likes = JSON.parse(result);
      return { likes, fromCache: true };
    } catch (error) {
      const albumLikesCounterQuery = {
        text: 'SELECT COUNT(*) AS likes FROM album_likes WHERE album_id = $1;',
        values: [albumId],
      };

      const result = await this._pool.query(albumLikesCounterQuery);

      const { likes } = result.rows[0];
      await this._cacheService.set(`likes:${albumId}`, likes);
      return { likes: parseInt(likes, 10), fromCache: false };
    }
  }

  async deleteLikeAlbum(userId, albumId) {
    const deleteLikeAlbumQuery = {
      text: 'DELETE FROM album_likes WHERE user_id = $1 AND album_id = $2;',
      values: [userId, albumId],
    };

    await this._pool.query(deleteLikeAlbumQuery);
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async isAlbumLikedByUser(userId, albumId) {
    const checkLikeStatusQuery = {
      text: 'SELECT id FROM album_likes WHERE user_id = $1 AND album_id = $2;',
      values: [userId, albumId],
    };

    const result = await this._pool.query(checkLikeStatusQuery);

    if (result.rowCount) {
      throw new InvariantError('Anda sudah menyukai album ini.');
    }
  }
  
  async verifyAlbumExistence(id) {
    const checkAlbumExistenceQuery = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(checkAlbumExistenceQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan.');
    }
  }
}

module.exports = AlbumsService;
