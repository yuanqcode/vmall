var {series , parallel , src , dest , watch } =require('gulp');
var clean = require('gulp-clean');
var fileInclude = require('gulp-file-include');
var webserver = require('gulp-webserver');



//清理dist文件夹
function cleanTask(){
    return src('./dist' , {allowEmpty : true})
    .pipe(clean());
}

//处理html任务
function htmlTask(){
    return src('./src/view/*.html')
            .pipe(fileInclude({
                prefix : '@',   
                basepath : './src/view/templates'  
            }))
            .pipe(dest('./dist/view'));
}
//开启web服务器（浏览器预览代码）
function webTask(){
            return src('./dist')
            .pipe(webserver({
            host : 'localhost',
            port : 4000,
            open : './view/index.html',//dist 下的inde.hmtl
            livereload : true   //热更新
            }));
}
//同步静态资源到dist
function staticTask(){
    return src('./src/static/**')
    .pipe(dest('./dist/static'))
}
//同步lib资源到dist
function libTask(){
    return src('./src/lib/**')
    .pipe(dest('./dist/lib'))
}
//同步api资源到dist
function apiTask(){
    return src('./src/api/**')
    .pipe(dest('./dist/api'))
}


//实时把src中的代码同步到dist中实时预览
function watchTask(){
            watch('./src/view/**' , htmlTask);
            watch('./src/static/**' , staticTask);
            watch('./src/lib/**' , libTask);
            watch('./src/api/**' , apiTask);
}



module.exports = {

    //开发调接口
    dev:series(cleanTask , parallel(htmlTask , staticTask , libTask , apiTask) , parallel(webTask , watchTask) ),

    //生产调接口
    build: series(cleanTask)
}