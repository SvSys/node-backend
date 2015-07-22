/**
 * Created by jan on 22.07.15.
 */
var express = require('express');
var router = express.Router();
var ensure = require('../middleware/ensureAuth');
var config = require('../config');
var request = require('request');

router.route('/me').get(function(req, res) {

});

router.route('/auth/facebook').post(function(req, res) {
    var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.3/me';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.FACEBOOK_SECRET,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
        if (response.statusCode !== 200) {
            return res.status(500).send({ message: accessToken.error.message });
        }

        // Step 2. Retrieve profile information about the current user.
        request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
            if (response.statusCode !== 200) {
                return res.status(500).send({ message: profile.error.message });
            }
            console.log(profile.name);
            res.send(profile);
            /*
             user.facebook = profile.id;
             user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
             user.displayName = profile.name;
             */
        });
    });
});

module.exports = router;
