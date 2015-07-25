/**
 * Created by sunjing on 15/5/17.
 */
var mongodb=require('./db');

//构造函数
function User(user){
    this.name=user.name;
    this.password=user.password;
}

module.exports=User;

User.prototype.save=function save(callback){
    var user={
        name:this.name,
        password:this.password
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err); //打开错误,故不用手动调用mongodb.close()
        }
        //读取users集合
        db.collection('users',function(err,collection){
           if(err){
               mongodb.close();
               return callback(err);
           }
            //为name属性添加唯一索引
            collection.ensureIndex('name',{unique:true});
            //写入user文档
            collection.insert(user,{safe:true},function(err,user){
                mongodb.close();
                callback(err,user);
            });
        });
    })
}

//查询数据库中是否已存在用户
User.get=function get(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({name:username},function(err,doc){
                mongodb.close();
                if(doc){
                    var user=new User(doc);
                    callback(err,user);
                }else{
                    callback(err,null);
                }
            })
        });
    })
}