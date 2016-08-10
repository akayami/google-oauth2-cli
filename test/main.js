var auth = require('../index.js');
var conf = require('./conf/conf.js');
var merge = require('merge');

describe('Basic tests for google-oauth-cli module', function() {
	it('Needs to error out if called without parameter', function(done) {
		this.timeout(500);
		var c = conf.oauth2CLI;
		auth(c, function(err, auth) {
			if(err) {
				if(err.code == 'ENOENT') {
					done();
				} else {
					done(err);
				}
			} else {
				done();
			}
		});
	});
	it('Needs to atempt to generate url if called with parameter', function(done) {
		this.timeout(15000);
		var c = merge(true, conf.oauth2CLI, {requestToken: true});
		auth(c, function(err, auth) {
			done(err);
		});
	});
	it('Needs to generate auth correctly', function(done) {
		this.timeout(15000);
		auth(conf.oauth2CLI, function(err, auth) {
			done(err);
		});
	});
})
