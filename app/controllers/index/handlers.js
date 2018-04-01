'use strict';

let handlers = module.exports = {};
let multipart = require('co-multipart')

/*handlers.index = function*(){
  var res = yield this.webservice('get', 'https://api2.mytoken.org/market/topmarketlist?timestamp=1522386300471&code=1d60160993af55a76f51bf2a3b96157b&v=1.4.0&platform=m&language=zh_CN&mytoken=74d86b8691bf7433c8557730573764f1&',{});
  yield this.json(res);
};*/

handlers.test = function*(){
  yield this.render('test', {
    noFoot: true,
    noHead : true,
    title : "test",
    description : "test"
  });

};
/**
 * 市值
 */
handlers.shizhi = function*(){
  // let mobile = this.params.mobile;
  // var params = { 'mobile' : mobile };
  //获取币名称
  var res = yield this.webservice('get', 'https://api2.mytoken.org/market/topmarketlist?timestamp=1522386300471&code=1d60160993af55a76f51bf2a3b96157b&v=1.4.0&platform=m&language=zh_CN&mytoken=74d86b8691bf7433c8557730573764f1&',{});
  //获取后面值
  var resLast = yield this.webservice('get', 'https://api2.mytoken.org/currency/currencylist?market_id=1303&page=1&size=20&direction=asc&sort=rank&timestamp=1522552504356&code=42bbf99ed4490fd0af0720351cfee1c7&v=1.4.0&platform=m&language=zh_CN',{});
  /*var resLast = yield this.webservice('get', 'https://api2.mytoken.org/currency/currencylist',{});*/

  let planInfo = null;
  let planInfoList = null;
  if(res.code ==0 && resLast.code ==0){
    console.log("--------"+res);
    planInfo = res.data.list;
    planInfoList = resLast.data.list;

  }
  yield this.render('shizhi', {
    noFoot: true,
    noHead : true,
    title : "shizhi",
    description : "shizhi",
    planInfo : planInfo,
    planInfoList:planInfoList

  });

};

/**
 * 市值后面的tag
 */
handlers.other = function*(){
  // let mobile = this.params.mobile;
  var params =
  {
    'code':'ea7b7292929c10ba25574dc0bd733cc4',
    'direction':'asc',
    'language' : 'zh_CN',
    'market_id' : '1324',
    'page' : '1',
    'platform' : 'm',
    'size' : '50',
    'sort' : 'rank',
    'timestamp' : '1522580891234',
    'v' : '1.4.0'

  };
  //获取币名称
  var res = yield this.webservice('get', 'https://api2.mytoken.org/currency/currencylist?',params);

  let info = null;
  if(res.code ==0 ){
    console.log("--------"+res);
    info = res.data.list;

  }
  yield this.render('other', {
    noFoot: true,
    noHead : true,
    title : "other",
    description : "other",
    info : info

  });

};
handlers.zhidao = function*(){
  // let mobile = this.params.mobile;
  // var params = { 'mobile' : mobile };
  //获取币名称
  var res = yield this.webservice('get', 'https://api2.mytoken.org/media/medialist?type=1&keyword=exchange_announcement&tag=&page=2&timestamp=1522493677725&code=8ef475ad7bd602677269a00cb14e30f1&v=1.4.0&platform=m&language=zh_CN&',{});

  let planInfo = null;
  if(res.code ==0 ){
    console.log("111--------"+res);
    planInfo = res.data.list;

  }
  yield this.render('zhidao', {
    noFoot: true,
    noHead : true,
    title : "h5demo",
    description : "zhidao",
    planInfo : planInfo

  });

};


