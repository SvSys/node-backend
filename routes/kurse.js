/**
 * Created by jan on 22.07.15.
 */
var express = require('express');
var router = express.Router();
var ensure = require('../middleware/ensureAuth');
var config = require('../config');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');

var Kurs = require('../models/kurs');

router.route('/kurs/:id').put(ensure.ensureAuthenticated, function (req, res) {
    var kursid = req.params.id;
    var name = req.user.name;
    Kurs.findOne({kurs_id: kursid}, function (err, kurs) {
        if (err) {
            return res.send(err);
        }
        if (kurs === null || typeof(kurs) === 'undefined') {
            return res.status(404).send({error: "not found"});
        }
        Kurs.find({leiste: kurs.leiste, schueler: name}, function (err, kurs2) {
            if (err) {
                return res.send(err);
            }

            if (kurs2 !== null && kurs2.length > 0) {
                return res.status(420).send({error: "leiste_belegt"});
            }
            if (Array.isArray(kurs.schueler))
                kurs.schueler.push(name);
            else
                kurs.schueler = [name];

            kurs.save(function (err) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.json({message: 'You have been added!'});
            });
        })

    });
}).get(function (req, res) {
    var kursid = req.params.id;
    Kurs.findOne({kurs_id: kursid}, function (err, kurs) {
        if (err) {
            return res.send(err);
        }
        if (kurs === null || typeof(kurs) === 'undefined') {
            return res.status(404).send({error: "not found"});
        }

        return res.send(kurs);
    });
});

/**
 *
 * Debugging only!
 *
 router.route('/kurs/').post(function (req, res) {
    var kurs = new Kurs(req.body);

    kurs.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.send({message: 'Kurs hinzugefügt', id: kurs.kurs_id});
    });

});
 */

router.route('/').get(function (req, res) {
    Kurs.find({}, '-_id -__v', function (err, kurse) {
        var kursMap = [];

        kurse.forEach(function (kurs) {
            kursMap.push(kurs);
        });

        res.send(kursMap);
    });
});


router.route('/auth/facebook').post(function (req, res) {
    var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.3/me';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.FACEBOOK_SECRET,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({url: accessTokenUrl, qs: params, json: true}, function (err, response, accessToken) {
        if (response.statusCode !== 200) {
            return res.status(500).send({message: accessToken.error.message});
        }

        // Step 2. Retrieve profile information about the current user.
        request.get({url: graphApiUrl, qs: accessToken, json: true}, function (err, response, profile) {
            if (response.statusCode !== 200) {
                return res.status(500).send({message: profile.error.message});
            }
            var user = {
                'name': profile.name,
                'id': profile.id,
                'picture': 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large'
            };
            var token = createJWT(user);
            return res.send({'token': token});
            /*
             user.facebook = profile.id;
             user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
             user.displayName = profile.name;
             */
        });
    });
});

function createJWT(user) {
    var payload = {
        sub: user,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

module.exports = router;
