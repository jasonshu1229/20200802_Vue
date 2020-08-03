// 拿到数组原型上的方法（旧方法）
let oldArrayProtoMethods = Array.prototype;

// 继承一下： arrayMethods.__proto__ = oldArrayProtoMethods
export let arrayMethods = Object.create(oldArrayProtoMethods)

// 重写 这7个 能改变原数组的方法，如果其余的数组方法，就沿着原型链找到老的数组方法
let methods = [
  'push',
  'pop',
  'shift',
  'shift',
  'reverse',
  'splice'
]

methods.forEach(method => {
  // 重写数组方法之后， 先走自己的函数逻辑
  arrayMethods[method] = function (...args) {  // todo this就是observer函数里的value
  // 再走原来函数的逻辑
    const result = oldArrayProtoMethods[method].apply(this, args);
    
    let ob = this.__ob__; // __ob__ 属性是当前Oberserve的实例，作用检测是否被观测过
    let inserted;

    switch (method) {
      case 'push': // arr.push({a:1}, {b:2})
      case 'unshift': // 这两个方法都是追加元素 追加的内容可能是对象类型，应该被再次劫持
        inserted = args;
        break;
      case 'splice': // vue.$set
        inserted = args.splice(2) // arr.splice(0, 1, {a:1}) 索引 删除的的个数， 新增的元素
      default:
        break;
    }
 
    if(inserted) {
      // 对数组内新增的元素 再次观测
      ob.observeArray(inserted);
    }
    return result;
  }
})