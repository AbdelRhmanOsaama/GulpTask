const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cleanCss = require('gulp-clean-css');
const browserSync = require('browser-sync');


var globs = {
  html: "project/*.html",
  css: "project/css/**/*.css",
  img: 'project/pics/*',
  js: 'project/js/**/*.js'
}

function imgMinify() {
  return gulp.src(globs.img).pipe(imagemin()).pipe(gulp.dest('dist/images'));
}
exports.img = imgMinify

function minifyHTML() {
  return src(globs.html).pipe(htmlmin({collapseWhitespace: true, removeComments: true})).pipe(gulp.dest('dist'))
}
exports.html = minifyHTML

function jsMinify() {
  return src(globs.js, { sourcemaps: true }).pipe(concat('all.min.js')).pipe(terser()).pipe(dest('dist/assets/js', { sourcemaps: '.' }))
}
exports.js = jsMinify

function cssMinify() {
  return src(globs.css).pipe(concat('style.min.css')).pipe(cleanCss()).pipe(dest('dist/assets/css'))
}
exports.css = cssMinify

function serve(cb) {
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}

function watchTask() {
  watch(globs.html, series(minifyHTML, reloadTask))
  watch(globs.js, series(jsMinify, reloadTask))
  watch(globs.css, series(cssMinify, reloadTask));
  watch(globs.img, series(imgMinify, reloadTask));
}
exports.default = series(parallel(imgMinify,jsMinify,cssMinify,minifyHTML),serve,watchTask)




