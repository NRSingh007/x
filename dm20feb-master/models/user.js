const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    role: {
        type: String,
        default: 'user',
        setBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    email: {
        type: String,
        // required: true,
        unique: true
        // dropDups: true
    },
    tempEmail: String,
    youare: String,
    old_id: Number,
    member_id: Number,
    status: {
        type: Boolean,
        default: false
    },
    name: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        fullName: {
            type: String
        }
    },
    password: {
        type: String,
        // required: true,
        minlength: 8
    },
    mobileNumber: [{
        number: String
    }],
    telephoneNumber: [{
        number: String,
        stdcode: Number
    }],
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
        }, // leikai / village / khul
        subLocality: {
            type: Schema.Types.ObjectId,
            ref: 'SubLocality'
        },
        areaAndStreetAddress: {
            type: String
        },
        landmark: {
            type: String
        }, // point of interest
        building: {
            type: String
        }, // house name
        roomNo: {
            type: String
        }
    },
    about: {
        type: String,
        max:  250
    },
    emailVerificationTokenExpiration: Date,
    emailVerificationToken: String,
    activated: {
        type: Boolean,
        default: false
    },
    passwordResetVerificationTokenExpiration: Date,
    passwordResetVerificationToken: String,
    memberId: String,
    vCode: String,
    social: {
        facebook: {
            id: String,
            token: String,
            email: String,
            displayName: String
        },
        google: {
            id: String,
            displayName: String
        }
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    },
    images: {
        profile: {
            xs: {
                url: String,
                title: String
            },
            sm: {
                url: String,
                title: String
            },
            md: {
                url: String,
                title: String
            },
            lg: {
                url: String,
                title: String
            },
            xl: {
                url: String,
                title: String
            },
            common: {
                url: String,
                title: String
            }
        },
        coverImage: {
            landscape_xs: {
                url: String,
                title: String
            },
            landscape_sm: {
                url: String,
                title: String
            },
            landscape_md: {
                url: String,
                title: String
            },
            landscape_lg: {
                url: String,
                title: String
            },
            landscape_xl: {
                url: String,
                title: String
            }
        },
        collection: [{
            url: String,
            title: String
        }]
    },
    createdOn: {
        type: Date,
        required: true
    },
    modifiedOn: {
        type: Date,
        required: true
    },
    accountDelete: {
        requestedOn: Date,
        reason: String
    },
    recentlyViewedPosts: [{
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            },
            date: Date
        }

    ],
    bookmarks: [{
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            },
            addedDate: Date,
            url: String
        }

    ],
    savedCollections: [{
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Collection'
            },
            addedDate: Date,
            url: String,
            placesCount: Number
        }

    ],
    beenThere: [{
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            },
            date: Date
        }

    ],
	 wishlistProduct: [{
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            date: Date
        }
    ],
    reviews: [{

            type: Schema.Types.ObjectId,
            ref: 'Review'

        }
    ],
    ratings: [{
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
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
    }],
    lastLocation: {
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
        }, // leikai / village / khul
        subLocality: {
            type: Schema.Types.ObjectId,
            ref: 'SubLocality'
        },
        areaAndStreetAddress: {
            type: String
        },
        landmark: {
            type: String
        }, // point of interest
        building: {
            type: String
        }, // house name
        roomNo: {
            type: String
        }
    }
});
// userSchema.plugin(uniqueValidator);
const sanitizerPlugin = require('mongoose-dompurify');

userSchema.plugin(sanitizerPlugin, {
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

userSchema.pre('save', function( next ) {
    // console.log("doc", this);
    // console.log("Name",this.name);

    // setting first and last name from fullname
    if ( this.name && this.name.fullName) {
        this.name.firstName = this.name.fullName.substring(0, this.name.fullName.indexOf(' '));
        this.name.lastName = this.name.fullName.substring(this.name.fullName.indexOf(' ') + 1);
    }
    // important
    // To break from loop/conditions use : return next();
    next();
    // console.log("Name",this.name);
});

userSchema.statics.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
    this.findOne({_id : profile.id},function(err,result){
        if(!result){
            userObj.username = profile.displayName;
            //....
            userObj.save(cb);
        }else{
            cb(err,result);
        }
    });
  };

module.exports = {
    model: mongoose.model("User", userSchema),
    schema: userSchema
};



// console.log(token);
// const user = new UserModel({
//     name,
//     email,
//     password: hashedPassword,
//     emailVerificationToken: token
// });
// return user.save();

// })
// .then( savedResponse => {
// console.log('user updated',savedResponse)
// return transporter.sendMail({
//     to: email,
//     from: 'hello.filldeo@nodesos.com',
//     subject: 'Signup succeeded!',
//     html: `
//         <h1>You have successfully signed up!</h1>
//         <p>Click on the link below to verify your account.</p>
//         <a href="${req.session.domain}/verify-account/${token}">Verify Account</a>
//         `
// });
// })
// .then( result => {
// // user saved
// console.log("User saved in DB")
// req.flash('notice', 'Please confirm your email address. A verification email has been sent to your account.');
// res.redirect('/auth/login');

// })
// .catch(err => {
// // error in saving new user OR sending mail
// console.log('Error in saving new user, err');
// });