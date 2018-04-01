'use strict';

module.exports = {
  app: {
    title: 'SOSO',
    description: 'Full-Stack JavaScript with MongoDB, KOA, and Node.js',
    keywords: 'SOSO',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID',
    baiduApiAccessKey: 'BPM81XvGHo3NvZ1QrkGa2eXc'
  },
  port: process.env.PORT || 8080,
  templateEngine: 'swig',
  requestCacheMaxage: 300000,
  cookies:{
    keys:{
      uid          :'uid',
      lid          :'lid',
      token        :'t',
      verifycode   :'vc',
      openid       :'openid',
      province     :'province',
      city         :'city',
      address      :'address',
      lon          :'lon',
      lat          :'lat',
      cart         :'cart',
      cartcount    :'cartcount',
      dzparams     :'dzparams',
      settlement   :'settlement',
      firstshow    :'firstshow',
      isauth       :'isauth'
    },
    secret: process.env.SESSION_SECRET || 'ELAB',
    options:{
      // session expiration is set by default to 24 hours
      maxAge: 24 * (60 * 60 * 1000),
      //path of the cookie (/ by default).
      path: '/',
      //domain of the cookie (no default).
      domain: '.elab-plus.com',
      // httpOnly flag makes sure the cookie is only accessed
      // through the HTTP protocol and not JS/browser
      httpOnly: true,
      // secure cookie should be turned to true to provide additional
      // layer of security so that the cookie is set only when working
      // in HTTPS mode.
      secure: false,
      // whether the cookie is to be signed (false by default). If this is true,
      // another cookie of the same name with the .sig suffix appended will also
      // be sent, with a 27-byte url-safe base64 SHA1 value representing the hash
      // of cookie-name=cookie-value against the first Keygrip key. This signature
      // key is used to detect tampering the next time a cookie is received.
      signed:false,
      // whether to overwrite previously set cookies of the same name (false by default).
      // If this is true, all cookies set during the same request with the same name
      // (regardless of path or domain) are filtered out of the Set-Cookie header
      // when setting this cookie.
      overwrite:true
    }
  },
  aesKey:'eNwAzoxuSabIOGt/NUdvi2AiC3d7N54sMYQHSiqD36RUwyMZGI3qqcxWFz7XKThLUJ2mowDZV3WRmd35Nm4ir+963tlWFdQ35vZJb+lk3TZDjehNpfziipyziGraO74Y7ANQtKuYcBrpk0w8hbpHxrBZGVde3gURAkbxCmU5nq',
  verifycodeMaxage: 180000,
  authTokenMaxage : 7 * 24 * (60 * 60 * 1000),
  logo: '/img/brand/logo.png',
  favicon: '/favicon.ico',
  hotline : '021-12345678',
  pictureServers:[
    '//139.196.6.132:7777',
    '//139.196.6.132:7777'
  ],
  //uploadUrl: 'http://116.236.171.98:7778/post',
  uploadUrl: 'http://139.196.6.132:8080/post',
  upload:{
    'default':{
      maxlength: 2048,
      allowtype: ['png', 'jpg', 'jpeg'],
      pathrule: 'guid',
      appKey: 'JH0M7A4HQOF1DMDV',
      iv:'5E4F432DEWD32WRV',
      desKey:'ACE4F440D45CE1CCF7CB702F'
    },
    'avator': {
      maxlength: 2048,
      allowtype: ['png', 'jpg', 'jpeg'],
      pathrule: 'guid',
      appKey: 'N8YMDR62QE2ZKKF6',
      iv:'5E4F432DEWD32WRV',
      desKey:'ACE4F440D45CE1CCF7CB702F'
    },
    'post':{
      maxlength: 2048,
      allowtype: ['png', 'jpg', 'jpeg', 'gif'],
      thumbnails: ['1280*960','640*480','320*240','160*120','80*60','40*30','20*15'],
      pathrule: 'guid',
      appKey: 'JH0M7A4HQOF1DMDV',
      iv:'5E4F432DEWD32WRV',
      desKey:'ACE4F440D45CE1CCF7CB702F'
    }
  },
  routers:{
    'account-reg-index' : {url:'/account/reg/index'  ,auth: false, ssl: false, cache: true},
    'account-reg-acctStatusCheck':{url:'/account/reg/acctStatusCheck'  ,auth: false, ssl: false, cache: false},
    'account-reg-signup': {url:'/account/reg/signup' ,auth: false, ssl: false, cache: true},

    'auth-login-index'  : {url:'/auth/login/index'         ,auth: false, ssl: false , cache: true},
    'auth-login-signin' : {url:'/auth/login/signin'        ,auth: false, ssl: false , cache: false},

    'vc-sms-web'        : {url:'/vc/web/verifycode.png' ,auth: false, ssl: false, cache: false, max:3},
    'vc-sms-signup'     : {url:'/vc/sms/signup'         ,auth: false, ssl: false, cache: false},
    'vc-sms-signin'     : {url:'/vc/sms/signin'         ,auth: false, ssl: false, cache: false},

    'upload-img'        : {url:'/upload/img'         ,auth: false, ssl: false, cache: false},


    'bbs-card-index'    : {url:'/bbs/card/list/:houseid'       ,auth: false, ssl: false, cache: false},
    'bbs-card-page'    : {url:'/bbs/card/page'       ,auth: false, ssl: false, cache: false},
    'bbs-card-like'     : {url:'/bbs/card/like'      ,auth: true, ssl: false, cache: false, max: 5},
    'bbs-card-post'     : {url:'/bbs/card/post/:houseid'      ,auth: true, ssl: false, cache: false},
    'bbs-card-create'   : {url:'/bbs/card/create'       ,auth: true, ssl: false, cache: false, max: 5},

    'bbs-card-review'  : {url:'/bbs/card/review'       ,auth: false, ssl: false, cache: false},
    'bbs-card-comment'  : {url:'/bbs/card/comment'       ,auth: false, ssl: false, cache: false, max: 5},
    'index-house-search'  : {url:'/index/houseDetail'       ,auth: false, ssl: false, cache: false},
    //---------------------我的消息相关web-----------------------//
    'mine-bbscard-web' :{url:'/messages/posts'       ,auth: true, ssl: false, cache: false},
    'mine-bbscard-detail-web' :{url:'/messages/postDetail/:id'       ,auth: false, ssl: false, cache: false},
    'mine-comment-web' :{url:'/messages/comment'       ,auth: true, ssl: false, cache: false},
    'mine-letter-web' :{url:'/messages/letter'       ,auth: true, ssl: false, cache: false},
    'mine-letter-detail-web' :{url:'/messages/letterDetail/:sid'       ,auth: true, ssl: false, cache: false},
    'mine-letter-detail-page-web' :{url:'/messages/letterDetail'       ,auth: true, ssl: false, cache: false},
    'mine-attention-web' :{url:'/messages/attention'       ,auth: true, ssl: false, cache: false},
    'mine-sendletter-web' :{url:'/mine/letter/send'       ,auth: true, ssl: false, cache: false,max:5},
    'set-fans-web'  : {url:'/add/fans'       ,auth: true, ssl: false, cache: false},
    'mine-collection-web' :{url:'/collection/list'       ,auth: true, ssl: false, cache: false},
    'mine-fanstome-web' :{url:'/mine/attention'       ,auth: true, ssl: false, cache: false},
    'mine-fans-web' :{url:'/mine/fans'       ,auth: true, ssl: false, cache: false},

    //---------------------个人资料相关web-----------------------//
    'person-web'  : {url:'/person/info'       ,auth: true, ssl: false, cache: false},
    'person-info-web'  : {url:'/person/tabs/page'       ,auth: false, ssl: false, cache: false},
    'person-modify-info-web'  : {url:'/person/modify/info/:t'       ,auth: true, ssl: false, cache: false},
    'person-modify-pro-web'  : {url:'/person/modify/pro'       ,auth: true, ssl: false, cache: false},
    'person-modify-city-web'  : {url:'/person/modify/city/:pname'       ,auth: true, ssl: false, cache: false},
    'person-modify-dict-web'  : {url:'/person/modify/dict/:pname/:cname'       ,auth: true, ssl: false, cache: false},
    'person-modify-web' : {url:'/person/modify'       ,auth: true, ssl: false, cache: false},

    //---------------------tips-----------------------//
    'tips-index'  :          {url:'/tips/index/:houseid'   ,auth: true, ssl: false, cache: false},
    'tips-school-search'  : {url:'/tips/school/search'   ,auth: false, ssl: false, cache: false},
    'tips-save'  :          {url:'/tips/save'   ,auth: false, ssl: false, cache: false},
    'tips-layout-delete'  : {url:'/tips/layout/delete'   ,auth: false, ssl: false, cache: false},
    'tips-traffic-delete'  : {url:'/tips/traffic/delete'   ,auth: false, ssl: false, cache: false},
    'tips-school-delete'  : {url:'/tips/school/delete'   ,auth: false, ssl: false, cache: false},
    'tips-price-calculate'  : {url:'/tips/price/calculate'   ,auth: false, ssl: false, cache: false},
    'tips-open-list'      :{url:'/tips/open/list/:houseid'   ,auth: false, ssl: false, cache: false},
    'tips-open-page'      :{url:'/tips/open/page'   ,auth: false, ssl: false, cache: false},
    'tips-my-list'        : {url:'/tips/mine/list'       ,auth: true, ssl: false, cache: false},
    'tips-my-page'        : {url:'/tips/mine/page'       ,auth: true, ssl: false, cache: false},
    'tips-my-check'       :{url:'/tips/mine/check'       ,auth: true, ssl: false, cache: false},
    'tips-my-remove'      :{url:'/tips/mine/remove'       ,auth: true, ssl: false, cache: false, max: 5},
    'tips-my-compare'     :{url:'/tips/mine/compare/:refer'      ,auth: true, ssl: false, cache: false},
    'tips-my-see'         :{url:'/tips/mine/see/:houseid/:refer/:other/:name'      ,auth: true, ssl: false, cache: false},
    'tips-my-lock'        :{url:'/tips/mine/lock'      ,auth: true, ssl: false, cache: false},
    'tips-my-detail'     :{url:'/tips/mine/detail/:houseid/:tipsid'      ,auth: true, ssl: false, cache: false},
    'tips-check-detail'   :{url:'/tips/detail/:houseid/:tipsid'      ,auth: false, ssl: false, cache: false},

	//---------------------楼盘收藏数-----------------------//
    'house-collection-web' : {url:'/house/collection/count', auth:false,ssl:false,cache:false},
    'house-collection-update-web' : {url:'/house/collection/update', auth:false,ssl:false,cache:false},
    'house-collection-set-web' : {url:'/house/collection/set', auth:false,ssl:false,cache:false},

    //-----------------------地址搜索 调百度api 返回详细地址及经纬度---------------------------//
    'search-bdapiaddress-web' : {url:'/search/address/bdapi', auth:false,ssl:false,cache:false},
    'search-housename' : {url:'/index/search/housename', auth:false,ssl:false,cache:false},
    'city-saveCookie' : {url:'/index/saveCityCookie', auth:false,ssl:false,cache:false},
    'city-price':{url:'/index/citybyprice', auth:false,ssl:false,cache:false}
  },
  wsHost:"http://localhost:9000",
  wsRouters :{
    'account-reg-check'   :{method: 'POST', url:'/customer/validMobile'},
    'account-reg-signup'  :{method: 'POST', url:'/customer/register'},
    'account-init' : {method:'POST', url:'/customer/initoutsystem'},

    'vc-sms'        :{method: 'POST', url:'/customer/messageValidCode'},

    'auth-login-signin' :{method: 'POST', url:'/customer/login'},
    'auth-user-login'   :{method: 'POST', url:'/user/login'},

    'bbs-card-list'   :{method: 'POST', url:'/bbs/card/list'},
    'bbs-card-like'   :{method: 'POST', url:'/bbs/card/like'},
    'bbs-card-create'   :{method: 'POST', url:'/bbs/card/create'},

    'bbs-card-comment'  :{method: 'POST', url:'/bbs/card/comment'},
    'bbs-card-reply'  :{method: 'POST', url:'/bbs/card/resp'},

    //---------------------我的收藏相关 service-----------------------//
    'collection-list-service' :{method: 'POST', url:'/collection/list'},

    //---------------------我的消息相关 service-----------------------//
    'mine-posts-detail-service' :{method: 'POST', url:'/mine/bbscard/detail'},
    'mine-bbscard-service' :{method: 'POST', url:'/mine/bbscard'},
    'mine-comment-service' :{method: 'POST', url:'/mine/comment'},
    'mine-letters-service' :{method: 'POST', url:'/mine/letters'},
    'mine-letterdetail-service' :{method: 'POST', url:'/mine/letterdetail'},
    'mine-sendletter-service' :{method: 'POST', url:'/mine/letter/send'},
    'mine-systemremind-service' :{method: 'POST', url:'/sys/remind/list'},
    'mine-attention-service' :{method: 'POST', url:'/follow/my'},
    'mine-attention-detail-service' :{method: 'POST', url:'/sys/remind/detail'},
    'mine-fans-service' :{method: 'POST', url:'/follow/fm'},
    'set-fans-service'  : {method: 'POST', url:'/follow/update'},

    //---------------------个人资料相关 service----------------------//
    'person-info-service'  : {method: 'POST', url:'/person/info'},
    'person-tips-service' : {method: 'POST', url:'/person/tips'},
    'person-modify-service' : {method: 'POST', url:'/person/modify'},

    //---------------------tips-----------------------//
    'tips-save'  :{method: 'POST', url:'/tips/saveUpdateTips'},
    'tips-query'  :{method: 'POST', url:'/tips/houseFindByTips'},
    'tips-layout-delete'  :{method: 'POST', url:'/tips/deleteTipsHuxing'},
    'tips-traffic-delete'  :{method: 'POST', url:'/tips/delTipsTraffic'},
    'tips-school-delete'  :{method: 'POST', url:'/tips/delTipsSchool'},
    'tips-price-calculate'  :{method: 'POST', url:'/tips/calculationHuxing'},

    //---------------------mytips-----------------------//
    'tips-my-list'    :{method: 'POST', url: '/mytips/tipsList'},
    'tips-my-delete'  :{method: 'POST', url: '/mytips/removeTips'},
    'tips-my-compare' :{method: 'POST', url: '/mytips/contrastTips'},
    'tips-my-lock'    :{method: 'POST', url: '/mytips/see'},

    'tips-open-list'    :{method: 'POST', url: '/tips/open/list'},
    'tips-common-detail'  :{method: 'POST', url:'/tips/detail'},

    //-----------------------house collection---------------------------//
    'house-collection' : {method:'POST', url : '/collection/house/count'},
    'house-collection-update-service' : {method:'POST', url : '/collection/update'},
    'house-collection-delete-service' : {method:'POST', url : '/collection/delete'},

    //-----------------------地址搜索 调百度api 返回详细地址及经纬度---------------------------//
    'search-bdapiaddress-service' : {method:'POST', url : '/keyvalue/search'},
    'index-city-choose':{method:'POST',url:'/house/city/price'}

  },
  solrHosts:[
//    'http://192.168.0.15:8082',
//    'http://192.168.0.16:8082',
    'http://192.168.0.20:8083'
  ],
  solrRouter:{
    'house-housename-detail':{method:'POST',url:'/house/findHouseNameByDetail'},
    'house-map': {method: 'POST' , url:'/house/findHouse'},

    //---------------------楼盘详细-----------------------//
    'house-detail' :{method:'POST', url:'/house/findHouseIdByHouse'},

    /*周边学校*/
    'house-detail-school':{method:'POST', url:'/house/findHouseDetailShools'},
    /*周边楼盘*/
    'house-detail-house':{method:'POST', url:'/house/findHouseDetailOutsidehouse'},
    /*周边配套*/
    'house-detail-support':{method:'POST', url:'/house/findHouseDetailMating'}
  },
  homeCity:[
     {"province":"上海","city":"上海市"},
     {"province":"重庆","city":"重庆市"},
     {"province":"河南省","city":"郑州市"}
  ]
};
