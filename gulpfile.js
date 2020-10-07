const gulp = require('gulp');
const fs = require('fs');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
// var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const replace = require('gulp-replace');
// const imageminOptipng = require('imagemin-optipng');


// gulp.task("html", function () {
//   return gulp.src('src/*.html')
//     .pipe(gulp.dest('dist'))
//     .pipe(scripts())
// })
const files = {
  html: ['src/*.html'],
  scripts: ['src/main.js', 'src/config.js', 'src/drag.js'],
  images: ['python/*.png'],
}


gulp.task("js", function () {
  return scripts()
})

function html() {
  return gulp.src(files.html)
    .pipe(gulp.dest('dist'))
}

function htmlPublish() {
  let time = new Date().getTime()
  return gulp.src(files.html)
    .pipe(replace('{{{publishtime}}}', time))
    .pipe(replace('{{{publishscript}}}', `
    <script type="text/javascript">
        window.___publish = true;
        window.___publishtime = ${time};
    </script>`))
    .pipe(gulp.dest('dist'))
}

function scripts() {
  // return gulp.src(['main.js', 'config.js'], { sourcemaps: true })
  return gulp.src(files.scripts)
    // .pipe(babel({
    //   presets: ['@babel/env']
    // }))
    // .pipe(uglify())
    // .pipe(concat('main.min.js'))
    .pipe(gulp.dest('dist'));
}

function scriptsMin() {
  // return gulp.src(['main.js', 'config.js'], { sourcemaps: true })
  return gulp.src(files.scripts)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    // .pipe(concat('main.min.js'))
    .pipe(gulp.dest('dist'));
}

function imagesMin() {
  // return gulp.src(['main.js', 'config.js'], { sourcemaps: true })
  return gulp.src(files.images)
    .pipe(imagemin())
    .pipe(gulp.dest('dist'));
}

function others() {
  // return gulp.src(['main.js', 'config.js'], { sourcemaps: true })
  fs.copyFileSync("python/cards_150.json", "dist/cards_150.json")
  fs.copyFileSync("python/cards_150.png", "dist/cards_150.png")
  fs.copyFileSync("python/cards_150_cn.json", "dist/cards_150_cn.json")
  fs.copyFileSync("python/cards_150_cn.png", "dist/cards_150_cn.png")
  fs.copyFileSync("python/miniontype.json", "dist/miniontype.json")
  // fs.copyFileSync("src/icon.ico", "dist/icon.ico");
  return gulp.src(['src/icon.ico'])
    .pipe(gulp.dest('dist'));
}


function libs() {
  // return gulp.src(['main.js', 'config.js'], { sourcemaps: true })
  return gulp.src(['src/lib/**/*', 'src/css/**/*'], {
    base: 'src'
  })
    .pipe(gulp.dest('dist'));
}

gulp.task('build', gulp.series(html, scripts, libs, others))
gulp.task('publish', gulp.series(htmlPublish, scriptsMin, libs, others, imagesMin))

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  gulp.watch(files.html, html).on('change', browserSync.reload);
  gulp.watch(files.scripts, scripts).on('change', browserSync.reload);
});
