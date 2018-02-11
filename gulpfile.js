import gulp from 'gulp';

import autoprefixer from 'autoprefixer';
import del from 'del';
import concat from 'gulp-concat';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import csso from 'postcss-csso';

const SRC_DIR_CSS = [
    'examples/app/modules/**/*.css',
    'examples/app/views/**/*.css',
];

const BUILD_DIR = 'examples/app/public/build';

const TASK_NAME_CLEAR = 'clear';
const TASK_NAME_CSS = 'css';
const TASK_NAME_CSS_WATCH = 'css:watch';
const TASK_NAME_BUILD = 'build';
const TASK_NAME_WATCH = 'watch';

// Clearing task.
gulp.task(TASK_NAME_CLEAR, () => {
    return del(BUILD_DIR);
});

// Task for CSS.
gulp.task(TASK_NAME_CSS, () => {
    return gulp.src(SRC_DIR_CSS)
        .pipe(sourcemaps.init())
        .pipe(concat('styles.css'))
        .pipe(postcss([
            autoprefixer({
                browsers: [
                    'IE 10',
                    '> 1%',
                ],
            }),
            csso(),
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task(
    TASK_NAME_CSS_WATCH,
    gulp.series(
        TASK_NAME_CSS,
        () => gulp.watch(SRC_DIR_CSS, gulp.parallel(TASK_NAME_CSS)),
    ),
);

// Building task.
gulp.task(TASK_NAME_BUILD, gulp.series(TASK_NAME_CLEAR, gulp.parallel(TASK_NAME_CSS)));

// Common watching task.
gulp.task(TASK_NAME_WATCH, gulp.parallel(TASK_NAME_CSS_WATCH));
