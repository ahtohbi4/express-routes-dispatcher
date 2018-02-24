import gulp from 'gulp';

import autoprefixer from 'autoprefixer';
import del from 'del';
import concat from 'gulp-concat';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import svgmin from 'gulp-svgmin';
import csso from 'postcss-csso';

const SRC_DIR_CSS = [
    'node_modules/normalize.css/normalize.css',
    'examples/app/views/styles.css',
    'examples/app/views/blocks/**/*.css',
    'examples/app/views/pages/**/*.css',
    'examples/app/modules/**/*.css',
];
const SRC_DIR_IMAGES = [
    'examples/app/views/**/*.svg',
    'examples/app/modules/**/*.svg',
];

const BUILD_DIR = 'examples/app/public/build';

const TASK_NAME_CLEAR = 'clear';
const TASK_NAME_CSS = 'css';
const TASK_NAME_CSS_WATCH = 'css:watch';
const TASK_NAME_IMAGES = 'images';
const TASK_NAME_IMAGES_WATCH = 'images:watch';
const TASK_NAME_BUILD = 'build';
const TASK_NAME_WATCH = 'watch';

// Clearing task.
gulp.task(TASK_NAME_CLEAR, () => del(BUILD_DIR));

// Task for CSS.
gulp.task(TASK_NAME_CSS, () => gulp.src(SRC_DIR_CSS)
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
    .pipe(gulp.dest(BUILD_DIR)));

gulp.task(
    TASK_NAME_CSS_WATCH,
    gulp.series(
        TASK_NAME_CSS,
        () => gulp.watch(SRC_DIR_CSS, gulp.parallel(TASK_NAME_CSS)),
    ),
);

// Task for images.
gulp.task(TASK_NAME_IMAGES, () => gulp.src(SRC_DIR_IMAGES)
    .pipe(svgmin({
        plugins: [
            {
                cleanupIDs: {
                    minify: true,
                    remove: true,
                },
            },
        ],
    }))
    .pipe(gulp.dest(BUILD_DIR)));

gulp.task(
    TASK_NAME_IMAGES_WATCH,
    gulp.series(
        TASK_NAME_IMAGES,
        () => gulp.watch(SRC_DIR_IMAGES, gulp.parallel(TASK_NAME_IMAGES)),
    ),
);

// Building task.
gulp.task(TASK_NAME_BUILD, gulp.series(TASK_NAME_CLEAR, gulp.parallel(TASK_NAME_CSS, TASK_NAME_IMAGES)));

// Common watching task.
gulp.task(
    TASK_NAME_WATCH,
    gulp.series(
        TASK_NAME_CLEAR,
        gulp.parallel(
            TASK_NAME_CSS_WATCH,
            TASK_NAME_IMAGES_WATCH,
        ),
    ),
);
