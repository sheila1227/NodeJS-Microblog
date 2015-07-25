/**
 * Created by sunjing on 15/5/17.
 */
/** 数据库连接配置模块 **/

var settings=require('../Settings');
var Db=require('mongodb').Db;
var Server=require('mongodb').Server;

/** 输出创建好的数据库连接 **/
module.exports=new Db(settings.db,new Server(settings.host,27017,{}));