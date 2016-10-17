'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const bower = require('bower');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');
const sh = require('shelljs');

let paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('clean', function () {
    return gulp.src('./build')
        .pipe(clean());
});

gulp.task('css', function () {
    return gulp.src('./smartsens-web/src/assets/*.css')
        .pipe(cleanCSS())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('./build/assets/css'));
});

gulp.task('images', function () {
    return gulp.src('./smartsens-web/src/assets/images/*.*')
        .pipe(gulp.dest('./build/assets/images'));
});

gulp.task('html', function () {
    return gulp.src('./smartsens-web/src/assets/images/*.*')
        .pipe(gulp.dest('./build/assets/images'));
});

gulp.task('js', function () {
    return gulp.src('./smartsens-web/src/assets/images/*.*')
        .pipe(gulp.dest('./build/assets/images'));
});

gulp.task('watch', function () {
    gulp.watch('./smartsens-web/src/assets/**/*', ['default']);
});

gulp.task('default',  function (cb) {
    return runSequence('clean', ['css', 'images'], cb);
});
