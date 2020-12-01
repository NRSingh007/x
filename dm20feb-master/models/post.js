const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    old_id: Number,
    name: {
        type: String,
        required: true
    },
    email: String,
    website: String,
    description: {
        short: String,
        medium: String,
        long: String
    },

    ownerDetails: {
        name: {
            type: String
        },
        email: [{
            type: String
        }]
    },
    mobileNumber: [{
        number: String,
    }],
    telephoneNumber: [{
        number: String,
        stdcode: String

    }],

    timings: {
        monday: {
            open: {
                type: String
            },
            close: {
                type: String
            },
            closed: {
                type: Boolean,
                default: false
            },
            slots: [{
                type: String
            }]
        },
        tuesday: {
            open: {
                type: String
            },
            close: {
                type: String
            },
            closed: {
                type: Boolean,
                default: false
            },
            slots: [{
                type: String
            }]
        },
        wednesday: {
            open: {
                type: String
            },
            close: {
                type: String
            },
            closed: {
                type: Boolean,
                default: false
            },
            slots: [{
                type: String
            }]
        },
        thursday: {
            open: {
                type: String
            },
            close: {
                type: String
            },
            closed: {
                type: Boolean,
                default: false
            },
            slots: [{
                type: String
            }]
        },
        friday: {
            open: {
                type: String
            },
            close: {
                type: String
            },
            closed: {
                type: Boolean,
                default: false
            },
            slots: [{
                type: String
            }]
        },
        saturday: {
            open: {
                type: String
            },
            close: {
                type: String
            },
            closed: {
                type: Boolean,
                default: false
            },
            slots: [{
                type: String
            }]
        },
        sunday: {
            open: {
                type: String
            },
            close: {
                type: String
            },
            closed: {
                type: Boolean,
                default: false
            },
            slots: [{
                type: String
            }]
        },
    },

    verified: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },

    openingStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    address: {
        state: {
            name: String,
            id: {
                type: Schema.Types.ObjectId,
                ref: 'State'
            }
        },
        district: {
            name: String,
            id: {
                type: Schema.Types.ObjectId,
                ref: 'District'
            }
        },
        locality: {
            name: String,
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Locality'
            }
        },
        areaAndStreetAddress: {
            type: String
        },
        // optional
        subLocality: {
            type: String
        },
        building: String,
        landmark: {
            type: String
        }, // point of interest
        roomNo: {
            type: String
        },
        pincode: {
            type: Number
        }

    },

    category: {
        name: {
            type: String
        },
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        },
        old_id: Number,
        subCategory: {
            name: {
                type: String
            },
            id: {
                type: Schema.Types.ObjectId,
                ref: 'SubCategory'
            },
            old_id: Number
        }
    },

    keywords: [{
        name: String,
        id: mongoose.Types.ObjectId
            
    }],

    geoLocation: {
        coordinates: {
            lat: Number,
            lng: Number
        }
    },

    // coverImage: { url: String, title: String },


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

    preference: {
        type: Number
    },

    userPackageId: String,
    userPackageDate: Date,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    old_user_id: Number,
    docs: [{
        name: String,
        url: String
    }],
    postAmount: Number,
    price: Number,
    negotiable: String,
    postCount: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: Date,
        required: true
    },
    modifiedOn: {
        type: Date,
        required: true
    },
    ratings: {
        five: {
            weight: {
                type: Number,
                default: 5
            },
            votes: {
                type: Number,
                default: 0
            }
        },
        four: {
            weight: {
                type: Number,
                default: 4
            },
            votes: {
                type: Number,
                default: 0
            }
        },
        three: {
            weight: {
                type: Number,
                default: 3
            },
            votes: {
                type: Number,
                default: 0
            }
        },
        two: {
            weight: {
                type: Number,
                default: 2
            },
            votes: {
                type: Number,
                default: 0
            }
        },
        one: {
            weight: {
                type: Number,
                default: 1
            },
            votes: {
                type: Number,
                default: 0
            }
        }
    },
    ratedBy:[
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            weight: Number,
            ratedOn: {
                type: Date,
                required: true
            },
            modifiedOn: {
                type: Date,
                required: true
            }
        }
    ],
    rating: {
        type: Number,
        default: 2.5
    },
    totalVotes: {
        type: Number,
        default: 0
    },
    claimed: {
        type: Boolean,
        default: false
    }


}, {
    toObject: {
    virtuals: true
    },
    toJSON: {
    virtuals: true 
    }
  });
// companySchema.plugin(uniqueValidator);

// let ratings = {
//     five: {
//         weight: 5,
//         votes: 252
//     },
//     four: {
//         weight: 4,
//         votes: 124
//     },
//     three: {
//         weight: 3,
//         votes: 40
//     },
//     two: {
//         weight: 2,
//         votes: 29
//     },
//     one: {
//         weight: 1,
//         votes: 33
//     }
// }

postSchema.post('save' , async function(){
    // console.log("postSchema : Post save");
    // console.log("doc rating: ",this.rating);
    // const rating = calcRating(this.ratings);
    // this.set({rating: rating});
    // console.log("saved doc rating: ",this.rating);
});

postSchema.virtual('setRating').set(function (value) {
    // console.log("doc rating: ",this.rating);
    // calcRating(value)
    // this.set({rating: rating});
    // console.log("updated doc rating: ",this.rating);

});

postSchema.virtual('calcRating').get(function () {
   
    return calcRating(this.ratings) ;

});

postSchema.virtual('calcTotalVotes').get(function () {

    
    return this.ratedBy ? this.ratedBy.length : 0;

});

const sanitizerPlugin = require('mongoose-dompurify');

postSchema.plugin(sanitizerPlugin, {
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


  
function calcRating(ratingsObj) {


    // const rating = Object.values(this.ratings); // bug: includes extra element ' true '
    let total = {
        totalWeight: 0,
        totalVotes: 0
    };
   
    // console.log({ratingsObj});
    if (!ratingsObj){
      return 2.5;
    }
    const ratings = { ...JSON.parse(JSON.stringify(ratingsObj)) };
    for ( let key in ratings ) {
        // console.log({ 'votes': ratings[key].votes, 'weight': ratings[key].weight});
        if ( ratings[key] && ratings[key].weight ) {
            total['totalWeight'] += ratings[key].weight * ratings[key].votes;
            total['totalVotes'] += ratings[key].votes;
        }
        
    }
    const calcRating = total['totalWeight'] / total['totalVotes'];
  
    // console.log({calcRating});
    let clean =  calcRating ? calcRating.toFixed(1) : null ;
    const star = [1,2,3,4,5];
    const found = star.find( i => i == clean);
    if ( found ) {
        return parseInt(clean);
    }
    return calcRating ? calcRating.toFixed(1) : 2.5 ;
  
  }

module.exports = {
    model: mongoose.model("Post", postSchema),
    schema: postSchema
};


// primary attribute:
// name, description, address [] , geoLocation [], type, subType [],  coverImageURL[], mobileNumber, dpURL[]
// secondary attribute:
// photos [] , reviews[] , menus[], rating[], timings[], moreInfo[]

// module.exports = class Company{
//     constructor(name, description, address, geoLocation, type, subType,  coverImageURL, mobileNumber, dpURL  ){
//         this.name = name;
//         this.description = description;
//         this.address = address;
//         this.geoLocation = geoLocation;
//         this.type = type;
//         this.subType = subType;
//         this.coverImageURL = coverImageURL;
//         this.mobileNumber = mobileNumber;
//         this.dpURL = dpURL;
//     }

//     save(){
//         companies.push(this);
//     }

//     // static makes the function to call directly without class instance
//     static fetchAll(){
//         return companies;
//     }
// }