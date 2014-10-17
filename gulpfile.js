var gulp = require('gulp'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    nodemon = require('gulp-nodemon'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed'),
    log = util.log;

var paths = {
  scripts: ['./client/**/*.js'],
  images: ['./assets/images/**/*'],
  sass: ['./assets/sass/**/*.js'],
  server: './bin/www'
};

// Start server and watch for changes.
gulp.task('default', ['server', 'watch']);

// Start node server
gulp.task('server', function() {
  log("Start node server " + (new Date()).toString());
  nodemon({
    script: paths.server,
    env: { 'NODE_ENV': 'development' }
  });
});

// Compile all pre-processed assets.
gulp.task('build', ['jshint', 'scripts', 'sass', 'imagemin']);

// Watch for changes in pre-processed source files and re-build if changed.
gulp.task('watch', function() {
  log("Watching scss files for modifications");
  gulp.watch([paths.sass, paths.scripts], ['build']);
});

// Minimize and compress images.
gulp.task('imagemin', function() {
  gulp.src(paths.images)
      .pipe(changed('./public/images'))
      .pipe(imagemin())
      .pipe(gulp.dest('./public/images'))
});

// Lint all javascripts.
gulp.task('jshint', function() {
  gulp.src(paths.scripts)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
});

// Concatenate and compress javascripts.
gulp.task('scripts', function() {
  log("Generate JS files " + (new Date()).toString());
  gulp.src(paths.scripts)
      .pipe(concat('application.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./public/javascripts'))
});

// Concatenate and compress sass into css.
gulp.task('sass', function() {
  log("Generate CSS files " + (new Date()).toString());
  gulp.src(paths.sass)
      .pipe(concat('application.scss'))
      .pipe(sass({ style: 'expanded' }))
      .pipe(autoprefixer("last 3 version", "safari 5", "ie 8", "ie 9"))
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifycss())
      .pipe(gulp.dest('./public/stylesheets'));
});
