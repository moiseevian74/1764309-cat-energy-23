const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const imagemin = require("gulp-imagemin");
const sync = require("browser-sync").create();


// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("docs/css"))
    .pipe(sync.stream());
}

const stylesBuild = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("docs/css"));
}

exports.stylesBuild = stylesBuild;

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('docs'));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src('source/js/app.js')
  .pipe(terser())
  .pipe(rename("app.min.js"))
  .pipe(gulp.dest('docs/js'));
}

exports.scripts = scripts;

// Images

const optimazeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(imagemin())
  .pipe(gulp.dest('docs/img'));
}

exports.optimazeImages = optimazeImages;

const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(gulp.dest('docs/img'));
}

exports.copyImages = copyImages;

// Webp

const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest('docs/img'));
}

exports.createWebp = createWebp;

// Sprite

const createSprite = () => {
  return gulp.src('source/img/**/*.svg')
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('docs/img'));
}

exports.createSprite = createSprite;

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/img/**/*.svg',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('docs'))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del('docs');
};

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'docs'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

exports.reload = reload;

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/app.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

const build = gulp.series(
  clean,
  copy,
  optimazeImages,
  gulp.parallel(
    stylesBuild,
    html,
    scripts,
    createSprite,
    createWebp
  ),
);

exports.build = build;


// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createSprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
