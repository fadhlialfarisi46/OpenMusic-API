exports.up = async (pgm) => {
    pgm.addColumn('albums', {
        cover: {
          type: 'TEXT',
        },
      });
  };
  
  exports.down = async (pgm) => {
    await pgm.dropColumn('albums', 'coverUrl');
  };
  