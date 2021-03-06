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
  let market_id = this.query.market_id;
  console.log('market_id-----------'+market_id)
  if (market_id ==null || market_id == 'undefined') {
      market_id =1324;
  }
  var params =
  {
    'code':'ea7b7292929c10ba25574dc0bd733cc4',
    'direction':'asc',
    'language' : 'zh_CN',
    'market_id' : market_id,
    'page' : '1',
    'platform' : 'm',
    'size' : '50',
    'sort' : 'rank',
    'timestamp' : '1522580891234',
    'v' : '1.4.0'

  };
  //获取币名称
  var res = yield this.webservice('get', 'https://api2.mytoken.org/currency/currencylist?',params);
  /**
   * 全部行情的 子项文字
   */
  var resOther = yield this.webservice('get', 'https://api2.mytoken.org/market/topmarketlist?timestamp=1522552288870&code=833473afddb7949b6c9b9aaae04155ca&v=1.4.0&platform=m&language=zh_CN&',{});
  let info = null;
  let resOtherList =null;
  if(res.code ==0 && resOther.code ==0){
    console.log("--------"+res);
    info = res.data.list;
    resOtherList = resOther.data.list;

  }
  yield this.render('other', {
    noFoot: true,
    noHead : true,
    title : "other",
    description : "other",
    info : info,
    resOtherList:resOtherList

  });

};
handlers.zhidao = function*(){
  let type = this.query.type;
  console.log('type-----------'+type)
  if (type ==null || type == 'undefined') {
      type =1;
  }
  // let mobile = this.params.mobile;
  // var params = { 'mobile' : mobile };
  //获取币名称
  var res = yield this.webservice('get', 'https://api2.mytoken.org/media/medialist?type='+type+'&keyword=exchange_announcement&tag=&page=2&timestamp=1522493677725&code=8ef475ad7bd602677269a00cb14e30f1&v=1.4.0&platform=m&language=zh_CN&',{});
  /**
   * 早知道 子项文字
   */
  var resZhiDao = yield this.webservice('get', 'https://api2.mytoken.org/media/categorylist?timestamp=1522542680379&code=63064150d34678bb6f0dc1a367f9e93d&v=1.4.0&platform=m&language=zh_CN&',{});

  let planInfo = null;
  let resZhiDaoList =null;
  if(res.code ==0 && resZhiDao.code ==0){
    console.log("111--------"+res);
    planInfo = res.data.list;
    resZhiDaoList = resZhiDao.data.list;

  }
  yield this.render('zhidao', {
    noFoot: true,
    noHead : true,
    title : "h5demo",
    description : "zhidao",
    planInfo : planInfo,
    resZhiDaoList:resZhiDaoList

  });
};

handlers.zhidaos = function*(){
  let type = this.query.type;
  console.log('type-----------'+type)
  if (type ==null || type == 'type') {
    type =1;
  }
  // let mobile = this.params.mobile;
  // var params = { 'mobile' : mobile };
  //获取币名称
  var res = yield this.webservice('get', 'https://api2.mytoken.org/media/medialist?type='+type+'1&keyword=exchange_announcement&tag=&page=2&timestamp=1522493677725&code=8ef475ad7bd602677269a00cb14e30f1&v=1.4.0&platform=m&language=zh_CN&',{});

  let planInfo = null;
  let resZhiDaoList =null;
  if(res.code ==0 ){
    console.log("111--------"+res);
    planInfo = res.data.list;
    resZhiDaoList = resZhiDao.data.list;

  }
  yield this.render('zhidao', {
    noFoot: true,
    noHead : true,
    title : "h5demo",
    description : "zhidao",
    planInfo : planInfo,
    resZhiDaoList:resZhiDaoList

  });
};

handlers.others = function*(){
  let market_id = this.params.market_id;
  /*let params = {
    "projectId": projectId,
    "customerId": customerId,
    "followModality": followModality
  };*/
 /* var params =
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

  };*/
  /*var res = yield this.webservice('get', 'https://api2.mytoken.org/media/medialist?type=1&keyword=exchange_announcement&tag=&page=2&timestamp=1522493677725&code=8ef475ad7bd602677269a00cb14e30f1&v=1.4.0&platform=m&language=zh_CN&',{});*/
  let res = yield this.webservice('get','https://api2.mytoken.org/currency/currencylist?market_id='+market_id+'+&page=1&size=20&direction=asc&sort=rank&timestamp=1522552504356&code=42bbf99ed4490fd0af0720351cfee1c7&v=1.4.0&platform=m&language=zh_CN', {});
  let resultSet = null;
  if(res.code ==0){
    resultSet = res.data.list;
  }
  yield this.render('other', {
    noFoot: true,
    noHead : true,
    title : "others",
    description : "others",
    resultSet: resultSet
  });
};

handlers.kline = function*(){
  let timestamp = this.query.timestamp;
  let code = this.query.code;
  var params =
  {
    'timestamp':timestamp,
    'code':code,
    'market_name' : 'Binance',
    'market_id' : '338',
    'device_os' : '7.1.1',
    'time' : timestamp,
    'com_id' : 'btc_usdt',
    'v' : '1.6.5',
    'platform' : 'android',
    'mytoken' : '36c8d648abded3134107a49f53bb6b50',
    'anchor' : 'USDT',
    'period' : '3m',
    'device_model' : 'PRO%206s',
    'device_token' : 'AjdevmmmrvH8AWjlevR8mxf9gnKNBLMyPEihAS6Y8EgP',
    'udid' : 'PRO%ffffffff-e4f8-f1b1-3c6c-3a0b441c8212',
    'language' : 'zh_CN',
    'legal_currency' : 'CNY',
    'symbol':'BTC',
    'limit':'90'

  };
  console.log(timestamp+"==========="+code);
  var res = yield this.webservice('get', 'http://api.lb.mytoken.org/currency/kline?timestamp='+timestamp+'&code='+code+'&market_name=Binance&device_os=7.1.1&time='+timestamp+'&com_id=btc_usdt&market_id=338&v=1.6.5&platform=android&mytoken=36c8d648abded3134107a49f53bb6b50&anchor=USDT&period=3m&device_model=PRO%206s&device_token=AjdevmmmrvH8AWjlevR8mxf9gnKNBLMyPEihAS6Y8EgP&language=zh_CN&udid=ffffffff-e4f8-f1b1-3c6c-3a0b441c8212&legal_currency=CNY&symbol=BTC&limit=90',{});
  let url1= 'http://api.lb.mytoken.org/currency/kline?timestamp='+timestamp+'&code='+code+'&market_name=Binance&device_os=7.1.1&time='+timestamp+'&com_id=btc_usdt&market_id=338&v=1.6.5&platform=android&mytoken=36c8d648abded3134107a49f53bb6b50&anchor=USDT&period=3m&device_model=PRO%206s&device_token=AjdevmmmrvH8AWjlevR8mxf9gnKNBLMyPEihAS6Y8EgP&language=zh_CN&udid=ffffffff-e4f8-f1b1-3c6c-3a0b441c8212&legal_currency=CNY&symbol=BTC&limit=90';
  let url2='http://api.lb.mytoken.org/currency/kline?';
  //let resKline = yield this.webservice('get',res, {});
  let resultSet = null;
  if(res.code ==0){
    console.log('res'+JSON.stringify(res.data));
    resultSet = res;
  }

  yield this.render('kline', {
    noFoot: true,
    noHead : true,
    title : "kline",
    description : "kline",
    resultSet: resultSet
  });

};


