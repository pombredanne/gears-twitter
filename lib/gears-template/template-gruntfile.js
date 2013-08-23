/*globals module */

// all paths in this file are relative to the root of YOUR gear
// this file is pulled into your gears Gruntfile for you

module.exports = function(grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// for linting tasks, either define your own csslintrc file and jshintrc file
		// in package.json of your gear
		// or use the built in ones
		csslint: {
			options: {
				csslintrc: '<%= pkg.csslintrc ? pkg.csslintrc : pkg.gearsTemplate + "/template-csslintrc" %>'
			},
			src: ['src/*-style.css']
		},

		jshint: {
			options: {
				jshintrc: '<%= pkg.jshintConfig ? pkg.jshintConfig : pkg.gearsTemplate + "/template-jshintrc" %>'
			},
			all_files: [
				'Gruntfile.js',
				'src/**/*-script.js'
			]
		},

		watch: {
			files: ['Gruntfile.js', 'lib/**', 'src/**', 'test/**'],
			tasks: 'devOps'
		},

		clean: {
			dist: ['dist/<%= pkg.name %>'],
			// happens before build but not till after dist
			build: ['build'],
			zip: ['dist/<%= pkg.name %>.zip'],
			zipsrc: ['dist/<%= pkg.name %>']
		},
		copy: {
			// redo templates for local testing
			preDevBuild: {
				files: [
					{
						src: '<%= pkg.gearsTemplate %>/template.html',
						dest: '<%= pkg.gearsTemplate %>/template-orig.html'
					},
					{
						src: '<%= pkg.gearsTemplate %>/template-dev.html',
						dest: '<%= pkg.gearsTemplate %>/template.html'
					}
				]
			},
			postDevBuild: {
				files: [
					{
						src: '<%= pkg.gearsTemplate %>/template.html',
						dest: '<%= pkg.gearsTemplate %>/template-dev.html'
					},
					{
						src: '<%= pkg.gearsTemplate %>/template-orig.html',
						dest: '<%= pkg.gearsTemplate %>/template.html'
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
					// copies library files as needed
					// could CDN these
					{
						expand: true,
						cwd: '<%= pkg.gearsTemplate %>/lib',
						src: ['jquery.js', 'underscore.js'],
						dest: 'dist/'
					}

				]
			},
			zipsrc: {
				expand: true,
				cwd: 'dist/',
				src: ['**/*'],
				dest: 'dist/<%= pkg.name %>'
			}
		},
		compress: {
			zip: {
				files: [
					{
						expand: true,
						cwd: 'dist/<%= pkg.name %>/',
						src: ['**'],
						dest: '<%= pkg.name %>'
					}
				],
				options: {
					archive: 'dist/<%= pkg.name %>.zip'
				}
			}
		},
		template: {
			edit: {
				src: '<%= pkg.gearsTemplate %>/template.html',
				engine: "handlebars",
				dest: 'build/edit.html',
				variables: function () {
					return {
						body: (grunt.file.exists('src/edit-body.html') ? grunt.file.read('src/edit-body.html') : null),
						'external-script': (grunt.file.exists('src/external-script.html') ? grunt.file.read('src/external-script.html') : null),
						'external-styles': (grunt.file.exists('src/external-styles.html') ? grunt.file.read('src/external-styles.html') : null),
						fuelVersion: '2.3.1',
						fuelIMHThemeVersion: '2.3.1',
						gearAPIVersion: '0.0.19',
						script: (grunt.file.exists('src/edit-script.js') ? grunt.file.read('src/edit-script.js') : null),
						style: (grunt.file.exists('src/edit-style.css') ? grunt.file.read('src/edit-style.css') : null),
						title: grunt.file.readJSON('package.json').title
					};
				}
			},
			drop: {
				src: '<%= pkg.gearsTemplate %>/template.html',
				engine: "handlebars",
				dest: 'build/drop.html',
				variables: function () {
					return {
						body: (grunt.file.exists('src/drop-body.html') ? grunt.file.read('src/drop-body.html') : null),
						'external-script': (grunt.file.exists('src/external-script.html') ? grunt.file.read('src/external-script.html') : null),
						'external-styles': (grunt.file.exists('src/external-styles.html') ? grunt.file.read('src/external-styles.html') : null),
						fuelVersion: '2.3.1',
						fuelIMHThemeVersion: '2.3.1',
						gearAPIVersion: '0.0.19',
						script: (grunt.file.exists('src/drop-script.js') ? grunt.file.read('src/drop-script.js') : null),
						style: (grunt.file.exists('src/drop-style.css') ? grunt.file.read('src/drop-style.css') : null),
						title: grunt.file.readJSON('package.json').title
					};
				}
			}

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

	grunt.registerTask('devOps', [
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
