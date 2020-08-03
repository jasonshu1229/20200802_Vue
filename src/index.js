// todo 该文件给构造函数的原型上扩展方法
import { initMixin } from './init';

/**
 * 构造函数
 * @param {*} options {el: "#app", data: ƒ}
 */
function Vue(options) {
  this._init(options);
}

initMixin(Vue);

// 初始化方法


export default Vue;