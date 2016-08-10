module.exports = {
	oauth2CLI: {
		client_secret: __dirname + '/client_secret.json',
		scopes: [
			'https://www.googleapis.com/auth/admin.directory.group.readonly',
			'https://www.googleapis.com/auth/admin.directory.group'
		],
		token_dir: __dirname + '/credentials/'
	}
}
