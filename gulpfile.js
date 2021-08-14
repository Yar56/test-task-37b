const project_folder = 'dist';
const source_folder = 'src';
// const fs = require('fs');

let path = {
  build: {
    html: `${project_folder}/`,
    css: `${project_folder}/css/`,
    img: `${project_folder}/img/`,
    fonts: `${project_folder}/fonts/`,
  },
  src: {
    html: `${source_folder}/*.html`,
    css: `${source_folder}/sass/style.sass`,
    img: `${source_folder}/img/**/*.{jpg,png,svg,gif,webp}`,
    fonts: `${source_folder}/fonts/*.ttf`,
  },
  watch: {
    html: `${source_folder}/*.html`,
    css: `${source_folder}/sass/**/*.sass`,
    img: `${source_folder}/img/**/*.{jpg,png,svg,gif,webp}`,
  },
  clean: `./${project_folder}/`,
}

const { src, dest } = require('gulp');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
// const imagemin = require('gulp-imagemin');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

function browserSyncFunc(params) {
  browserSync.init({
    server: {
      baseDir: `./${project_folder}/`,
    },
    port: 3000,
    notify: false,
  })
}

// function images(params) {
//   return src(path.src.img)
//     .pipe(
//       imagemin({
//         interlaced: true,
//         progressive: true,
//         optimizationLevel: 4,
//         svgoPlugins: [{ removeViewBox: true }],
//       })
//     )
//     .pipe(dest(path.build.img))
//     .pipe(browserSync.stream())
// }

function html(params) {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream())
}

function css(params) {
  return src(path.src.css)
    .pipe(
      sass({
        outputStyle: 'expanded',
        includePaths: ['node_modules']
      })
    )
    .pipe(
      groupMedia()
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(cleanCSS())
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream())
}

function fonts(params) {
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}

// function fontsStyle(params) {
//   let file_content = fs.readFileSync(`${source_folder}/sass/fonts.sass`);
//   if (file_content === '') {
//     fs.writeFile(`${source_folder}/sass/fonts.sass`, '', cb);
//     return fs.readdir(path.build.fonts, function (err, items) {
//       if (items) {
//         let c_fontname;
//         for (var i = 0; i < items.length; i++) {
//           let fontname = items[i].split('.');
//           fontname = fontname[0];
//           if (c_fontname !== fontname) {
//             fs.appendFile(`${source_folder}/sass/fonts.sass`, `@include font("${fontname}", "${fontname}", "400", "normal")\r\n`, cb);
//           }
//           c_fontname = fontname;
//         }
//       }
//     })
//   }
// }

function cb(params) {}

function watchFiles(params) {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  // gulp.watch([path.watch.img], images)
}

function clean(params) {
  return del(path.clean)
}

const build = gulp.series(clean, gulp.parallel(html, css, fonts)); // images, fontsSyle
const watch = gulp.parallel(build, watchFiles, browserSyncFunc);
const onlyBuild = gulp.series(clean, build)

// exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
// exports.images = images;
exports.css = css;
exports.html = html;
exports.onlyBuild = build;
exports.build = build;
exports.watch = watch;
exports.default = watch;