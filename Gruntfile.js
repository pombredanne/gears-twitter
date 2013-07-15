/*global module */
/*jshint node: true */
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
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			src: ['src/**/*-style.css']
		},
		clean: {
			dist: ['dist/fuelux-gears'],
			// happens before build but not till after dist
			build: ['build'],
			// when built, we copy these to a new directory and remove these
			experimental: ['dist/flickr', 'dist/poll'],
			zip: ['dist/fuelux-gears.zip'],
			zipsrc: ['dist/fuelux-gears']
		},
		copy: {
			// redo templates for local testing
			preDevBuild: {
				files: [
					{
						src: 'src/all/template.html',
						dest: 'src/all/template-orig.html'
					},
					{
						src: 'src/all/template-dev.html',
						dest: 'src/all/template.html'
					}
				]
			},
			postDevBuild: {
				files: [
					{
						src: 'src/all/template.html',
						dest: 'src/all/template-dev.html'
					},
					{
						src: 'src/all/template-orig.html',
						dest: 'src/all/template.html'
					}
				]
			},
			// after creating dist folders, copy exp gears to new directory
			experimental: {
				files: [
					{
						expand: true,
						cwd: 'dist/flickr',
						src: ['**/*'],
						dest: 'dist/experimental/flickr'
					},
					{
						expand: true,
						cwd: 'dist/poll',
						src: ['**/*'],
						dest: 'dist/experimental/poll'
					}

				]
			},
			// direct copy of the config.js files as part of build process
			gearconfig: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/config.js'],
						dest: 'build/'
					}
				]
			},
			// extra script and style files as part of build process
			externals: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/externals/**/*'],
						dest: 'build/'
					}
				]
			},
			// plugins have to be in certain folder, also part of build process
			plugins: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/plugins/**/*'],
						dest: 'build/'
					}
				]
			},
			// copies build files to dist
			dist: {
				files: [
					{
						expand: true,
						cwd: 'build/',
						src: ['**/*'],
						dest: 'dist/'
					},
					{
						expand: true,
						cwd: 'lib/',
						src: ['**/*'],
						dest: 'dist/'
					}

				]
			},
			zipsrc: {
				expand: true,
				cwd: 'dist/',
				src: ['**/*'],
				dest: 'dist/fuelux-gears'
			}
		},
		compress: {
			zip: {
				files: [
					{
						expand: true,
						cwd: 'dist/fuelux-gears/',
						src: ['**'],
						dest: 'fuelux-gears'
					}
				],
				options: {
					archive: 'dist/fuelux-gears.zip'
				}
			}
		},
		template: {
			flickr: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/flickr/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/flickr/edit-body.html'),
						experimental: true,
						script: grunt.file.read('src/flickr/edit-script.js'),
						style: grunt.file.read('src/flickr/edit-style.css'),
						title: 'Display Flickr Photos'
					};
				}
			},
			flickrDrop: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/flickr/drop.html',
				variables: function () {
					return {
						experimental: true,
						script: grunt.file.read('src/flickr/drop-script.js'),
						title: 'Display Flickr Photos'
					};
				}
			},
			foursquare: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/foursquare/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/foursquare/edit-body.html'),
						script: grunt.file.read('src/foursquare/edit-script.js'),
						style: grunt.file.read('src/foursquare/edit-style.css'),
						title: 'Foursquare Nearby Venues'
					};
				}
			},
			foursquareDrop: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/foursquare/drop.html',
				variables: function () {
					return {
						script: grunt.file.read('src/foursquare/drop-script.js'),
						title: 'Foursquare Nearby Venues'
					};
				}
			},
			htmlPaste: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/htmlPaste/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/htmlPaste/edit-body.html'),
						'external-styles': grunt.file.read('src/htmlPaste/external-styles.html'),
						'external-script': grunt.file.read('src/htmlPaste/external-script.html'),
						script: grunt.file.read('src/htmlPaste/edit-script.js'),
						style: grunt.file.read('src/htmlPaste/edit-style.css'),
						title: 'HTML Paste'
					};
				}
			},
			googleMaps: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/googleMaps/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/googleMaps/edit-body.html'),
						script: grunt.file.read('src/googleMaps/edit-script.js'),
						style: grunt.file.read('src/googleMaps/edit-style.css'),
						title: 'Google Maps'
					};
				}
			},
			googleMapsDrop: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/googleMaps/drop.html',
				variables: function () {
					return {
						body: grunt.file.read('src/googleMaps/drop-body.html'),
						script: grunt.file.read('src/googleMaps/drop-script.js'),
						title: 'Google Maps'
					};
				}
			},
			poll: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/poll/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/poll/edit-body.html'),
						experimental: true,
						'external-script': grunt.file.read('src/poll/external-script.html'),
						script: grunt.file.read('src/poll/edit-script.js'),
						style: grunt.file.read('src/poll/edit-style.css'),
						title: 'Poll'
					};
				}
			},
			rssFeed: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/rssFeed/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/rssFeed/edit-body.html'),
						script: grunt.file.read('src/rssFeed/edit-script.js'),
						style: grunt.file.read('src/rssFeed/edit-style.css'),
						title: 'RSS Feed'
					};
				}
			},
			rssFeedDrop: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/rssFeed/drop.html',
				variables: function () {
					return {
						script: grunt.file.read('src/rssFeed/drop-script.js'),
						title: 'RSS Feed'
					};
				}
			},
			textPlusImage: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/textPlusImage/edit.html',
				variables: function () {
					return {
						script: grunt.file.read('src/textPlusImage/edit-script.js'),
						title: 'Text Plus Image'
					};
				}
			},
			textPlusImageDrop: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/textPlusImage/drop.html',
				variables: function () {
					return {
						body: grunt.file.read('src/textPlusImage/drop-body.html'),
						script: grunt.file.read('src/textPlusImage/drop-script.js'),
						style: grunt.file.read('src/textPlusImage/drop-style.css'),
						title: 'Text Plus Image'
					};
				}
			},
			twitter: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/twitter/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/twitter/edit-body.html'),
						script: grunt.file.read('src/twitter/edit-script.js'),
						style: grunt.file.read('src/twitter/edit-style.css'),
						title: 'Twitter User and Followers'
					};
				}
			},
			twitterDrop: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/twitter/drop.html',
				variables: function () {
					return {
						script: grunt.file.read('src/twitter/drop-script.js'),
						title: 'Twitter User and Followers'
					};
				}
			},
			weather: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/weather/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/weather/edit-body.html'),
						script: grunt.file.read('src/weather/edit-script.js'),
						style: grunt.file.read('src/weather/edit-style.css'),
						title: 'Weather'
					};
				}
			},
			youtube: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/youtube/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/youtube/edit-body.html'),
						script: grunt.file.read('src/youtube/edit-script.js'),
						style: grunt.file.read('src/youtube/edit-style.css'),
						title: 'YouTube Embedded Video'
					};
				}
			},
			youtubeDrop: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/youtube/drop.html',
				variables: function () {
					return {
						script: grunt.file.read('src/youtube/drop-script.js'),
						title: 'YouTube Embedded Video'
					};
				}
			}

		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all_files: [
				'Gruntfile.js',
				'src/**/*-script.js'
			]
		},

		watch: {
			files: ['Gruntfile.js', 'vendor/**', 'src/**', 'test/**'],
			tasks: 'devOps'
		}

	});

	// Register tasks
	grunt.registerTask( 'default', [
		'lint',
		'build',
		'dist',
		'buildCleanup',
		'zip'
	]);

//	grunt.registerTask('default', 'lint qunit requirejs recess clean:dist min copy:zipsrc compress clean:zipsrc');

	// Register tasks
	grunt.registerTask( 'lint', [
		'csslint',
		'jshint'
	]);

	grunt.registerTask( 'build', [
		'buildCleanup',
		'template',
		'copy:gearconfig',
		'copy:externals',
		'copy:plugins'
	]);

	grunt.registerTask( 'buildCleanup', [
		'clean:build'
	]);

	grunt.registerTask( 'dist', [
		'clean:dist',
		'copy:dist',
		'copy:experimental',
		'clean:experimental'
	]);

	grunt.registerTask( 'zip', [
		'clean:zip',
		'clean:zipsrc',
		'copy:zipsrc',
		'compress:zip',
		'clean:zipsrc'
	]);

	grunt.registerTask( 'test', [
		'lint'
	]);

	grunt.registerTask('devOps', [
		'copy:preDevBuild',
		'lint',
		'build',
		'dist',
		'buildCleanup'
	]);

	grunt.registerTask( 'dev', [
		'devOps',
		'watch'
	]);


};
