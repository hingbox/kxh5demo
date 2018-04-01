// 'use strict';
// 
// let _ = require('lodash');
// let pathToRegexp = require('path-to-regexp');
// let config = require('../config');
// let path = require('path');
// let ModelError = require(path.resolve('models/modelerror'));
// let errorenum = require(path.resolve('models/errorenum'));
//
// let request = require('./cogent').extend({
//   'buffer' : true,
//   'json'   : true,
//   'gunzip' : false,
//   'timeout': 30000,
//   'headers': {'content-type': 'application/json'}
// });
//
// module.exports = function(){
//   return ws;
//   function* ws(next){
//     let token = this.TOKEN || this.cookies.get(config.cookies.keys['token']);
//     let cusHeaders = {
//       'token': token || 'hello world'
//     };
//
//     this.webservice = function*(method, uri, params){
//       method = method.toLowerCase();
//       if(_.contains(['get','post','delete','put'],method)){
//         try{
//           return yield* request(uri,{
//             'method' : method,
//             'headers': cusHeaders
//           },params);
//         }catch(e){
//           if(e.status){
//             throw e;
//           }else{
//             var en = errorenum['Common_Network_Error'];
//             return {'success':false, 'code':en[0],'message':en[1]};
//           }
//         }
//       }else{
//         var en = errorenum['Common_Method_Not_Allowed'];
//         return {'success':false, 'code':en[0],'message':en[1]};
//       };
//     };
//
//     this.ws = function*(path, params){
//       let conf = config.wsRouters[path];
//       if(_.isEmpty(conf)){
//         var en = errorenum['Common_Param_Invalid'];
//         throw ModelError('middleware:ws',en[0],en[1]);
//       }
//
//       var method = conf['method'] || 'get'
//       , uri = config.wsHost + conf['url']
//       ;
//
//       method = method.toLowerCase();
//       if(_.contains(['get','post','delete','put'],method)){
//         try{
//           return yield* request(uri,{
//             'method' : method,
//             'headers': cusHeaders
//           },params);
//           return res;
//         }catch(e){
//           if(e.status){
//             throw e;
//           }else{
//             var en = errorenum['Common_Network_Error'];
//             return {'success':false, 'code':en[0],'message':en[1]};
//           }
//         }
//       }else{
//         var en = errorenum['Common_Method_Not_Allowed'];
//         return {'success':false, 'code':en[0],'message':en[1]};
//       };
//     };
//
//     yield next;
//   }
// }
