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
				dest: 'dist/public/foursquare/edit.html',
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
				dest: 'dist/public/googleMaps/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/googleMaps/edit-body.html'),
						script: grunt.file.read('src/googleMaps/edit-script.js'),
						style: grunt.file.read('src/googleMaps/edit-style.css'),
						title: 'Google Maps'
					};
				}
			},
			googleMapsButtons: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'dist/public/googleMapsButtons/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/googleMapsButtons/edit-body.html'),
						script: grunt.file.read('src/googleMapsButtons/edit-script.js'),
						style: grunt.file.read('src/googleMapsButtons/edit-style.css'),
						title: 'Google Maps'
					};
				}
			},
			googleMapsStealthEdit: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'dist/public/googleMapsStealth/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/googleMapsStealth/edit-body.html'),
						script: grunt.file.read('src/googleMapsStealth/edit-script.js'),
						style: grunt.file.read('src/googleMapsStealth/edit-style.css'),
						title: 'Google Maps'
					};
				}
			},
			googleMapsStealthDrop: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'dist/public/googleMapsStealth/drop.html',
				variables: function () {
					return {
						body: grunt.file.read('src/googleMapsStealth/drop-body.html'),
						script: grunt.file.read('src/googleMapsStealth/drop-script.js'),
						style: grunt.file.read('src/googleMapsStealth/drop-style.css'),
						title: 'Google Maps'
					};
				}
			},
			rssFeed: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'dist/public/rssFeed/edit.html',
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
				dest: 'dist/public/twitter/edit.html',
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
				dest: 'dist/public/youtubeEmbed/edit.html',
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
			vendor: {
				files: [
					{
						src: ['vendor/**'],
						dest: 'dist/public/'
					}
				]
			},
			main: {
				files: [
					{
						src: ['src/foursquare/config.js'],
						dest: 'dist/public/foursquare/config.js'
					},
					{
						src: ['src/googleMaps/config.js'],
						dest: 'dist/public/googleMaps/config.js'
					},
					{
						src: ['src/googleMapsButtons/config.js'],
						dest: 'dist/public/googleMapsButtons/config.js'
					},
					{
						src: ['src/googleMapsStealth/config.js'],
						dest: 'dist/public/googleMapsStealth/config.js'
					},
					{
						src: ['src/rssFeed/config.js'],
						dest: 'dist/public/rssFeed/config.js'
					},
					{
						src: ['src/twitter/config.js'],
						dest: 'dist/public/twitter/config.js'
					},
					{
						src: ['src/youtubeEmbed/config.js'],
						dest: 'dist/public/youtubeEmbed/config.js'
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
		'copy:main'
	]);

	grunt.registerTask( 'compileGears', [
		'template'
	]);

	grunt.registerTask( 'vendorCopy', [
		'copy:vendor'
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
