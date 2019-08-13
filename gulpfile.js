// Подключаем плагины
const gulp = require('gulp');
const server = require('browser-sync').create();
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postCss =  require('gulp-postcss');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');

// Удаление папки build
gulp.task('clean', function(){
    return del('build');
})

// Просто переносим HTML
gulp.task('html', function() {
    return gulp.src('./src/*.html')
    .pipe(gulp.dest('./build'))
    .pipe(server.stream());
});

// Обработка CSS
gulp.task('css', function() {
    return gulp.src('./src/*.scss')
    .pipe(plumber())
    .pipe(sass())
    //.pipe(postCss([ autoprefixer() ]))
    .pipe(gulp.dest('./build'))
    .pipe(server.stream());
});

gulp.task('images', function(){
    return gulp.src('./src/*.{png,jpg,svg}')
    .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true}),
        imagemin.svgo()
    ]))
    .pipe(gulp.dest('./build/img'))
    .pipe(server.stream());
});

gulp.task('server', function(){
    server.init({
        server: 'build/'
    });
    gulp.watch('./src/*.html', gulp.series('html'));
    gulp.watch('./src/*.scss', gulp.series('css'));
    gulp.watch('./src/*.{png,jpg,svg}', gulp.series('images'));
    gulp.watch('./src/*.html', gulp.series('refresh'));
});

// Перезагрузка сервера
gulp.task('refresh', function(done){
    server.reload();
    done();
});

gulp.task('build', gulp.series('clean', 'html', 'css', 'images'));

gulp.task('start', gulp.series('build', 'server'));