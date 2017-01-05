const mongoose = require('mongoose');
const MovieSchema = new mongoose.schema({
    direction:String,
    title:String,
    language:string,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    meta:{//录入时间记录
        createAt:{
            type:Data,
            default:Data.now()
        },
        updateAt:{//更新时间
            type:Data,
            default:Data.new()
        }
    }
});
/**
 * pre('save') 每次在存储数据都会调用这个方法
 */
MovieSchema.pre('save',function (next) {
    if (this.isNew){//判断是否是新加的
        this.meta.createAt=this.meta.updateAt =Data.new;
    }
    else {//数据已经有了
        this.meta.updateAt = Data.new()
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