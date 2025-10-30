let mongoose = require('mongoose');

let getInTouchSchema = new mongoose.Schema({
    // Email Section
    email: {
        general: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        support: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        business: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        careers: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        }
    },

    // Phone Section
    phone: {
        primary: {
            type: String,
            required: true,
            trim: true
        },
        support: {
            type: String,
            required: true,
            trim: true
        },
        whatsapp: {
            type: String,
            required: true,
            trim: true
        }
    },

    // Address Section
    address: {
        type: String,
        required: true,
        trim: true
    },

    // Business Hours Section
    businessHours: {
        monday: {
            day: {
                type: String,
                default: 'Monday'
            },
            startTime: {
                type: String,
                // required: true
            },
            endTime: {
                type: String,
                // required: true
            }
        },
        tuesday: {
            day: {
                type: String,
                default: 'Tuesday'
            },
            startTime: {
                type: String,
                // required: true
            },
            endTime: {
                type: String,
                // required: true
            }
        },
        wednesday: {
            day: {
                type: String,
                default: 'Wednesday'
            },
            startTime: {
                type: String,
                // required: true
            },
            endTime: {
                type: String,
                // required: true
            }
        },
        thursday: {
            day: {
                type: String,
                default: 'Thursday'
            },
            startTime: {
                type: String,
                // required: true
            },
            endTime: {
                type: String,
                // required: true
            }
        },
        friday: {
            day: {
                type: String,
                default: 'Friday'
            },
            startTime: {
                type: String,
                // required: true
            },
            endTime: {
                type: String,
                // required: true
            }
        },
        saturday: {
            day: {
                type: String,
                default: 'Saturday'
            },
            startTime: {
                type: String,
                // required: true
            },
            endTime: {
                type: String,
                // required: true
            }
        },
        sunday: {
            day: {
                type: String,
                default: 'Sunday'
            },
            startTime: {
                type: String,
                // required: true
            },
            endTime: {
                type: String,
                // required: true
            }
        }
    },

    // Timezone
    timezone: {
        type: String,
        default: 'IST (Indian Standard Time)',
        trim: true
    },

    // Social Media Links
    socialMedia: {
        facebook: {
            type: String,
            trim: true
        },
        instagram: {
            type: String,
            trim: true
        },
        twitter: {
            type: String,
            trim: true
        },
        linkedin: {
            type: String,
            trim: true
        },
        youtube: {
            type: String,
            trim: true
        }
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('GetInTouch', getInTouchSchema);