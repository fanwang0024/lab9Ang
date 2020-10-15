const mongoose = require('mongoose');

const Actor = require('../models/actor');
const Movie = require('../models/movie');

module.exports = {

    //7.Get all actors and the array of movies that contains all the details of movies
    getAll: function(req,res){
        Actor.find({}).populate('movies').exec(function(err,actors){
            if(err) return res.json(err);

            res.json(actors);
        });
    },

    createOne: function(req, res){
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();

        let actor = new Actor(newActorDetails);
        actor.save(function (err){
            console.log('Done');
            res.json(actor);
        });
    },

    getOne: function(req, res){
        Actor.findOne({_id:req.params.id}).populate('movies').exec(function(err, actor){
            if(err) return res.json(err);
            if(!actor) return res.json();
            res.json(actor);
        });

    },

    deleteOne: function(req, res){
        Actor.findOneAndRemove({_id: req.params.id}, function(err){
            if(err){
                return res.status(400).json(err);
            }
            res.json();
        });
    },

    //2.Delete an actor and all its movies
    deleteOneAndMovies: function(req,res){
        Actor.findOne({_id:req.params.id}, function(err, actor){
            if(err) return res.status(400).json(err);

            for(let i=0; i<actor.movies.length; i++){
                Movie.findByIdAndRemove({_id:actor.movies[i]._id}, function(err){
                    if(err) return res.status(400).json(err);

                    res.json();
                });
            }
            Actor.findByIdAndRemove({_id:req.params.id}, function(err){
                if(err) return res.status(400).json(err);

                res.json();
            });
        });
    },

    addMovie: function(req, res){
        Actor.findOne({_id: req.params.id}, function(err,actor){
            if(err) return res.status(400).json(err);
            if(!actor) return res.status(404).json();

            Movie.findOne({_id:req.body._id}, function(err,movie){
                if(err) return res.status(400).json(err);
                if(!movie) return res.status(404).json();

                actor.movies.push(movie._id);
                actor.save(function(err){
                    if(err) return res.status(500).json(err);

                    res.json(actor);
                });
            });

        });
    },
    //3.Remove a movie from the list of movies of an actor
    deleteOneMovie: function(req,res){
        Actor.findOne({_id:req.params.aid}, function(err, actor){
            if(err) return res.status(400).json(err);
            if(!actor) return res.status(404).json();

            Movie.findOneAndRemove({_id:req.params.mid},function(err){
                if(err) return res.status(400).json(err);

                res.json();
            });
        });
    },

   /* clearMovies: function(req,res){
        Actor.findOneAndUpdate({_id: req.params.id},{movies:[]}, function(err,actor){
            if(err) return res.status(400).json(err);
            if(!actor) return res.status(404).json();

            res.json(actor);
        });
    },*/

    updateOne: function (req, res) {
        Actor.findOneAndUpdate({
          _id: req.params.id
        }, req.body, function (
          err,
          actor
        ) {
          if (err) return res.status(400).json(err);
          if (!actor) return res.status(404).json();
    
          res.json(actor);
        });
      },



};