/**
 * Created by jan on 15.05.15.
 */
var Studienplan = require('../models/studienplan');
var Password = require('../models/password');
var express = require('express');
var router = express.Router();

var randomstring = require('../lib/randomstring');
var crypto = require('crypto');

router.route('/')
    .get(function (req, res) {
        Studienplan.find(function (err, sp) {
            if (err) {
                return res.send(err);
            }
            res.json(sp);
        });
    }).post(function (req, res) {
        console.log(req.body);
        var sp = new Studienplan(req.body);

        sp.save(function (err) {
            if (err) {
                return res.send(err);
            }
            // Create random password, hash and save hash
            var pass = randomstring.generate(5);
            var shasum = crypto.createHash('sha1');
            shasum.update(pass);
            var password = new Password({sid: sp._id, password: shasum.digest('hex')});
            password.save(function (err) {
                if (err) {
                    return res.send(err);
                }
                res.send({message: 'Studienplan Added', id: sp._id, password: pass});
            });
        });
    });

function validatePass(sid, pass, callback) {
    Password.findOne({sid: sid}, function (error, passw) {
        if (error) {
            callback(error);
            return;
        }
        var shasum = crypto.createHash('sha1');
        shasum.update(pass);
        if (passw.password !== shasum.digest('hex')) {
            callback({error: 'Wrong password!'});
            return;
        }
        callback(false);
    });

}

router.route('/:id').
    put(function (req, res) {
        Studienplan.findOne({_id: req.params.id}, function (err, sp) {
            if (err) {
                return res.send(err);
            }
            if (!('password' in req.body)) {
                return res.send({error: 'Must provide a password!'});
            }
            var sid = sp._id;
            var wanted = req.body.password;
            validatePass(sid, wanted, function (error) {
                if (error) {
                    return res.send(error);
                }
                for (var prop in req.body) {
                    if (prop !== "_id" && prop !== "password" && req.hasOwnProperty(prop)) { //Dont change id / save password
                        sp[prop] = req.body[prop];
                    }
                }
                // save the studienplan
                sp.save(function (err) {
                    if (err) {
                        return res.send(err);
                    }

                    res.json({message: 'Studienplan updated!', id: sid});
                });
            });
        });
    }).get(function (req, res) {
        Studienplan.findOne({_id: req.params.id}, function (err, sp) {
            if (err) {
                return res.send(err);
            }
            if (sp === null) {
                res.status(404).send({error: "not found"});
            }
            else {
                res.json(sp);
            }
        });
    }).delete(function (req, res) {
        if (!('password' in req.body)) {
            return res.send({error: 'Must provide a password!'});
        }
        var sid = req.params.id;
        var wanted = req.body.password;
        validatePass(sid, wanted, function (error) {
            if (error) {
                return res.send(error);
            }

            Studienplan.remove({
                _id: req.params.id
            }, function (err) {
                if (err) {
                    return res.send(err);
                }

                res.json({message: 'Successfully deleted'});
            });
        });
    });
module.exports = router;
