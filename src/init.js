//todo 进行初始化操作
import { initState } from './state'

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    // 定义一个 Vue的实例对象 vm
    const vm = this;
    vm.$options = options; // {el: "#app", data: ƒ}

    // 初始化状态 (数据劫持，改变数据时，更新视图)
    initState(vm);
    
    // todo vue核心 响应式数据原理

    // 如果当前有el属性说明要渲染模板
    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }

  }
  /** 渲染模板，挂载操作
   * el dom元素
   */
  Vue.prototype.$mount = function (el) {
    // 挂载操作
    const vm = this;
    // el = document.querySelector(el);
    console.log(document.querySelector('#app'))
  }
} 

// todo 面试：vue是mvvm框架么
// todo vue只是借鉴MVVM原理，因为vue可以使用$ref直接操作dom元素