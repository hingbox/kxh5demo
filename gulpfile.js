var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var del = require('del');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gzip = require('gulp-gzip');

var paths = {
  scripts:[
  './public/js/polyfill.js',
  './public/js/messenger.js',
  './public/js/zepto.cookie.js',
  './public/js/elab.js',
  './public/js/zepto.refresher.js',
  './public/js/zepto.qrcode.js',
  './public/js/zepto.currencyformat.js',
  './public/js/zepto.imgreview.js',
  './public/js/zepto.commentinput.js',
  './public/js/zepto.imageupload.js',
  './public/js/zepto.datepicker.js',
  './public/js/zepto.stepselector.js',
  './public/js/zepto.slider.js',
  './public/js/zepto.imgcompare.js',
  './public/js/console-security-message.js'
  ],

  css:[
    './public/css/base.css',
    './public/css/style.css',
    './public/css/elab.css'
  ]
};

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del([
    'public/dist/all.min.js',
    'public/dist/all.min.css'
  ]);
});


gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(concat('all.min.js', {newLine: ';'}))
    .pipe(uglify().on('error', gutil.log))
    //.pipe(gzip({ gzipOptions: { level: 3 } }))
    .pipe(gulp.dest('public/dist'));
});

gulp.task('css', ['clean'], function() {
  // Minify and copy all CSS
  // with sourcemaps all the way down
  return gulp.src(paths.css)
    .pipe(concat('all.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.css, ['css']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'css']);
