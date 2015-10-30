'use strict';

var gulp = require('gulp'),
    bowerFiles = require('main-bower-files'),
    del = require('del'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    inject = require('gulp-inject'),
    angularFilesort = require('gulp-angular-filesort'),
    es = require('event-stream');

var task = {};

var paths = {
  sass : './assets/sass/**/*.scss',
  css : './assets/css/**/*.css'
};

var sassFiles = gulp.src('./assets/sass/**/*.scss', {base: './assets/sass'});
var cssFiles = gulp.src('./assets/css/**/*.css', {base: './assets/css'});
var imgFiles = gulp.src('./assets/img/**/*', {base: './assets/img'});

function compileSass(){
  return sassFiles.pipe(sass().on('error', sass.logError));
}

// Task to clean the assets folder
gulp.task('clean', function () {
  return del('./client/assets/*');
});

// Task to compile the SASS files
gulp.task('sass', task.sass = function() {
  del('./client/assets/**/*.css');
  return es.merge(compileSass(), cssFiles).pipe(gulp.dest('./client/assets'));
});

// Task to compile the SASS files with previous cleaning
gulp.task('sass:build', ['clean'], task.sass);

// Task to compile and minify the SASS files with previous cleaning
gulp.task('sass:dist', ['clean'], function() {
  del('./client/assets/**/*.css');
  return es.merge(compileSass(), cssFiles).pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./client/assets/'));
});

// Copy all the imgs
gulp.task('img', task.img = function() {
  return imgFiles.pipe(gulp.dest('./client/assets/'));
});

// Mirror the img task for build and dist (previous cleaning)
gulp.task('img:build', ['clean'], task.img);
gulp.task('img:dist', ['clean'], task.img);

// Task to inject the files after compiling the assets during build
gulp.task('inject:build', ['sass:build'], function() {
  gulp.src('./client/index.html')
    .pipe(inject(es.merge(
      gulp.src('./client/assets/**/*.css', {read: false}),
      gulp.src(['./client/**/*.js', '!./client/components/**/*']).pipe(angularFilesort()),
      gulp.src(bowerFiles(), {read: false})
    ), {
      starttag : "<!-- {{ext}} files -->",
      endtag: "<!-- end {{ext}} files -->",
      relative: true
    }))
    .pipe(gulp.dest('./client/'));
});

// Task to inject the files after compiling and minifying the assets
gulp.task('inject:dist', ['sass:dist'], function() {
  gulp.src('./client/index.html')
    .pipe(inject(es.merge(
      gulp.src('./client/assets/**/*.css', {read: false}),
      gulp.src(['./client/**/*.js', '!./client/components/**/*']).pipe(angularFilesort()),
      gulp.src(bowerFiles(), {read: false})
    ), {
      starttag : "<!-- {{ext}} files -->",
      endtag: "<!-- end {{ext}} files -->",
      relative: true
    }))
    .pipe(gulp.dest('./client/'));
});

// Build and distribution pipelines
gulp.task('build', ['clean', 'sass:build', 'img:build', 'inject:build']);
gulp.task('dist', ['clean', 'sass:dist', 'img:dist', 'inject:dist']);

// Watch tasks
gulp.task('watch', ['build'], function() {
  gulp.watch([paths.sass, paths.css], ['sass']);
  gulp.watch(paths.img, ['img']);
});

// Default tasks
gulp.task('default', ['build']);
