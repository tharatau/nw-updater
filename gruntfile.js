var exec = require('node:child_process').exec;
var fs = require('node:fs');

var ncp = require('ncp');

var isWin = /^win/.test(process.platform);
var isMac = /^darwin/.test(process.platform);
var isLinux = /^linux/.test(process.platform);
var is32 = process.arch == 'ia32';
var is64 = process.arch == 'x64';
var platforms = [];
if(isMac) platforms.push('osx');
if(isWin) platforms.push('win');
if(isLinux && is32) platforms.push('linux32');
if(isLinux && is64) platforms.push('linux64');

///^win/.test(process.platform)?'win':/^darwin/.test(process.platform)?'mac':process.arch == 'ia32'?'linux32':'linux64';

module.exports = function(grunt){
  var dest = grunt.option('dest') || './deploy';
  var src = grunt.option('src') || './app';
  grunt.initConfig({
    clean:{
      main: ['test/app']
    },
    compress:{
      mac:{
        options: {
          mode: 'zip',
          archive: dest + '/updapp/osx/updapp.zip'
        },
        expand: true,
        cwd: dest + '/updapp/osx/',
        src: ['**/**'],
        dest: '/updapp'
      },
      win:{
        options: {
          mode: 'zip',
          archive: dest + '/updapp/win/updapp.zip'
        },
        expand: true,
        cwd: dest + '/updapp/win/',
        src: ['**/**'],
        dest: '/updapp'
      },
      linux32:{
        options: {
          mode: 'tgz',
          archive: dest + '/updapp/linux32/updapp.tar.gz'
        },
        expand: true,
        cwd: dest + '/updapp/linux32/',
        src: ['**/**'],
        dest: 'updapp/'
      },
      linux64:{
        options: {
          mode: 'tgz',
          archive: dest + '/updapp/linux64/updapp.tar.gz'
        },
        expand: true,
        cwd: dest + '/updapp/linux64/',
        src: ['**/**'],
        dest: 'updapp/'
      }
    },
    nwjs: {
      build: {
        options: {
          outDir: dest, // Where the build version of my node-webkit app is saved
          glob: false,
        },
        src: src,
      }
    },
    mochaTest:{
      test:{
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.spec.js']
      }
    },
    copy:{
      win:{
        src: 'tools/*',
        dest: dest + '/win/'
      }
    },
});
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('packageMacZip', function(){
    var done = this.async();
    
    fs.mkdirSync(dest + '/updapp/osx/updapp');
    ncp(dest + '/updapp/osx/updapp.app', dest + '/updapp/osx/updapp/updapp.app', function(err){
      exec('zip -r updapp.zip updapp',{cwd: dest + '/updapp/osx'},function(error, stdout, stderr){
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
        done()
      })
     
    })
  });
  
  grunt.registerTask('packageMac', function(){
    var done = this.async();
    console.log('packaging...', 'hdiutil create -format UDZO -srcfolder ' + dest + '/releases/updapp/mac/updapp.app ' + dest + '/releases/updapp/mac/updapp.dmg');
    
    exec('hdiutil create -format UDZO -srcfolder ' + dest + '/updapp/osx/updapp.app ' + dest + '/updapp/osx/updapp.dmg',function(error, stdout, stderr){
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      done()
    })
  });

  grunt.registerTask('version', function(){
    var ver = grunt.option('ver');
    customizePackageJson({version: ver}, './app/package.json');
    
    function customizePackageJson(obj, path){
      var json = require(path);
      for(var i in obj){
        json[i] = obj[i];
      }
      fs.writeFileSync(path, JSON.stringify(json, null, 4));
    }
  });
  
  var buildFlow = ['nwjs'];
  if(isWin) buildFlow.push('copy:win');

  grunt.registerTask('buildapp', buildFlow);

  grunt.registerTask('default', 'mochaTest');
};