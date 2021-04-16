var gulp = require('gulp'),
    glp = require('gulp-load-plugins')(),
    del = require('del'),
    nwb = require('nwjs-builder'),
    argv = require('yargs').alias('p', 'platforms').argv,
    paths = {
        build: './build',
        src: './src',
        images: './src/images'
    },
    detectCurrentPlatform = function () {
        switch (process.platform) {
        case 'darwin':
            return process.arch === 'x64' ? 'osx64' : 'osx32';
        case 'win32':
            return (process.arch === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')) ? 'win64' : 'win32';
        case 'linux':
            return process.arch === 'x64' ? 'linux64' : 'linux32';
        }
    };

gulp.task('build', ['clean:build'], function () {
    return new Promise(function (resolve, reject) {
        nwb.commands.nwbuild(paths.src, {
            version: '0.15.4',
            platforms: argv.p ? argv.p : detectCurrentPlatform(),
            withFFmpeg: true,
            production: true,
            macIcns: paths.images + '/icon.icns',
            winIco: paths.images + '/icon.ico',
            sideBySide: false,
            //outputFormat: 'ZIP',
            outputDir: paths.build
        }, function (err) {
            if (err) {
                reject(err);
            }
            return resolve();
        });
    });
});

gulp.task('clean:build', function () {
    return gulp.src(paths.build, {
        read: false
    }).pipe(glp.clean());
});