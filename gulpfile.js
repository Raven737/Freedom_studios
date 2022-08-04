import browsersync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import cssmin from 'gulp-cssmin';
import fileinclude from 'gulp-file-include';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

export const html = () => {
    return gulp.src(['#src/*.html', '!#src/_*.html'])
        .pipe(fileinclude())
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream())
};

export const css = () => {
    return gulp.src('#src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(cssmin())
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browsersync.stream())
};

export const js = () => {
    return gulp.src('#src/js/**/*.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browsersync.stream())
}

export const images = () => {
    return gulp.src('#src/images/**/*')
        .pipe(gulp.dest('dist/images'))
        .pipe(browsersync.stream())
}

export const deleteDist = () => {
    return del('dist');
};

export const sync = () => {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000,
        notify: true
    })
};

export const watch = () => {
    gulp.watch(['#src/*.html'], build);
    gulp.watch(['#src/scss/**/*.scss'], build);
    gulp.watch(['#src/js/**/*.js'], build);
};

const build = gulp.series(deleteDist, gulp.parallel(html, css, js, images));

export default gulp.series(build, gulp.parallel(watch, sync));