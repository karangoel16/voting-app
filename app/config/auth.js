'use strict';

module.exports = {
	'githubAuth': {
		'clientID': process.GITHUB_KEY,
		'clientSecret': process.GITHUB_SECRET,
		'callbackURL': process.APP_URL + 'auth/github/callback'
	}
};
