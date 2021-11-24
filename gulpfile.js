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
  return gulp.src("docs/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

const stylesBuild = () => {
  return gulp.src("docs/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"));
}

exports.stylesBuild = stylesBuild;

// HTML

const html = () => {
  return gulp.src('docs/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src('docs/js/app.js')
  .pipe(terser())
  .pipe(rename("app.min.js"))
  .pipe(gulp.dest('build/js'));
}

exports.scripts = scripts;

// Images

const optimazeImages = () => {
  return gulp.src('docs/img/**/*.{png,jpg,svg}')
  .pipe(imagemin())
  .pipe(gulp.dest('build/img'));
}

exports.optimazeImages = optimazeImages;

const copyImages = () => {
  return gulp.src('docs/img/**/*.{png,jpg,svg}')
  .pipe(gulp.dest('build/img'));
}

exports.copyImages = copyImages;

// Webp

const createWebp = () => {
  return gulp.src('docs/img/**/*.{png,jpg}')
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest('build/img'));
}

exports.createWebp = createWebp;

// Sprite

const createSprite = () => {
  return gulp.src('docs/img/**/*.svg')
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

exports.createSprite = createSprite;

// Copy

const copy = (done) => {
  gulp.src([
    'docs/fonts/*.{woff2,woff}',
    'docs/*.ico',
    'docs/img/**/*.svg',
  ], {
    base: 'docs'
  })
    .pipe(gulp.dest('build'))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del('build');
};

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
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
  gulp.watch('docs/less/**/*.less', gulp.series(styles));
  gulp.watch('docs/js/app.js', gulp.series(scripts));
  gulp.watch('docs/*.html', gulp.series(html, reload));
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
