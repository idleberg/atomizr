// Dependencies
const debug = require('gulp-debug');
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jsonlint = require('gulp-jsonlint');

// Files
const jsFiles = [
    './bin/*.js',
    './lib/*.js',
    './index.js'
];

const jsonFiles = [
    './package.json'
];

// Lint JavaScript files
gulp.task('lint:js', gulp.series(function(done) { 
    gulp.src(jsFiles)
        .pipe(debug({title: 'jshint:'}))
        .pipe(jshint());
    done();
}));

// Lint JSON files
gulp.task('lint:json', gulp.series(function(done) { 
    gulp.src(jsonFiles)
        .pipe(debug({title: 'jsonlint:'}))
        .pipe(jsonlint())
        .pipe(jsonlint.failAfterError())
        .pipe(jsonlint.reporter());
    done();
}));

// Tasks
gulp.task('lint', gulp.parallel('lint:js', 'lint:json', function(done) {
  done();
}));

