const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// unique: true,
const categorySchema = new Schema();
const fields = {
        name: {
                type: String,
                required: true,
                dropDups: true
        },
        images: {
                logo: {
                        url: String,
                        title: String
                },
                coverImage: {
                        url: String,
                        title: String
                },
                collection: [{
                        url: String,
                        title: String
                }]
        },
        description: {
                type: String
        },
        createdOn: {
                type: Date
        },
        modifiedOn: {
                type: Date
        },
        old_id: Number,
        status: {
                type: Boolean,
                default: true
        },
        keywords: [{
                old_id: Number,
                name: {
                        type: String,
                        unique: false
                },
                createdOn: {
                        type: Date
                },
                modifiedOn: {
                        type: Date
                },
                unique: false
        }],
        postAdType: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'AdTypesForPost'
                },
                name: String
        },
        productAdType: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'AdTypesForProduct'
                },
                name: String

        },
        searchSuggestion: {
                type: Boolean,
                default: false
        },
        quickSearch: {
                type: Boolean,
                default: false
        }
};

categorySchema.add({
        ...fields,
        subCategory: [{
                type: Schema.Types.ObjectId,
                ref: 'SubCategory'
        }]

});
const sanitizerPlugin = require('mongoose-dompurify');

categorySchema.plugin(sanitizerPlugin, {
        // Do not sanitize these fields (default: [])
        skip: [],

        // Encode HTML entities? (default: false)
        encodeHtmlEntities: false,

        // Configure DOMPurify, see https://github.com/cure53/DOMPurify for a list of options (default: undefined)
        sanitizer: {
                SAFE_FOR_JQUERY: true,
                SAFE_FOR_TEMPLATES: true,
                ALLOWED_TAGS: []
        }
});
module.exports = {
        model: mongoose.model("Category", categorySchema),
        schema: categorySchema
};