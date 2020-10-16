const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const movie = require('./models/movie');
const path = require('path');

const actors = require('./routers/actor');
const movies = require('./routers/movie');

const app = express();

app.listen(8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use("/", express.static(path.join(__dirname, "dist/lab9Ang")));

mongoose.connect('mongodb://localhost:27017/moviesDB', { useUnifiedTopology: true, useNewUrlParser: true },function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');

});


 //7.Get all actors and the array of movies that contains all the details of movies
app.get('/actors',actors.getAll);
app.post('/actors',actors.createOne);
app.get('/actors/:id',actors.getOne);
app.post('/actors/:id',actors.addMovie);
//3.Remove a movie from the list of movies of an actor
app.delete('/actors/:aid/:mid',actors.deleteOneMovie);
 //2.Delete an actor and all its movies
app.delete('/actors/:id', actors.deleteOneAndMovies);
//Extra task
app.put('/actors/:id',actors.updateOne);


//8.Get all movies with the an array containing details of actors
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);
//1.Delete a movie by its ID
app.delete('/movies/:id', movies.deleteOne);
//4.Remove an actor from the list of the actors in a movie
app.delete('/movies/:mid/:aid',movies.deleteOneActor); 
//5.Add an existing actor to the list of actors in a movie
app.post('/movies/:id',movies.addOneActor);
//6.Retrieve all the movies produced between year1 and year2.
app.get('/movies/:year1/:year2',movies.getSomeMovies);
 //9.Delete all the movies that are produced before year2.
app.put('/movies',movies.deleteSome);
