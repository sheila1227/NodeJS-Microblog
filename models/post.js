/**
 * Created by sunjing on 15/5/17.
 */
var mongodb=require('./db');

//构造函数
function Post(username,post,time){
    this.user=username;
    this.post=post;
    if(time){
        this.time=time;
    }else {
        this.time = new Date();
    }
}

module.exports=Post;

Post.prototype.save=function save(callback){
    var post={
        user:this.user,
        post:this.post,
        time:this.time
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err); //打开错误,故不用手动调用mongodb.close()
        }
        //读取posts集合
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //为user属性添加索引
            collection.ensureIndex('user',{unique:true});
            //写入一条post文档
            collection.insert(post,{safe:true},function(err,post){
                mongodb.close();
                callback(err,post);
            });
        });
    })
}

//由用户名返回对应的post数组
Post.get=function get(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查询posts集合内user属性值为username的所有文档,若username为null,则返回全部
            var query={};
            if(username){
                query={user:username};
            }
            //查询结果按时间降序排序
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    callback(err,null);
                }
                var posts=[];
                docs.forEach(function(doc,index){
                    if(doc){
                       var post=new Post(doc.user,doc.post,doc.time);
                        posts.push(post);
                    }
                })
               callback(err,posts);
            });
        });
    })
}