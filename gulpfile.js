'use strict';

const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const sass = require('gulp-sass');
const exec = require('child_process').exec;

const config = {
  src: './src',
  dest: './'
};

gulp.task('browser-sync', () => {
  browserSync.init({
    proxy: 'http://localhost:3000',
    port: 4000,
    browser: ['google-chrome'],
    open: false,
    files: ['./views/**/*.ejs', './sass/**/*.scss', './public/js/*.js']
  });
  exec('node app.js', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
  });
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/**.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./sass/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.parallel('browser-sync', 'sass','sass:watch'));