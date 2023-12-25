exports.up = async (pgm) => {
    await pgm.createTable('playlists', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      name: {
        type: 'VARCHAR(50)',
        unique: true,
        notNull: true,
      },
      owner: {
         type: 'VARCHAR(50)',
         references: 'users', 
         onDelete: 'cascade', 
         nullable: true,
        },
    });

    await pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  };
  
  exports.down = async (pgm) => {
    await pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');

    await pgm.dropTable('playlists');
  };
  