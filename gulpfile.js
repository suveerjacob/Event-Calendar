const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const autoPrefix = require("gulp-autoprefixer");
const gulpSASS = require("gulp-sass");

const cssFiles = "./public/css/";
const sassFiles = "./public/css/scss/*.scss";

gulp.task("sass", () => {
    console.log("Converting scss to css");
    
    return gulp.src(sassFiles)
        .pipe(gulpSASS())
        .pipe(autoPrefix())
        .pipe(cleanCSS())
        .pipe(gulp.dest(cssFiles));
});

gulp.task("default", ["sass"]);
