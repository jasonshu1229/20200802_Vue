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

function start(tagName, attrs) {
  console.log(tagName, attrs)  // 解析出 开始标签和属性
}

function end(tagName) {

}

function chars(text) {

}

function parseHTML(html) {
  while(html) { // 只要html不为空，就一直解析
    let textEnd = html.indexOf('<');
    if(textEnd == 0) {
      // 肯定是标签
      const startTagMath = parseStartTag();  // 开始标签匹配的结果
      if(startTagMath) {
        start(startTagMath.tagName, startTagMath.attrs);
      }
      break;
    }
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
        advance(end[0]);  // 去掉 >
        return match;
      }
    }
  }
}

/**
 * todo html模板 => render 函数
 * @param {*} template 
 */
export function compileToFunctions(template) {
  // 1、需要将html代码转换成 ast语法树 (可以用ast树来描述语言本身)

  let ast = parseHTML(template)

  // 2、通过这棵树 重新的生成代码
  
}

/* 
  ast语法树 是用来描述代码的，可以描述 css html js  (根据语法生成的固定逻辑)
  虚拟dom 用来描述dom结构的
*/