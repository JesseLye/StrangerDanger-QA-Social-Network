var gulp = require("gulp"),
    watch = require("gulp-watch");


gulp.task('watch', function() {
  watch("./theOutskirts/**/*.css", function(){
    gulp.start("cssInject");
  });
});

gulp.task("cssInject", ["styles"], function(){
  return gulp.src("./src/index.css");
});
