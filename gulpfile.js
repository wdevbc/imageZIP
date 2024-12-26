const { src, dest, series } = require('gulp');
const imagemin = require('gulp-imagemin');
const yargs = require('yargs');

// yargs로 커맨드 라인 인자 처리
const argv = yargs(process.argv.slice(2)).argv;

// 이미지 압축 함수
function compressImages() {
    const quality = Math.min(Math.max(argv.quality || 75, 0), 100);
    if (!argv.source || !argv.destination) {
        throw new Error('Source and Destination paths are required!');
    }

    return src(`${argv.source}/**/*.*`, { encoding: false })
        .pipe(imagemin([imagemin.gifsicle({ interlaced: false }), imagemin.mozjpeg({ quality, progressive: true }), imagemin.optipng({ optimizationLevel: 5 })]))
        .pipe(dest(argv.destination));
}

// 기본 작업 설정
exports.default = series(compressImages);
