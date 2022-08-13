import browsersync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import cssmin from 'gulp-cssmin';
import fileinclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
// import imagemin from 'gulp-imagemin';
import rename from 'gulp-rename';
import size from 'gulp-size';
import uglify from 'gulp-uglify';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

export const deleteDist = () => {
    return del('./dist');
};

export const html = () => {
    return gulp.src(['./#src/html/**/*.html', '!./#src/html/**/_*.html'])
        .pipe(fileinclude())
        .pipe(gulp.dest('./dist/html (origin Size)'))
        .pipe(size({ title: "До стискання: " }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(size({ title: "Після стискання: " }))
        .pipe(gulp.dest('./dist'))
        .pipe(browsersync.stream())
};

export const css = () => {
    return gulp.src('./#src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
        .pipe(cssmin())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browsersync.stream())
};

export const js = () => {
    return gulp.src('./#src/js/**/*.js')
        .pipe(gulp.dest('./dist/js'))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browsersync.stream())
}

export const images = () => {
    return gulp.src('./#src/images/**/*')
        // .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
        .pipe(browsersync.stream())
}

export const fonts = () => {
    return gulp.src('./#src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'))
        .pipe(browsersync.stream())
}

export const watch = () => {
    gulp.watch(['./#src/html/**/*.html'], creation);
    gulp.watch(['./#src/scss/**/*.scss'], creation);
    gulp.watch(['./#src/js/**/*.js'], creation);
    gulp.watch(['./#src/images/**/*'], creation);
    gulp.watch(['./#src/fonts/**/*'], creation);
};

export const sync = () => {
    browsersync.init({
        server: {
            baseDir: "./dist"
        },
        port: 3000,
        notify: true
    })
};

const creation = gulp.series(deleteDist, gulp.parallel(html, css, js, images, fonts));
const observation = gulp.parallel(watch, sync);

export default gulp.series(creation, observation);