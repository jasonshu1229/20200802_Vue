import { arrayMethods } from './array';
import { defineProperty } from '../util';
/**
 *  封装一个对属性观测的类
 */
class Observer{
  constructor(value){
    // todo 判断一个对象是否被观测过，看他有没有 __ob__这个属性
    // 以下方法 代替 value.__ob__ = this 因为都是对象 ，会被重复递归 死循环
    defineProperty(value, '__ob__', this);
    

    // 使用 defineProperty 重新定义属性
    if (Array.isArray(value)){
      // push shift unshift splice sort reverse pop
      // todo 函数劫持 切片编程 （在原有的逻辑里面增加一些额外的逻辑）
      value.__proto__ = arrayMethods;
      // todo 观测数组中的对象类型，对象变化  {arr:[{a:1}]}
      // 对数组中的每一项进行观测
      this.observeArray(value);
    } else {
      this.walk(value)
    }
  }

  // 对数组中的每一项进行观测
  observeArray(value) { 
    value.forEach(item => {
      // 观测数组中的对象类型
      observe(item)
    })
  }
  // 对value对象中每一步 都重新定义
  // todo data是 对象情况时
  walk(data) {
    let keys = Object.keys(data); // 获取对象的Key
    keys.forEach(Key => {
      defineReactive(data, Key, data[Key]);
    })
  }
}

function defineReactive(data, Key, value) {
  // 如果值时对象类型的话 {a:{a:1}} 需要递归观察
  observe(value);
  Object.defineProperty(data, Key, {
    get() {
      console.log('用户获取值了')
      return value 
    },
    set(newValue) {
      console.log('用户设置值了')
      if(newValue == value) return;
      // todo 重新设置值得时候 是对象形式的话 再次观察
      observe(newValue); // vm._data.a = {b:1}
      value = newValue;
    }
  })
}

/**
 * todo 观测数据
 * @param {*} data 要检测的data 对象
 */
export function observe(data) {

  // data 需要是对象，并且不是null
  if(typeof data !== 'object' || data == null) {
    return;
  }
  if(data.__ob__) {
    // 已经观测过了，防止数组重复被观测
    return data;
  }
  return new Observer(data)

}