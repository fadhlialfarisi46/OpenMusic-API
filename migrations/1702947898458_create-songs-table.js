exports.up = async (pgm) => {
    await pgm.createTable('songs', {
      id: { type: 'varchar(50)', primaryKey: true, notNull: true },
      title: { type: 'text', notNull: true },
      year: { type: 'integer', notNull: true },
      genre: { type: 'text', notNull: true },
      performer: { type: 'text', notNull: true },
      duration: { type: 'integer', nullable: true },
      album_id: { type: 'varchar(50)', references: 'albums', onDelete: 'cascade', nullable: true },
    });
  
    await pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');

};

exports.down = async (pgm) => {
  await pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');

  await pgm.dropTable('songs');
};
  
  