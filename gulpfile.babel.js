'use strict'

const babel = require('gulp-babel');
const cache = require('gulp-cached');
const exec = require('child_process').exec;
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const sourcemaps = require('gulp-sourcemaps');


gulp.task('compile', () => {
  let stream = gulp.src('src/**/*.js')
                   .pipe(cache())
                   .pipe(sourcemaps.init())
                   .pipe(babel())
                   .pipe(sourcemaps.write('.'))
                   .pipe(gulp.dest('dist'));
  return stream;
});

gulp.task('watch', ['compile'], () => {
  let stream = nodemon({script: 'dist/', watch: 'src', tasks: ['compile']})
                .on('restart', () => {
                  console.log('restarted');
                });
  return stream;
});

gulp.task('node', ['compile'], (cb) => {
  exec('node dist/', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
