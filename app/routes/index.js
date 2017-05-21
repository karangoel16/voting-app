'use strict';

var crypto = require('crypto');
var Post = require('../models/options');
var path = process.cwd();
var mongoose = require('mongoose');
require('dotenv').load();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res,next) {
			//res.sendFile(path + '/public/index.html');
			Post.find({users:req.user._id},function(err,posts){
				if(err)
				{
					console.log(err);
					return next;
				}
				res.render('index',{posts:posts});
			});
		});
	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});
	app.route('/update_post')
		.post(function(req,res,next){
			//console.log(req.body);
			var query={
				'_id':req.body.postId,
				'option._id':req.body.optionId
			}
			Post.update(query,{$inc:{'option.$.click':1}},function(err,post)
				{
					if(err)
					{
						console.log(err);
						return err;
					}
					//console.log(JSON.stringify(post));
					res.json({success : "Updated Successfully", status : 200});
				});
		});
	app.route('/deletepost')
		.post(function(req,res,next){
			var query={
				'_id':req.body.postId
			}
			Post.remove({query},function(err)
			{
				if(err)
				{
					console.log(err);
					return;
				}
				console.log("*");
				res.json({success : "Updated Successfully", status : 200});
			});
		});
	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
	app.route('/postadd')
		.get(isLoggedIn,function(req,res)
		{
			res.sendFile(path+'/public/post_add.html');
		})
		.post(isLoggedIn,function(req,res,next)
		{
			//console.log(req.body);
			var post=new Post({
				val:req.body.question,
				users:req.user._id,
				option:[],
			});
			//this is to save post
			post.save(function(err){
				if(err)
				{
					console.log(err);
					return next;
				}
				for(var i=0;i<req.body.counter;i++)
				{
					post.update({$push:{option:{name:req.body.text[i]}}},{upsert:true},function(err)
					{
						if(err)
						{
							console.log(err);
						}
					});
				}
			});
			res.redirect('/');
		});
	app.route('/link/:id')
		.get(function(req,res,next)
		{
			Post.find({_id:req.params.id},function(err,post)
			{
				if(err)
				{
					console.log(err);
					return next;
				}
				res.render('post',{Post:post});
			});
		});
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
