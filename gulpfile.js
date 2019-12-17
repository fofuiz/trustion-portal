const gulp = require('gulp');
const del = require('del');
const clean = require('gulp-clean');
const replace = require('gulp-replace');
const npm = require('gulp-npm-files');
const shell = require('gulp-shell');
const sequence = require('gulp-sequence');
const env = require('gulp-environment');
const rename = require('gulp-rename');
const file = require('file-exists');
const fs = require('fs');
const exec = require('child_process').exec;

var data = JSON.parse(fs.readFileSync('./package.json'));

//let nomeSource = 'gulp-teste';
//let exposePort = 4200;
//let registry = 'registry.accesstage.com.br:5000';
//let nodePort = 300012;


gulp.task('package', sequence('clean', 'moveSrc', 'moveDependencies', 'moveFileEnv', 'moveConf', 'moveDockerfile', 'kubernetes:spec-yaml', 'kubernetes:spec-json'));

gulp.task('build', sequence('docker:rmi', 'docker:build'));

gulp.task('repository:push', sequence('build', 'docker:push'));

gulp.task('clean', function(){
    return gulp.src('dist', {read: false}).pipe(clean());
});

gulp.task('moveSrc', function(){
    return gulp.src(['**', '!env', '!configs', '!gulpfile.js', '!node_modules/**'])
        .pipe(gulp.dest('dist/codes')).on('end', function(){
            console.log("arquivos do diretório src movidos.");
        });
});

gulp.task('moveDependencies', function(){
    return gulp.src(npm(),{base:'./'})
        .pipe(gulp.dest('dist/codes/')).on('end', function(){
            console.log("arquivos de dependências[NodeModules] movidos.");
        });
});

gulp.task('moveConf', function(){
    return gulp.src('configs/nginx/**')
        .pipe(replace('@nomeSource@',  env.current.contextPath))
        .pipe(replace('@exposePort@',  env.current.exposePort))
        .pipe(gulp.dest('dist/nginx')).on('end', function(){
            console.log("arquivos de configuração do nginx movido(s).");
        });
});

gulp.task('moveDockerfile', function(){
    return gulp.src('configs/dockerfile')
        .pipe(replace('@nomeSource@',  env.current.contextPath))
        .pipe(replace('@exposePort@',  env.current.exposePort))
        .pipe(gulp.dest('dist')).on('end', function(){
            console.log("arquivos do dockerfile movido(s).");
        });
});

gulp.task('moveFileEnv', function(){
    if(file.sync('env/' + env.current.envFile)){
        return gulp.src('env/' + env.current.envFile)
            .pipe(rename(env.current.envFile.split('.')[0] + '.' + env.current.envFile.split('.')[2]))
            .pipe(gulp.dest('dist/codes/env'));
    }else{
        console.log("Arquivo de ambiente não encontrado. Pulando Operação.");
    }

});

gulp.task('kubernetes:spec-yaml', function(){
    return gulp.src('configs/kubernetes.yml')
        .pipe(replace('@nomeSource@',  data.name))
        .pipe(replace('@exposePort@',  env.current.exposePort))
        .pipe(replace('@registry@',  env.current.registry))
        .pipe(replace('@nodePort@',  env.current.nodePort))
        .pipe(replace('@versionGulp@', data.version))
        .pipe(gulp.dest('dist')).on('end', function(){
            console.log("arquivo do spec do Kubernetes movido(s).");
        });
});

gulp.task('kubernetes:spec-json', function(){
    return gulp.src('configs/kubernetes.json')
        .pipe(replace('@nomeSource@',  data.name))
        .pipe(replace('@exposePort@',  env.current.exposePort))
        .pipe(replace('@registry@',  env.current.registry))
        .pipe(replace('@nodePort@',  env.current.nodePort))
        .pipe(replace('@versionGulp@', data.version))
        .pipe(gulp.dest('dist')).on('end', function(){
            console.log("arquivo do spec do Kubernetes movido(s).");
        });
});

gulp.task('docker:rmi', function(){

    return gulp.src('./dist').pipe(shell(['docker rmi ' +  env.current.registry + '/' +  data.name + ':' + data.version], {ignoreErrors: true}));

    /*return exec('sudo docker rmi ' + registry + '/' + nomeSource, function (err, stdout, stderr) {
        console.log(stdout);
        if(stderr)
            console.warn("WARNING! " + stderr);
      });*/
});


gulp.task('docker:build', function(){

    return gulp.src('./dist').pipe(shell(['docker build -t ' +  env.current.registry + '/' +  data.name + ':' + data.version + ' ./dist']));

    /*return exec('sudo docker build -t ' + registry + '/' + nomeSource + ' ./dist', function (err, stdout, stderr) {
        console.log(stdout);
        console.warn(stderr);
      });*/
});

gulp.task('docker:push', function(){

    return gulp.src('./dist').pipe(shell(['docker push ' +  env.current.registry + '/' +  data.name + ':' + data.version]));

    /*return exec('sudo docker push ' + registry + '/' + nomeSource, function(err, stdout, stderr){
        if(stdout)
        console.log(stdout);
        if(stderr)
            console.warn(stderr);
    });*/
});
