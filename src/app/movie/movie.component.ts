import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../database.service";

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  moviesDB: any[] = [];
  section = 1;
  title: string = "";
  year: number = 0;
  movieId: string = "";
  aYear: number = 0;

  constructor(private dbService: DatabaseService) { }

  onGetMovies() {
    this.dbService.getMovies().subscribe((data: any[]) => {
      this.moviesDB = data;
    });
  }
  onSaveMovie() {
    let obj = { title: this.title, year: this.year };
    this.dbService.createMovie(obj).subscribe(result => {
      this.onGetMovies();
    });
  }
  onDeleteMovie(item) {
    this.dbService.deleteMovie(item._id).subscribe(result => {
      this.onGetMovies();
    });
  }

  onDeleteMoviesByYear(aYear){
    let obj={year1:this.aYear, year2:0}
    this.dbService.deleteMoviesByYear(obj).subscribe(result =>{
      this.onGetMovies();
    });
  }

  ngOnInit(): void {
    this.onGetMovies();
  }

  changeSection(sectionId) {
    this.section = sectionId;
    this.resetValues();
  }
  resetValues() {
    this.title = "";
    this.year = 0;
    this.movieId = "";
  }

  onSelectUpdate(item) {
    this.title = item.title;
    this.year = item.year;
    this.movieId = item._id;
  }

}
