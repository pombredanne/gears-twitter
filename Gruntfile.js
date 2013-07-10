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
		// min: {
		//	dist: {
		//		src: ['<banner:meta.banner>', 'dist/all.js'],
		//		dest: 'dist/all.min.js'
		//	}
		// },
		watch: {
			files: ['Gruntfile.js', 'lib/**', 'src/**', 'test/**'],
			tasks: 'lint build'
		},
		clean: {
			dist: ['dist/fuelux-gears'],
			build: ['build'],
			zip: ['dist/fuelux-gears.zip'],
			zipsrc: ['dist/fuelux-gears']
		},
		copy: {
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
						script: grunt.file.read('src/flickr/edit-script.js'),
						style: grunt.file.read('src/flickr/edit-style.css'),
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
			htmlPaste: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/htmlPaste/edit.html',
				variables: function () {
					return {
						body: grunt.file.read('src/htmlPaste/edit-body.html'),
						'external-styles': grunt.file.read('src/htmlPaste/external-styles.html'),
						'external-script': grunt.file.read('src/htmlPaste/external-script.html'),						script: grunt.file.read('src/htmlPaste/edit-script.js'),
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
			googleMapsButtons: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/googleMapsButtons/edit.html',
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
				dest: 'build/googleMapsStealth/edit.html',
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
				dest: 'build/googleMapsStealth/drop.html',
				variables: function () {
					return {
						body: grunt.file.read('src/googleMapsStealth/drop-body.html'),
						script: grunt.file.read('src/googleMapsStealth/drop-script.js'),
						style: grunt.file.read('src/googleMapsStealth/drop-style.css'),
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
			youtubeEmbed: {
				src: 'src/all/template.html',
				engine: "handlebars",
				dest: 'build/youtubeEmbed/edit.html',
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
			src: ['src/**/*-style.css']
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all_files: [
				'Gruntfile.js',
				'src/**/*-script.js'
			]
		}
	});

	// Register tasks
	grunt.registerTask( 'default', [
		'lint',
		'build',
		'dist',
		'zip'
	]);

//	grunt.registerTask('default', 'lint qunit requirejs recess clean:dist min copy:zipsrc compress clean:zipsrc');

	// Register tasks
	grunt.registerTask( 'lint', [
		'csslint',
		'jshint'
	]);

	grunt.registerTask( 'build', [
		'clean:build',
		'template',
		'copy:gearconfig',
		'copy:externals'
	]);

	grunt.registerTask( 'dist', [
		'clean:dist',
		'copy:dist'
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

};
