// Dependencies
const debug = require('gulp-debug');
const gulp = require('gulp');
const tslint = require('gulp-tslint');
const jsonlint = require('gulp-jsonlint');

// Files
const tsFiles = [
  'src/*.ts',
];

const jsonFiles = [
    './package.json'
];

// Lint TypeScript
gulp.task('lint:ts', gulp.series( (done) => {
  gulp.src(tsFiles)
    .pipe(debug({title: 'tslint'}))
    .pipe(tslint({
        formatter: "prose"
    }))
    .pipe(tslint.report())
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
gulp.task('lint', gulp.parallel('lint:ts', 'lint:json', function(done) {
  done();
}));

