'use strict';
var mongoose = require('mongoose');
var user= require('./users')
var Schema = mongoose.Schema;
var post=new Schema({
	val:{
		type:String,
		required:true,
	},
	users:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	option:[{
		name:{
			type:String,
			required:true
		},
		click:{
			type:Number,
			default:0,
			required:true
		}
	}],
	link:{
		type:String,
		required:true
	}
});

module.exports = mongoose.model('Post', post);
