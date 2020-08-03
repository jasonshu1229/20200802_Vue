/*
  <div id="app">
    <div>hello {{school.name}} <span>world</span></div>
  </div>
*/

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
// ?:匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // </my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的    aaa="aaa"  a='aaa'   a=aaa
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >    >   <div></div>  <br/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function parseHTML(html) {
    // 创建 ast语法树
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName, // 标签名
      type: 1, // 元素默认为1 元素类型
      children: [], // 孩子列表
      attrs,  //属性集合
      parent: null // 父元素
    }
  }

  let root ; // 根节点
  let currentParent;
  let stack = []; // 用来检验开始标签和结束标签的一致性
  // 标签是否符合预期
  function start(tagName, attrs) { // 解析出 开始标签和属性
    let element = createASTElement(tagName, attrs);
    if(!root) {
      root = element;
    }
    currentParent = element; // 当前解析的标签 保存起来
    stack.push(element); // 将生成的 ast元素放到栈中
    
  }
  
  // <div> <p></p> hello</div>
  function end(tagName) {
    let element = stack.pop(); // 取出栈中的最后一个
    currentParent = stack[stack.length - 1];
    if (currentParent) { // 在闭合时可以知道这个标签的父亲是谁
      element.parent = currentParent;
      currentParent.children.push(element);
    }
    
  }
  
  function chars(text) { // 解析文本
    text = text.replace(/s/g, ''); // 任何空白字符 都改成''
    if(text) {
      currentParent.children.push({
        type: 3,
        text,
      })
    }
  }

  while(html) { // 只要html不为空，就一直解析
    let textEnd = html.indexOf('<'); // 从html字符串中找 如果找到 < 则返回 0，否则为-1
    if(textEnd == 0) {
      // 肯定是标签
      const startTagMath = parseStartTag();  // 开始标签匹配的结果 处理开始
      if(startTagMath) {
        start(startTagMath.tagName, startTagMath.attrs);
        continue;
      }
      const endTagMatch =  html.match(endTag);
      if(endTagMatch) { // 处理结束标签
        advance(endTagMatch[0].length);
        end(endTagMatch[1]); // 将结束标签传入
        continue;
      }
    }
    let text;
    if(textEnd > 0) { // 是文本 处理文本
      text = html.substring(0, textEnd); // 把文本过滤出来
    }
    if(text) { // 处理文本
      advance(text.length)
      chars(text);
    }
    // break;
  }
  
  /**
   * 切割元素标签中的字符串，方便后续解析
   * @param {*} n 第几个字符
   */
  function advance(n) { // 将字符串进行截取操作 再更新html内容
    html = html.substring(n)

  }
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if(start) {
       const match = {
         tagName: start[1],
         attrs: []
       }
      //  console.log(start) // ["<div", "div", index: 0, input: "<div id="app">↵    <div id="“my”">hello {{school.name}} <span>world</span></div>↵  </div>", groups: undefined]
      //  console.log(match) // {tagName: "div", attrs: Array(0)}
      advance(start[0].length); // 删除开始标签
      // console.log(html) //  id="app"> .. 
      // 处理属性 （如果是闭合标签 说明没有属性） 
      let end, attr;
      // 不是结尾标签 能匹配到属性
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
        advance(attr[0].length); // 去掉当前属性
      }
      if(end) { // >
        advance(end[0].length);  // 去掉 >
        return match;
      }
    }
  }
  return root;  // {tag: "div", type: 1, children: Array(0), attrs: Array(1), parent: null}
}

/**
 * todo html模板 => render 函数
 * @param {*} template 
 */
export function compileToFunctions(template) {
  // 1、需要将html代码转换成 ast语法树 (可以用ast树来描述语言本身)

  let ast = parseHTML(template)
  console.log(ast)

  // 2、通过这棵树 重新的生成代码
  
}

/* 
  ast语法树 是用来描述代码的，可以描述 css html js  (根据语法生成的固定逻辑)
  虚拟dom 用来描述dom结构的
*/