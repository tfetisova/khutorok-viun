const gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    browserSync = require('browser-sync'),
    minifyjs = require('gulp-js-minify'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin');

const path = {
    build: {
        css: 'build/css/',
        js: 'build/js/',
        img: 'build/img/',
        video: 'build/video/'

    },
    src: {
        scss: 'src/scss/**/*.scss',
        js: 'src/js/**/*.js',
        script: 'src/js/script.js',
        img: 'src/img/**/*',
        video: 'src/video/**/*'
    },
    clean: './build/'
};

const videoBuild = () => {
    return gulp.src(path.src.video)
        .pipe(gulp.dest(path.build.video))
};
const scssBuild = () => {
    return gulp.src(path.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 100 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.build.css))
};

const jsBuild = () => {
    return gulp.src(path.src.js)
        // .pipe(concat('script.js'))
        .pipe(gulp.dest(path.build.js))
};

const cleanBuild = () => {
    return gulp.src(path.clean, {allowEmpty: true})
        .pipe(clean())
};

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(path.src.scss, scssBuild).on('change', browserSync.reload);
    gulp.watch(path.src.js, jsBuild).on('change', browserSync.reload);
    gulp.watch(path.src.video, videoBuild).on('change', browserSync.reload);
    gulp.watch(path.src.img, imgMinify).on('change', browserSync.reload);
};
const jsMinify = () => {
    return gulp.src(path.src.script)
        .pipe(minifyjs())
        .pipe(gulp.dest(path.build.js));
};
const cssMinify = () => {
    return gulp.src(path.build.css)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(path.build.css));
};
const imgMinify = () => {
    return gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
};

gulp.task('build', gulp.series(
    cleanBuild,
    videoBuild,
    scssBuild,
    cssMinify,
    jsBuild,
    jsMinify,
    imgMinify,
    watcher
));
