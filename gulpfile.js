const { src, dest, series, watch } = require('gulp');

// styles
const scss = require('gulp-sass')(require('sass'));
const autoPrefixer = require('gulp-autoprefixer');
const cssMinify = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');

function styles() {
    return src('./frontend/src/styles/**/*.scss')
        .pipe(scss())
        .pipe(autoPrefixer('last 2 versions'))
        .pipe(cssMinify())
        .pipe(dest('./frontend/dist/styles/'))
}

// scripts
const jsMinify = require('gulp-terser');

function scripts() {
    return src('./frontend/src/scripts/**/*.js')
        .pipe(jsMinify())
        .pipe(dest('./frontend/dist/scripts/'))
}

//optimize and move images
function optimizeimg() {
    return src('./frontend/src/images/*' , {encoding: false}) 
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
        .pipe(dest('./frontend/dist/images'))
}

//optimize and move images
function webpImage() {
    return src('./frontend/dist/images/*.{jpg,png}')
        .pipe(imagewebp())
        .pipe(dest('./frontend/dist/images'))
};

function watchTask() {
    watch(
            [
            './frontend/src/styles/**/*.scss',
            './frontend/src/scripts/**/*.js'
            ],
            series(styles, scripts)
        )
}

exports.default = series(styles, scripts, optimizeimg, webpImage, watchTask);