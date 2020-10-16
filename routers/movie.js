let mongoose = require('mongoose');
var Actor = require('../models/actor');
var Movie = require('../models/movie');

module.exports = {

    //8.Get all movies with the an array containing details of actors
    getAll: function(req,res){
        Movie.find({}).populate('actors').exec(function(err,movies){
            if(err) return res.json(err);

            res.json(movies);
        });
    },

    //6.Retrieve all the movies produced between year1 and year2.
    getSomeMovies: function(req,res){
        Movie.where('year').gte(req.params.year1).lte(req.params.year2).exec(function(err,movies){
            if(err) return res.status(400).json(err);

            res.json(movies);
        })
    },

    createOne: function(req, res){
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function(err, movie){
            if(err) return res.status(400).json(err);

            res.json(movie);
        });
    },

    getOne: function(req, res){
        Movie.findOne({_id: req.params.id}).populate('actors').exec(function(err, movie){
            if(err) return res.status(400).json(err);
            if(!movie) return res.status(404).json();

            res.json(movie);
        });
    },

    updateOne: function(req,res){
        Movie.updateOne({_id: req.params.id}, req.body, function(err, movie){
            if(err) return res.status(400).json(err);
            if(!movie) return res.status(404).json();

            res.json(movie);
        });
    },
//1.Delete a movie by its ID
    deleteOne: function(req, res){
        Movie.findOneAndRemove({_id: req.params.id}, function(err){
            if(err){
                return res.status(400).json(err);
            }
            res.json();
        });
    },

    //9.Delete all the movies that are produced between year1 and year2.
    deleteSome: function(req,res){
       
            let year1=req.body.year1;
            let year2=req.body.year2;
            // console.log(year1,year2);
            Movie.where('year').gte(year2).lte(year1).exec(function(err,movies){
              if(err) return res.status(400).json(err);
              if(!movies) return res.status(404).json();
              
              for(let i=0;i<movies.length;i++){
                Movie.findOneAndRemove({ _id: movies[i]._id }, function (err) {
                  if(err) return res.status(400).json(err);
                });
                
              }
              res.json();
              
            });
          
    },

    //4.Remove an actor from the list of the actors in a movie
    deleteOneActor: function(req,res){
        Movie.findOne({_id:req.params.mid}, function(err, movie){
            if(err) return res.status(400).json(err);
            if(!movie) return res.status(404).json();

            Actor.findOneAndRemove({_id:req.params.aid},function(err){
                if(err) return res.status(400).json(err);

                res.json();
            });
        });
    },

    //5.Add an existing actor to the list of actors in a movie
    addOneActor: function(req,res){
        Movie.findOne({_id:req.params.id},function(err,movie){
            if(err) return res.status(400).json(err);
            if(!movie) return res.status(404).json();

            Actor.findOne({_id:req.body._id},function(err,actor){
                if(err) return res.status(400).json(err);
                if(!actor) return res.status(404).json();

                movie.actors.push(actor._id);
                movie.save(function(err){
                    if(err) return res.status(500).json(err);

                    res.json(movie);
                });
            });
        });
    }
};