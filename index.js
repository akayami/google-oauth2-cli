var fs = require('fs');
var readline = require('readline');
var googleAuth = require('google-auth-library');
var crypto = require('crypto');

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, options) {
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

	// Check if we have previously stored a token.
	fs.readFile(options.token_path, function(err, token) {
		if (err) {
			//console.log(options);
//			console.log(options.requestToken === true);
			if(options.requestToken === true) {
				getNewToken(oauth2Client, options, callback);
			} else {
				return callback(err);
			}
		} else {
			oauth2Client.credentials = JSON.parse(token);
			return callback(null, oauth2Client);
		}
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, options, callback) {
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: options.scopes
	});
	console.log('Authorize this app by visiting this url: ', authUrl);
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.question('Enter the code from that page here: ', function(code) {
		rl.close();
		oauth2Client.getToken(code, function(err, token) {
			if(err) {
				return callback(err);
			}
			oauth2Client.credentials = token;
			storeToken(token, options);
			callback(null, oauth2Client);
		});
	});
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token, options) {
	try {
		fs.mkdirSync(options.token_dir);
	} catch (err) {
		if (err.code != 'EEXIST') {
			throw err;
		}
	}
	fs.writeFile(options.token_path, JSON.stringify(token));
}

module.exports = function(options, cb) {
	fs.readFile(options.client_secret, function (err, content) {
		if (err) {
			return cb(err);
		}
		//Authorize a client with the loaded credentials, then call callback with auth
		var fname = crypto.createHash('md5');
		fname.update(content + JSON.stringify(options.scopes));
		options.token_path = options.token_dir + '/' + fname.digest('hex');

		authorize(JSON.parse(content), function(err, auth) {
			cb(err, auth)
		}, options);
	});
}
