var del = require('del');
var gulp = require('gulp');
var gulp_angular_filesort = require('gulp-angular-filesort');
var gulp_bower = require('gulp-bower');
var gulp_changed = require('gulp-changed');
var gulp_count = require('gulp-count');
var gulp_filter = require("gulp-filter");
var gulp_gh_pages = require('gulp-gh-pages');
var gulp_inject = require('gulp-inject');
var gulp_spawn_mocha = require('gulp-spawn-mocha');
var gulp_typescript = require('gulp-typescript');
var gulp_typings = require('gulp-typings');
var gulp_util = require('gulp-util');
var gulp_nodemon = require('gulp-nodemon');
var main_bower_files = require('main-bower-files');
var run_sequence = require('run-sequence');

var locations = {
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
    dest: 'app/dashboard',
    src: 'app/dashboard/index.html',
    bower: [
      'app/bower_components/**/*',
      '!app/bower_components/auth0.js'
    ],
    angular: [
      'app/dashboard/**/*.js',
      '!app/dashboard/auth0-variables.js',
      '!app/dashboard/**/*.spec.js'
    ]
  },

  filters: {
    copy: [
      '**/*.{html,css,json,js,jade,png}'
    ],
    typescript: ['**/*.ts'],
    tests: ['**/*.spec.ts']
  },

  watch: {
    restart: ["src/**/*"]
  }
};

var configs = {
  deploy: {
    heroku: {
      branch: "release/heroku"
    }
  },

  inject: {
    angular: {
      name: 'angular',
      ignorePath: 'app/dashboard'
    },
    bower: {
      name: 'bower',
      ignorePath: 'app/'
    }
  },

  nodemon: {
    script: locations.start,
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development'
    },
    watch: locations.watch.restart,
    tasks: ['build:client'],
    verbose: true
  },

  mocha: {},

  typings: {
    config: './typings.json'
  },

  typescript: {
    config: 'tsconfig.json',
    overrides: {}
  },

  watcher: {
    interval: 1000
  }
};

////////
// Clean
////////

gulp.task('clean', function(callback) {
  run_sequence('clean:client', callback);
});

gulp.task('purge', function(callback) {
  run_sequence('clean:client', 'clean:typings', callback);
});

gulp.task('clean:client', function() {
  return del([locations.output + '/*']);
});

gulp.task('clean:deploy', function() {
  return del(['.publish/*']);
});

gulp.task('clean:typings', function() {
  return del(['typings/*']);
});

////////
// Watch
////////

gulp.task('watch', ['build:client'], function() {
  return gulp.watch(locations.sources, configs.watcher, [
      'build:client:typescript', 'build:client:copy'
    ])
    .on('change', function(event) {
      gulp_util.log("[" + gulp_util.colors.cyan("watch") + "]", 'File ' +
        event.path + ' was ' + event.type);
    });
});

////////
// Build
////////

gulp.task('build', function(callback) {
  run_sequence('build:client', callback);
});

gulp.task('build:client', ['build:typings', 'build:bower'], function(callback) {
  run_sequence('build:client:typescript', 'build:client:copy',
    'build:bower:copy', 'build:inject', callback);
});

gulp.task('build:client:copy', function() {
  var copyFilter = gulp_filter(locations.filters.copy);

  return gulp.src(locations.sources)
    .pipe(copyFilter)
    .pipe(gulp_changed(locations.output))
    .pipe(gulp_count('Copying <%= files %>...'))
    .pipe(gulp.dest(locations.output));
});

var tsProject = gulp_typescript.createProject(configs.typescript.config,
  configs.typescript.overrides);

gulp.task('build:client:typescript', function() {
  var tsFilter = gulp_filter(locations.filters.typescript); // non-test TypeScript files

  var errors = null;
  var tsResult = tsProject.src()
    .pipe(tsFilter)
    .pipe(gulp_changed(locations.output, {
      extension: '.js'
    }))
    .pipe(gulp_count('Building <%= files %>...'))
    .pipe(gulp_typescript(tsProject))
    .on('error', function(error) {
      errors = errors || error;
    })
    .on('end', function() {
      if (errors) {
        throw errors;
      }
    });

  return tsResult.js.pipe(gulp.dest(locations.output));
});

gulp.task('build:bower', function() {
  return gulp_bower();
});

gulp.task('build:bower:copy', function() {
  return gulp.src(main_bower_files(), {
      base: "bower_components"
    })
    .pipe(gulp.dest(locations.bower));
});

gulp.task('build:typings', function() {
  return gulp.src(configs.typings.config).pipe(gulp_typings());
});

gulp.task('build:inject', ['build:bower:copy'], function(callback) {
  run_sequence('build:inject:angular', 'build:inject:bower', callback);
});

gulp.task('build:inject:angular', function() {
  return gulp.src(locations.inject.src)
    .pipe(gulp_inject(gulp.src(locations.inject.angular).pipe(
      gulp_angular_filesort()), configs.inject.angular))
    .pipe(gulp.dest(locations.inject.dest));
});

gulp.task('build:inject:bower', function() {
  return gulp.src(locations.inject.src)
    .pipe(gulp_inject(gulp.src(locations.inject.bower, {
      read: false
    }), configs.inject.bower))
    .pipe(gulp.dest(locations.inject.dest));
});

//////
// Run
//////

gulp.task('start', ['build:client'], function(callback) {
  run_sequence('start:client', callback);
});

gulp.task('start:client', function() {
  gulp_nodemon(configs.nodemon);
});

/////////
// Deploy
/////////

gulp.task('deploy', function(callback) {
  run_sequence('deploy:heroku', callback);
});

gulp.task('deploy:heroku', ['build:client', 'test:run'], function() {
  return gulp.src(locations.deploy, {
      base: './'
    })
    .pipe(gulp_gh_pages(configs.deploy.heroku));
});

///////
// Test
///////

gulp.task('test', ['build:client'], function(callback) {
  run_sequence('test:run', callback);
});

gulp.task('test:run', function() {
  return gulp.src([locations.test])
    .pipe(gulp_spawn_mocha(configs.mocha));
});
