var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


gulp.task('default', function () {
  console.log("witaj w kodu.je!");
  console.log("hej");
});

gulp.task('sass', function () {
  return gulp.src('./src/scss/main.scss')
    .pipe(sass({
        "errLogToConsole": true
      })
      .on('error', sass.logError)
    )
    .pipe(autoprefixer({
      "browsers": [
        "ie >= 6"
      ]
    }))
    .pipe(cssnano())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function () {
  return browserify('./src/js/main.js')
    .transform('babelify', {
      presets: ['es2015']
    })
    .bundle()
    .pipe(source('main.js', './dist/js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('browserSync', function () {
  return browserSync({
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('copy:html', function () {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
  return del(['./dist/css', './dist/*.html']);
});

gulp.task('build', function () {
  return runSequence('clean', ['sass', 'copy:html']);
});

gulp.task('dev', ['browserSync'], function () {
  gulp.watch('./src/js/**/*.js', ['js', browserSync.reload]);
  gulp.watch('./src/scss/**/*.scss', ['sass', browserSync.reload]);
  gulp.watch('./src/*.html', ['copy:html', browserSync.reload]);
});