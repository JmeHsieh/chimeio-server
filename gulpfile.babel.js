'use strict'

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const cache = require('gulp-cached');

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
  let stream = nodemon({script: 'dist/', watch: 'src', tasks: ['compile']}).on('restart', () => {
    console.log('restarted');
  });
  return stream;
});

// gulp.task('default', () =>
//     gulp.src('src/**/*.js')
//         .pipe(sourcemaps.init())
//         .pipe(babel())
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('dist'))
// );
