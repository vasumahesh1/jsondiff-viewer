/*
 * grunt-icons8
 * https://github.com/vasu/grunt-icons8
 *
 * Copyright (c) 2016 Vasu Mahesh
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      dist: {
        files: [{
          src: 'index.js',
          dest: 'dist/jsondiff-viewer.js'
        }, {
          src: 'jsondiff-viewer.css',
          dest: 'dist/jsondiff-viewer.css'
        }]
      }
    },

    release: {
      options: {
        additionalFiles: ['bower.json'],
        changelog: false,
        add: true,
        commit: true,
        tag: false,
        push: true,
        pushTags: false,
        npm: true,
        npmtag: false,
        beforeBump: ['copy:dist'],
        commitMessage: '[Json DiffViewer] Release Commit <%= version %>',
        tagMessage: 'Release Build <%= version %>',
        github: {
          repo: 'vasumahesh1/jsondiff-viewer',
          accessTokenVar: 'GITHUB_ACCESS_TOKEN'
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy:dist']);
};
