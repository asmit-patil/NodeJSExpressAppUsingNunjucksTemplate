const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-html');//require('gulp-nunjucks');
const data = require('gulp-data');

// gulp.task('default', () =>
// 	gulp.src('views/*.html')
// 		.pipe(data(() => ({name: 'AP'})))
// 		.pipe(nunjucks.compile())
// 		.pipe(gulp.dest('dist'))
// );
// gulp.task('layout', () =>
// 	gulp.src('views/layout/*.html')
// 		.pipe(data(() => ({name: 'AP'})))
// 		.pipe(nunjucks.compile())
// 		.pipe(gulp.dest('dist'))
// );
// gulp.task('user', () =>
// 	gulp.src('views/user/*.html')
// 		.pipe(data(() => ({name: 'AP'})))
// 		.pipe(nunjucks.compile())
// 		.pipe(gulp.dest('dist'))
// );
// gulp.task('nunjucks', function() {
//     return gulp.src('views/**/*.html')
//       .pipe(nunjucks({
//         searchPaths: ['views']
//       }))
//       .on('error', function(err) {
//         // err is the error thrown by the Nunjucks compiler.
//         console.log(err)
//       })
//       .pipe(gulp.dest('dist'));
//   });




