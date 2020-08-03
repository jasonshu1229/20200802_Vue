export function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key]; // vm._data.a
    },
    set(newValue) { // vm.a = 100;
      vm[data][key] = newValue; // vm._data.a = 100
    }
  })
};

/**
 * 
 * @param {*} target 目标对象
 * @param {*} key 对象上的属性
 * @param {*} value 对象上的属性值
 */
export function defineProperty(target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false, // 不能被枚举，不能被this.walk()循环
    configurable: false,
    value: this
  })
}