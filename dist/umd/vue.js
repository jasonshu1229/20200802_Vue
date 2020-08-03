(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  // 拿到数组原型上的方法（旧方法）
  var oldArrayProtoMethods = Array.prototype; // 继承一下： arrayMethods.__proto__ = oldArrayProtoMethods

  var arrayMethods = Object.create(oldArrayProtoMethods); // 重写 这7个 能改变原数组的方法，如果其余的数组方法，就沿着原型链找到老的数组方法

  var methods = ['push', 'pop', 'shift', 'shift', 'reverse', 'splice'];
  methods.forEach(function (method) {
    // 重写数组方法之后， 先走自己的函数逻辑
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // todo this就是observer函数里的value
      // 再走原来函数的逻辑
      var result = oldArrayProtoMethods[method].apply(this, args);
      var ob = this.__ob__; // __ob__ 属性是当前Oberserve的实例，作用检测是否被观测过

      var inserted;

      switch (method) {
        case 'push': // arr.push({a:1}, {b:2})

        case 'unshift':
          // 这两个方法都是追加元素 追加的内容可能是对象类型，应该被再次劫持
          inserted = args;
          break;

        case 'splice':
          // vue.$set
          inserted = args.splice(2);
      }

      if (inserted) {
        // 对数组内新增的元素 再次观测
        ob.observeArray(inserted);
      }

      return result;
    };
  });

  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key]; // vm._data.a
      },
      set: function set(newValue) {
        // vm.a = 100;
        vm[data][key] = newValue; // vm._data.a = 100
      }
    });
  }
  /**
   * 
   * @param {*} target 目标对象
   * @param {*} key 对象上的属性
   * @param {*} value 对象上的属性值
   */

  function defineProperty(target, key, value) {
    Object.defineProperty(target, key, {
      enumerable: false,
      // 不能被枚举，不能被this.walk()循环
      configurable: false,
      value: this
    });
  }

  /**
   *  封装一个对属性观测的类
   */

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // todo 判断一个对象是否被观测过，看他有没有 __ob__这个属性
      // 以下方法 代替 value.__ob__ = this 因为都是对象 ，会被重复递归 死循环
      defineProperty(value, '__ob__'); // 使用 defineProperty 重新定义属性

      if (Array.isArray(value)) {
        // push shift unshift splice sort reverse pop
        // todo 函数劫持 切片编程 （在原有的逻辑里面增加一些额外的逻辑）
        value.__proto__ = arrayMethods; // todo 观测数组中的对象类型，对象变化  {arr:[{a:1}]}
        // 对数组中的每一项进行观测

        this.observeArray(value);
      } else {
        this.walk(value);
      }
    } // 对数组中的每一项进行观测


    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        value.forEach(function (item) {
          // 观测数组中的对象类型
          observe(item);
        });
      } // 对value对象中每一步 都重新定义
      // todo data是 对象情况时

    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); // 获取对象的Key

        keys.forEach(function (Key) {
          defineReactive(data, Key, data[Key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, Key, value) {
    // 如果值时对象类型的话 {a:{a:1}} 需要递归观察
    observe(value);
    Object.defineProperty(data, Key, {
      get: function get() {
        console.log('用户获取值了');
        return value;
      },
      set: function set(newValue) {
        console.log('用户设置值了');
        if (newValue == value) return; // todo 重新设置值得时候 是对象形式的话 再次观察

        observe(newValue); // vm._data.a = {b:1}

        value = newValue;
      }
    });
  }
  /**
   * todo 观测数据
   * @param {*} data 要检测的data 对象
   */


  function observe(data) {
    // data 需要是对象，并且不是null
    if (_typeof(data) !== 'object' || data == null) {
      return;
    }

    if (data.__ob__) {
      // 已经观测过了，防止数组重复被观测
      return data;
    }

    return new Observer(data);
  }

  function initState(vm) {
    // vm.$options
    var opts = vm.$options; // {el: "#app", data: ƒ}

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }
  /**
   * 用vm.a 来代理 vm._data.a
   * @param {*} vm 
   * @param {*} data 
   * @param {*} key 
   */


  function initData(vm) {
    // 数据的初始化操作
    var data = vm.$options.data; // data : function
    // todo vm._data 是为了将data函数执行返回的结果 与vm 关联起来，否则将拿不到 data()函数的返回对象

    vm._data = data = typeof data == 'function' ? data.call(vm) : data; // 当我去vm上取属性时，帮我将属性的取值代理到 vm._data上

    for (var key in data) {
      proxy(vm, '_data', key);
    } // todo 数据的劫持方案 （Object.definePrototype）


    observe(data); // 此时的data是函数执行后的结果
  }

  /*
    <div id="app">
      <div>hello {{school.name}} <span>world</span></div>
    </div>
  */
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名
  // ?:匹配不捕获

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // </my:xx>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的    aaa="aaa"  a='aaa'   a=aaa

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >    >   <div></div>  <br/>

  function parseHTML(html) {
    // 创建 ast语法树
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        // 标签名
        type: 1,
        // 元素默认为1 元素类型
        children: [],
        // 孩子列表
        attrs: attrs,
        //属性集合
        parent: null // 父元素

      };
    }

    var root; // 根节点

    var currentParent;
    var stack = []; // 用来检验开始标签和结束标签的一致性
    // 标签是否符合预期

    function start(tagName, attrs) {
      // 解析出 开始标签和属性
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // 当前解析的标签 保存起来

      stack.push(element); // 将生成的 ast元素放到栈中
    } // <div> <p></p> hello</div>


    function end(tagName) {
      var element = stack.pop(); // 取出栈中的最后一个

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        // 在闭合时可以知道这个标签的父亲是谁
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      // 解析文本
      text = text.replace(/s/g, ''); // 任何空白字符 都改成''

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    while (html) {
      // 只要html不为空，就一直解析
      var textEnd = html.indexOf('<'); // 从html字符串中找 如果找到 < 则返回 0，否则为-1

      if (textEnd == 0) {
        // 肯定是标签
        var startTagMath = parseStartTag(); // 开始标签匹配的结果 处理开始

        if (startTagMath) {
          start(startTagMath.tagName, startTagMath.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          // 处理结束标签
          advance(endTagMatch[0].length);
          end(endTagMatch[1]); // 将结束标签传入

          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        // 是文本 处理文本
        text = html.substring(0, textEnd); // 把文本过滤出来
      }

      if (text) {
        // 处理文本
        advance(text.length);
        chars(text);
      } // break;

    }
    /**
     * 切割元素标签中的字符串，方便后续解析
     * @param {*} n 第几个字符
     */


    function advance(n) {
      // 将字符串进行截取操作 再更新html内容
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        }; //  console.log(start) // ["<div", "div", index: 0, input: "<div id="app">↵    <div id="“my”">hello {{school.name}} <span>world</span></div>↵  </div>", groups: undefined]
        //  console.log(match) // {tagName: "div", attrs: Array(0)}

        advance(start[0].length); // 删除开始标签
        // console.log(html) //  id="app"> .. 
        // 处理属性 （如果是闭合标签 说明没有属性） 

        var _end, attr; // 不是结尾标签 能匹配到属性


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length); // 去掉当前属性
        }

        if (_end) {
          // >
          advance(_end[0].length); // 去掉 >

          return match;
        }
      }
    }

    return root; // {tag: "div", type: 1, children: Array(0), attrs: Array(1), parent: null}
  }
  /**
   * todo html模板 => render 函数
   * @param {*} template 
   */


  function compileToFunctions(template) {
    // 1、需要将html代码转换成 ast语法树 (可以用ast树来描述语言本身)
    var ast = parseHTML(template);
    console.log(ast); // 2、通过这棵树 重新的生成代码
  }
  /* 
    ast语法树 是用来描述代码的，可以描述 css html js  (根据语法生成的固定逻辑)
    虚拟dom 用来描述dom结构的
  */

  //todo 进行初始化操作
  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 定义一个 Vue的实例对象 vm
      var vm = this;
      vm.$options = options; // {el: "#app", data: ƒ}
      // 初始化状态 (数据劫持，改变数据时，更新视图)

      initState(vm); // todo vue核心 响应式数据原理
      // 如果当前有el属性说明要渲染模板

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
    /** 渲染模板，挂载操作
     * el dom元素
     */


    Vue.prototype.$mount = function (el) {
      // 挂载操作
      var vm = this;
      var options = vm.$options;
      console.log(options); // 先找到外层元素

      el = document.querySelector(el); // 渲染的顺序 render > template > dom结构

      if (!options.render) {
        // 没render 将template转换成render方法
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML; // 外部模板
        } // todo 编译原理 将模板编译成render函数


        var render = compileToFunctions(template);
        options.render = render;
      }

      console.log(options.render); // 渲染时用的都是这个render
      // 有render 方法
    };
  } // 面试：vue是mvvm框架么
  // vue只是借鉴MVVM原理，因为vue可以使用$ref直接操作dom元素

  // todo 该文件给构造函数的原型上扩展方法
  /**
   * 构造函数
   * @param {*} options {el: "#app", data: ƒ}
   */

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); // 初始化方法

  return Vue;

})));
//# sourceMappingURL=vue.js.map
