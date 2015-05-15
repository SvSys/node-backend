/**
 * Created by jan on 15.05.15.
 */
var Studienplan = require('../models/studienplan');
var express = require('express');
var router = express.Router();

router.route('/studienplan')
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
            res.send({message: 'Studienplan Added', id: sp._id});
        });
    });
router.route('/studienplan/:id').
    put(function (req, res) {
        Studienplan.findOne({_id: req.params.id}, function (err, sp) {
            if (err) {
                return res.send(err);
            }

            for (prop in req.body) {
                sp[prop] = req.body[prop];
            }

            // save the movie
            sp.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                res.json({message: 'Studienplan updated!'});
            });
        });
    }).get(function (req, res) {
        Studienplan.findOne({_id: req.params.id}, function (err, sp) {
            if (err) {
                return res.send(err);
            }
            if (sp == null) {
                res.status(404).send({error: "not found"});
            }
            else
                res.json(sp);
        });
    }).delete(function (req, res) {
        Studienplan.remove({
            _id: req.params.id
        }, function (err, sp) {
            if (err) {

                return res.send(err);
            }

            res.json({message: 'Successfully deleted'});
        });
    });
module.exports = router;
