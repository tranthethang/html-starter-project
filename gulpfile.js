const {src, dest, parallel, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const babel = require('gulp-babel');

const paths = {
    styles: {
        src: './src/sass/**/*.sass',
        dest: './dist/assets/css/'
    },
    pug: {
        src: './src/tpl/**/[^_]*.pug',
        dest: './dist/'
    },
    script: {
        src: './src/js/**/*.js',
        dest: './dist/assets/js/'
    }
};

const style = () => {
    return src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(postcss([autoprefixer()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.styles.dest))
        .pipe(browserSync.stream());
};

const html = () => {
    return src(paths.pug.src)
        .pipe(
            pug({
                pretty: true
            })
        )
        .pipe(dest(paths.pug.dest));
}

const script = () => {
    return src(paths.script.src)
        .pipe(babel())
        .pipe(dest(paths.script.dest));
}

const live = () => {
    browserSync.init({
        proxy: 'localhost:8888'
    });
    watch(paths.styles.src, style);
    watch(paths.pug.src, html);
    watch(paths.script.src, script);
};

const reload = () => browserSync.reload();

exports.live = live;
exports.style = style;
exports.html = html;
exports.script = script;
exports.default = parallel(live);
