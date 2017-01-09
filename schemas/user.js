const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
   name:{
       unique:true,
       type:String
   },
    password:String,
    role:{
        type:Number,
        default:0
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});
/**
 * pre('save') 每次在存储数据都会调用这个方法
 */
UserSchema.pre('save', function (next) {
    const user = this;

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err)
        //参数1 明文密码 参数2 salt 生成是盐  参数3 新的哈希加密密码
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err)

            user.password = hash
            next()
        })
    })
})
/*实例方法 通过实例可以调用*/
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) return cb(err)

            cb(null, isMatch)
        })
    }
};
/*静态方法 模型就可以调*/
UserSchema.statics = {
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


module.exports = UserSchema;
