const mongoose=require('mongoose')

const MovieSchema = new mongoose.Schema({
    direction:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    meta:{//录入时间记录
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{//更新时间
            type:Date,
            default:Date.now()
        }
    }
});
/**
 * pre('save') 每次在存储数据都会调用这个方法
 */
MovieSchema.pre('save',function (next) {
    if (this.isNew){//判断是否是新加的
        this.meta.createAt=this.meta.updateAt = Date.now();
    }
    else {//数据已经有了
        this.meta.updateAt = Date.now()
    }
    next()
});
//静态方法
MovieSchema.statics = {
    fetch:function (cb) {//取出所有数据
        return this
            .find({})
            .sort('meta.updateAt')//更新时间排序
            .exec(cb)
    },
    findById:function (id, cb) {//取出单条数据
        return this
            .findOne({_id:id})
            .exec(cb)
    }
};


module.exports = MovieSchema;
