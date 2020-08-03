import { observe } from "./observer/index";
import { proxy } from "./util";

//todo 初始化属性 状态 数据 等等
export function initState(vm) {  // vm.$options
  const opts = vm.$options; // {el: "#app", data: ƒ}

  if(opts.props) {
    initProps();
  }

  if(opts.methods) {
    initMethods();
  }
  if(opts.data) {
    initData(vm);
  }
  if(opts.computed) {
    initComputed();
  }
  if(opts.watch) {
    initWatch();
  }
}

function initProps() {}
function initMethods() {}

/**
 * 用vm.a 来代理 vm._data.a
 * @param {*} vm 
 * @param {*} data 
 * @param {*} key 
 */

function initData(vm) {
  // 数据的初始化操作
  let data = vm.$options.data; // data : function
  // todo vm._data 是为了将data函数执行返回的结果 与vm 关联起来，否则将拿不到 data()函数的返回对象
  vm._data = data = typeof data == 'function' ? data.call(vm) : data;

  // 当我去vm上取属性时，帮我将属性的取值代理到 vm._data上
  for(let key in data) {
    proxy(vm, '_data', key);
  }

  // todo 数据的劫持方案 （Object.definePrototype）
  observe(data) // 此时的data是函数执行后的结果
}
function initComputed() {}
function initWatch() {} 