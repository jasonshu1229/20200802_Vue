//todo 进行初始化操作
import { initState } from './state';
import { compileToFunctions } from './compiler/index'

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
    const options = vm.$options;
    console.log(options)
    // 先找到外层元素
    el = document.querySelector(el);
    // 渲染的顺序 render > template > dom结构
    if (!options.render){
      // 没render 将template转换成render方法
      let template = options.template;
      if(!template && el) {
        template = el.outerHTML; // 外部模板
      }
      // todo 编译原理 将模板编译成render函数
      const render = compileToFunctions(template);
      options.render = render;
    } 
    console.log(options.render) // 渲染时用的都是这个render
    // 有render 方法
    
  }
} 

// 面试：vue是mvvm框架么
// vue只是借鉴MVVM原理，因为vue可以使用$ref直接操作dom元素