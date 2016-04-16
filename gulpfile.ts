let del = require("del");
let gulp = require("gulp");
let gulp_angular_filesort = require("gulp-angular-filesort");
let gulp_bower = require("gulp-bower");
let gulp_changed = require("gulp-changed");
let gulp_count = require("gulp-count");
let gulp_filter = require("gulp-filter");
let gulp_gh_pages = require("gulp-gh-pages");
let gulp_inject = require("gulp-inject");
let gulp_spawn_mocha = require("gulp-spawn-mocha");
import gulp_tslint from "gulp-tslint";
let gulp_typescript = require("gulp-typescript");
let gulp_typings = require("gulp-typings");
let gulp_util = require("gulp-util");
let gulp_nodemon = require("gulp-nodemon");
let main_bower_files = require("main-bower-files");
let run_sequence = require("run-sequence");

let locations = {
  sources: "src/**/*",

  output: "app",
  test: "app/**/*.spec.js",
  deploy: [
    "./*.*",
    "./.travis.yml",
    "app/**/*"
  ],
  start: "app/server.js",
  bower: "app/bower_components",

  inject: {
    dest: "app/dashboard",
    src: "src/dashboard/index.html",
    bower: [
      "app/bower_components/**/*",
      "!app/bower_components/auth0.js"
    ],
    angular: [
      "app/dashboard/**/*.js",
      "!app/dashboard/auth0-variables.js",
      "!app/dashboard/**/*.spec.js"
    ],
    css: [
      "app/dashboard/**/*.css"
    ]
  },

  filters: {
    copy: ["**/*.{html,css,json,js,jade,png}", "!src/dashboard/index.html"],
    typescript: ["**/*.ts"],
    tests: ["**/*.spec.ts"]
  },

  watch: {
    restart: ["src/**/*"]
  }
};

let configs = {
  deploy: {
    heroku: {
      branch: "release/heroku"
    }
  },

  inject: {
    angular: {
      name: "angular",
      ignorePath: "app/dashboard"
    },
    bower: {
      name: "bower",
      ignorePath: "app/"
    },
    css: {
      name: "css",
      ignorePath: "app/dashboard"
    }
  },

  nodemon: {
    script: locations.start,
    env: {
      NODE_ENV: process.env.NODE_ENV || "development"
    },
    ext: "js html css json",
    watch: locations.output,
    verbose: true
  },

  mocha: {},

  typings: {
    config: "./typings.json"
  },

  typescript: {
    config: "src/tsconfig.json",
    overrides: {}
  },

  watcher: {
    interval: 1000
  }
};

////////
// Clean
////////

gulp.task("clean", function(callback) {
  run_sequence("clean:client", callback);
});

gulp.task("purge", function(callback) {
  run_sequence("clean:client", "clean:typings", callback);
});

gulp.task("clean:client", function() {
  return del([locations.output + "/*"]);
});

gulp.task("clean:deploy", function() {
  return del([".publish/*"]);
});

gulp.task("clean:typings", function() {
  return del(["typings/*"]);
});

////////
// Watch
////////

gulp.task("watch", ["start"], function() {
  return gulp.watch(locations.sources, configs.watcher, [
      "watch:rebuild"
    ])
    .on("change", function(event) {
      gulp_util.log("[" + gulp_util.colors.cyan("watch") + "]", "File " +
        event.path + " was " + event.type);
    });
});

gulp.task("watch:rebuild", function(callback) {
  run_sequence("build:client:copy", "build:bower:copy", "build:inject",
    callback);
});

////////
// Install
////////

gulp.task("install", ["install:typings", "install:bower"], function() {});

gulp.task("install:typings", function() {
  return gulp.src(configs.typings.config).pipe(gulp_typings());
});

gulp.task("install:bower", function() {
  return gulp_bower();
});

////////
// Build
////////

gulp.task("build", function(callback) {
  run_sequence("build:client", callback);
});

gulp.task("build:client", ["install"], function(callback) {
  run_sequence("build:client:typescript", "build:client:copy",
    "build:bower:copy", "build:inject", callback);
});

gulp.task("build:client:copy", function() {
  let copyFilter = gulp_filter(locations.filters.copy);

  return gulp.src(locations.sources)
    .pipe(copyFilter)
    .pipe(gulp_changed(locations.output))
    .pipe(gulp_count("Copying <%= files %>..."))
    .pipe(gulp.dest(locations.output));
});

let tsProject = gulp_typescript.createProject(configs.typescript.config,
  configs.typescript.overrides);

gulp.task("build:client:typescript", function() {
  let tsFilter = gulp_filter(locations.filters.typescript); // non-test TypeScript files

  let errors = null;
  let tsResult = tsProject.src()
    .pipe(tsFilter)
    .pipe(gulp_changed(locations.output, {
      extension: ".js"
    }))
    .pipe(gulp_count("Building <%= files %>..."))
    .pipe(gulp_typescript(tsProject))
    .on("error", function(error) {
      errors = errors || error;
    })
    .on("end", function() {
      if (errors) {
        throw errors;
      }
    });

  return tsResult.js.pipe(gulp.dest(locations.output));
});

gulp.task("build:bower:copy", function() {
  return gulp.src(main_bower_files(), {
      base: "bower_components"
    })
    .pipe(gulp.dest(locations.bower));
});

gulp.task("build:inject", ["build:bower:copy"], function(callback) {
  return gulp.src(locations.inject.src)

  .pipe(gulp_inject(gulp.src(locations.inject.angular).pipe(
    gulp_angular_filesort()), configs.inject.angular))

  .pipe(gulp_inject(gulp.src(locations.inject.bower, {
    read: false
  }), configs.inject.bower))

  .pipe(gulp_inject(gulp.src(locations.inject.css, {
    read: false
  }), configs.inject.css))

  .pipe(gulp_changed(locations.inject.dest, {
      hasChanged: gulp_changed.compareSha1Digest
    }))
    .pipe(gulp_count("Injecting <%= files %>..."))
    .pipe(gulp.dest(locations.inject.dest));
});

///////
// Lint
///////

gulp.task("lint", ["lint:typescript"], function() {
});

gulp.task("lint:typescript", function() {
  let tsFilter = gulp_filter(locations.filters.typescript);

  return gulp.src(locations.sources)
    .pipe(tsFilter)
    .pipe(gulp_tslint())
    .pipe(gulp_tslint.report("verbose"));
});

///////
// Test
///////

gulp.task("test", ["build:client"], function(callback) {
  run_sequence("test:run", callback);
});

gulp.task("test:run", function() {
  return gulp.src([locations.test])
    .pipe(gulp_spawn_mocha(configs.mocha));
});

//////
// Run
//////

gulp.task("start", ["build:client"], function(callback) {
  run_sequence("start:client", callback);
});

gulp.task("start:client", function() {
  return gulp_nodemon(configs.nodemon);
});

/////////
// Deploy
/////////

gulp.task("deploy", function(callback) {
  run_sequence("deploy:heroku", callback);
});

gulp.task("deploy:heroku", ["build:client", "test:run"], function() {
  return gulp.src(locations.deploy, {
      base: "./"
    })
    .pipe(gulp_gh_pages(configs.deploy.heroku));
});
