import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css';
import webpCss from 'gulp-webpcss';
import autoPrefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';

const sassMain = gulpSass(dartSass);

export const sass = () => {
	return app.gulp.src(app.path.src.sass, { sourcemaps: app.isDev })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'SASS',
				message: 'Error <%= error.message %>'
			})
		))
		.pipe(app.plugins.replace(/@img\//g, '/img/'))
		.pipe(sassMain({
			outputStyle: 'expanded'
		}))
		.pipe(app.plugins.if(
			app.isBuild,
			groupCssMediaQueries()
		))
		.pipe(app.plugins.if(
			app.isBuild,
			webpCss({
				webpClass: '.webp',
				noWebpClass: '.no-webp'
			})
		))
		.pipe(app.plugins.if(
			app.isBuild,
			autoPrefixer({
				grid: true,
				overrideBrowserslist: ['last 10 versions'],
				cascade: true
			})
		))
		.pipe(app.plugins.if(
			app.isBuild,
			cleanCss()
		))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(app.gulp.dest(app.path.build.css))
		.pipe(app.plugins.browsersync.stream());
}