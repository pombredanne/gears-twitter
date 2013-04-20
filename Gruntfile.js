'use strict';

var path = require( 'path' );

// From yeoman
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (express, dir) {
	return express.static(require('path').resolve(dir));
};


module.exports = function( grunt ) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		template: {
			foursquare: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'public/foursquare/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/foursquare/edit-body.html'),
						script: grunt.file.read('src/foursquare/edit-script.js'),
						style: grunt.file.read('src/foursquare/edit-style.css'),
						title: 'Foursquare Nearby Venues'
					};
				}
			},
			googleMaps: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'public/googleMaps/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/googleMaps/edit-body.html'),
						script: grunt.file.read('src/googleMaps/edit-script.js'),
						style: grunt.file.read('src/googleMaps/edit-style.css'),
						title: 'Google Maps'
					};
				}
			},
			rssFeed: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'public/rssFeed/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/rssFeed/edit-body.html'),
						script: grunt.file.read('src/rssFeed/edit-script.js'),
						style: grunt.file.read('src/rssFeed/edit-style.css'),
						title: 'RSS Feed'
					};
				}
			},
			twitter: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'public/twitter/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/twitter/edit-body.html'),
						script: grunt.file.read('src/twitter/edit-script.js'),
						style: grunt.file.read('src/twitter/edit-style.css'),
						title: 'Twitter User and Followers'
					};
				}
			},
			youtubeEmbed: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'public/youtubeEmbed/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/youtubeEmbed/edit-body.html'),
						script: grunt.file.read('src/youtubeEmbed/edit-script.js'),
						style: grunt.file.read('src/youtubeEmbed/edit-style.css'),
						title: 'YouTube Embedded Video'
					};
				}
			}
		},
		watch: {
			reload: {
				files: '<config:jshint.all_files>',
				tasks: 'reload csslint jshint compileGears'
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			src: ['src/**/*.css']
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all_files: [
				'Gruntfile.js',
				'src/**/*.js'
			]
		},
		copy: {
			main: {
				files: [
					{
						src: ['vendor/**'],
						dest: 'dist/public/'
					}
				]
			}
		}
	});

	// Register tasks
	grunt.registerTask( 'default', [
		'csslint',
		'jshint',
		'compileGears',
		'vendorCopy',
		'watch'
	]);

	grunt.registerTask( 'compileGears', [
		'template'
	]);

	grunt.registerTask( 'vendorCopy', [
		'copy'
	]);

	grunt.registerTask( 'test', [
		'csslint',
		'jshint'
	]);

	grunt.registerTask( 'clientSideTests', [
		'csslint',
		'jshint'
	]);

};
