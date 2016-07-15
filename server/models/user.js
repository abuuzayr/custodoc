var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
var SALT_ROUNDS = 10;
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

//USER SCHEMA
var UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	companyName: {
		type: String,
		required: true
	},
	companyId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	application: {
		bulletform: {
			isUser: {
				type: Boolean,
				required: true,
				default: false
			},
			usertype: {
				type: String
			},
			usermgmt: {
				type: Schema.Types.Mixed
			},
			autofill: {
				type: Schema.Types.Mixed
			},
			formmgmt: {
				type: Schema.Types.Mixed
			},
			entrymgmt: {
				type: Schema.Types.Mixed
			},
			formbuilder: {
				type: Schema.Types.Mixed
			}
		},
		bulletlead: {
			isUser: {
				type: Boolean,
				required: true,
				default: false
			},
			usertype: {
				type: String
			},
			leadmgmt: {
				type: Schema.Types.Mixed
			},
			leadfinder: {
				type: Schema.Types.Mixed
			},
			accountsetting: {
				type: Schema.Types.Mixed
			},
			usermgmt: {
				type: Schema.Types.Mixed
			},
			dbmgmt: {
				type: Schema.Types.Mixed
			}
		}
	}
}, {
	timestamps: true
});

//validate required fields
UserSchema.pre('save', function(next) {
	if (this.application.bulletform.isUser && !this.application.bulletform.usertype) {
		next(new Error('usertype field is required for bulletform'));
	} else if (this.application.bulletlead.isUser && !this.application.bulletlead.usertype) {
		next(new Error('usertype field is required for bulletlead'));
	} else next();
});
// hash the password before the user is saved
UserSchema.pre('save', function(next) {
	var user = this;
	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password'))
		return next();
	// hash password before saving
	bcrypt.genSaltAsync(SALT_ROUNDS)
		.then(function(salt) {
			return bcrypt.hashAsync(user.password, salt, null);
		})
		.then(function(hash) {
			user.password = hash;
			return next();
		})
		.catch(function(err) {
			return next(err);
		});
});


// method to compare a given password with the database hash //add call back
UserSchema.methods.comparePassword = Promise.method(function(plainPassword) {
	return bcrypt.compareAsync(plainPassword, this.password)
		.then(function(isMatch) {
			return isMatch;
		})
		.catch(function(err) {
			throw err;
		});
});

module.exports = mongoose.model('User', UserSchema);