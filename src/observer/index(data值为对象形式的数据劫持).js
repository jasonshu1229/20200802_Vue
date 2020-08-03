/**
 *  封装一个对属性观测的类
 */
class Observer{
  constructor(value){
    // 使用 defineProperty 重新定义属性
    // 对对象处理的
    this.walk(value)
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
      console.log('用户获取值了', data, Key, value)
      return value 
    },
    set(newValue) {
      console.log('用户设置值了', data, Key, value)
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

  return new Observer(data)

}