const Joi = require('joi');
 
const ExporPlaylistsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});
 
module.exports = ExporPlaylistsPayloadSchema;