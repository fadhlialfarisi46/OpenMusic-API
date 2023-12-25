exports.up = async (pgm) => {
    await pgm.createTable('playlist_songs', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      playlist_id: {
         type: 'VARCHAR(50)',
         references: 'playlists', 
         onDelete: 'cascade', 
         nullable: true,
        },
      song_id: {
         type: 'VARCHAR(50)',
         references: 'songs', 
         onDelete: 'cascade', 
         nullable: true,
        },
    });

    await pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

    await pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');

  };
  
  exports.down = async (pgm) => {
    await pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id');
    await pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id');

    await pgm.dropTable('playlists');
  };
  