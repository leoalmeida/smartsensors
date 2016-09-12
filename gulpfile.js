'use strict';

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');


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