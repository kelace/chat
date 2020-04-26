const gulp = require("gulp");
const rollup = require("gulp-better-rollup");
const babel = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");
const sass = require("gulp-sass");

function scripts(done) {
  gulp
    .src("./src/js/index.*")
    .pipe(
      rollup(
        {
          plugins: [
              babel(),
              resolve({
       
                main: true,
                browser: true
              })
            ],
            onwarn: function(warning) {
                // Skip certain warnings
            
                // should intercept ... but doesn't in some rollup versions
                if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
            
                // console.warn everything else
                console.warn( warning.message );
            }
        },
        {
          format: "iife"
        }
      )
    )
    .pipe(gulp.dest("./assets/dist/js"));
    done()
}

function styles(done) {
  gulp.src("./src/styles/**/*")
    .pipe(sass())
  .pipe(gulp.dest("./assets/dist/styles"));
  done()
}

function watchFiles() {
  gulp.watch("./src/js/**/*", scripts);
  gulp.watch("./src/styles/**/*", styles);
}


exports.default = gulp.parallel(scripts,styles,watchFiles);

