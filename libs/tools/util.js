

const {ora} = require('./module')
const async = require("async")
async function sleep(n){
  var timer = null;
   return new Promise((resolve,reject)=>{
     timer= setTimeout(() => {
       resolve();
       clearTimeout(timer)
     }, n);
   })
}
//页面的loading效果
async function wrapLoading(){
  let fn = arguments[0];
  let message = arguments[1];
  let args = toArray(arguments).slice(2) || []
  //判断当前的参数是否标准
  if(!isFn(fn) || !isString(message)){
    console.log("params error")
  }
 const spiner = ora(message);
 spiner.start(); //开启加载
 try{
   let repos = await fn(...args);
   spiner.succeed();
   return repos;
 }catch(e){
   spiner.fail("获取不到模板资源,请确保模板源正确,还有可能是网络异常导致, 重新尝试抓取模板资源中...")
   await sleep(1000)
   return wrapLoading(fn,message,...args)
 }
}

function toArray(arr){
  return Array.prototype.slice.call(arr)
}
function isFn(fn){
  return typeof fn =='function'
}
function isString(str){
  return typeof str =='string'
}

module.exports={
 sleep,
 wrapLoading,
 toArray:toArray,
 isString:isString,
}
