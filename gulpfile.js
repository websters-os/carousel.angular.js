var gulp = require('gulp'),
    minifyHtml = require('gulp-minify-html'),
    templateCache = require('gulp-angular-templatecache');

var minifyHtmlOpts = {
    empty: true,
    cdata: true,
    conditionals: true,
    spare: true,
    quotes: true
};

gulp.task('templates:watch', ['default'], function() {
    gulp.watch('template/**/*.html', function () {
        gulp.start('default');
    });
});

gulp.task('default', function () {
    gulp.src(['template/*.html'])
        .pipe(minifyHtml(minifyHtmlOpts))
        .pipe(templateCache('carousel-tpls.js', {standalone: true, module: 'carousel.templates'}))
        .pipe(gulp.dest('src'));
});