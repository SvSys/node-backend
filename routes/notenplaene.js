/**
 * Created by jan on 15.05.15.
 */
var Notenplan = require('../models/notenplan');
var Password = require('../models/password');
var express = require('express');
var router = express.Router();

var crypto = require('crypto');

router.route('/')
    .get(function (req, res) {
        Notenplan.find(function (err, sp) {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(sp);
        });
    }).post(function (req, res) {
        console.log(req.body);
        var sp = new Notenplan(req.body);

        sp.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.send({message: 'Notenplan Added', id: sp._id});
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
        Notenplan.findOne({_id: req.params.id}, function (err, np) {
            if (err) {
                return res.send(err);
            }
            if (!('password' in req.body)) {
                return res.status(401).send({error: 'Must provide a password!'});
            }
            var sid = np.sid;
            var wanted = req.body.password;
            validatePass(sid, wanted, function (error) {
                if (error) {
                    return res.status(500).send(error);
                }
                for (var prop in req.body) {
                    if (prop !== "_id" && prop !== "password" && req.hasOwnProperty(prop)) { //Dont change id / save password
                        np[prop] = req.body[prop];
                    }
                }
                // save the notenplan
                np.save(function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.json({message: 'Notenplan updated!', id: req.params.id});
                });
            });
        });
    }).get(function (req, res) {
        Notenplan.findOne({_id: req.params.id}, function (err, sp) {
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
            return res.status(401).send({error: 'Must provide a password!'});
        }
        var nid = req.params.id;
        var wanted = req.body.password;
        Notenplan.findOne({_id: nid}, function (err, sp) {
            if (err) {
                return res.send(err);
            }
            var sid = sp.sid;
            validatePass(sid, wanted, function (error) {
                if (error) {
                    return res.send(error);
                }
                Notenplan.remove({
                    _id: nid
                }, function (err) {
                    if (err) {
                        return res.send(err);
                    }

                    res.json({message: 'Successfully deleted'});
                });
            });
        });
    });
module.exports = router;
