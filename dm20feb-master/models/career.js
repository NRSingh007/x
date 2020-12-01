const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// unique: true,
const careerSchema = new Schema({
        
    createdOn: { type: Date },
    modifiedOn: { type: Date },
    status: { type: Boolean, default: true },
    role: String,
    location: String,
    description: String,
    department: String,
    requirements: String
    
});

const sanitizerPlugin = require('mongoose-dompurify');

// careerSchema.plugin(sanitizerPlugin, {
//     // Do not sanitize these fields (default: [])
//     skip: ['description','requirements'],
   
//     // Encode HTML entities? (default: false)
//     encodeHtmlEntities: false,
   
//     // Configure DOMPurify, see https://github.com/cure53/DOMPurify for a list of options (default: undefined)
//     sanitizer: {
//       SAFE_FOR_JQUERY: true,
//       SAFE_FOR_TEMPLATES: true,
//       ALLOWED_TAGS: []
//     }
//   });

  module.exports = { model: mongoose.model("Career", careerSchema), schema: careerSchema };

