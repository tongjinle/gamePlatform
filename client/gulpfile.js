var gulp = require('gulp');


var browserSync = require('browser-sync').create();


gulp.task('serve', function() {
    browserSync.init({
        server: "./",
        index:"./html/index.html"
    });

    gulp.watch(["js/*.js","html/*.html","css/*.css"]).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);