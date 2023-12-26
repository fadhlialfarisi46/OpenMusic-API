require('dotenv').config();
const autoBind = require("auto-bind");

class Listener {
    constructor(playlistsService, mailSender) {
      this._playlistsService = playlistsService;
      this._mailSender = mailSender;
  
      autoBind(this);
    }
  
    async listen(message) {
        
      try {
        const { userId, playlistId, targetEmail } = JSON.parse(message.content.toString());
  
        await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
        const playlist = await this._playlistsService.getPlaylistById(playlistId);
        const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist));
        console.log('ini result:', result);
      } catch (error) {
        console.error('ini error:', error);
      }
    }
  }
  
  module.exports = Listener;