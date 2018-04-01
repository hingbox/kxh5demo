#refresher
--例如当前页面需要“上拉加载更多”功能，
--可以在页面任意元素（body, div, p, table等）
--上设置 data-toggle="refresher" 就可开启。
<div class="list" data-toggle="refresher"></div>

##事件
1.上拉加载
$(document).on('loadingmore',function(event, refresher){
  //do loadingmore
  console.log("loadmore ok");

  //after loadmore
  refresher.hide();
});

#modal
##iframe
elab.modal.show({noHead:true,noFoot:true,iframe:true,url:'/auth/login/index'});

##html 或者文本
elab.modal.show({
  content:'hello world',
  yesCB: function(){
    console.log("ok");
  },
  noCB:function(){
    console.log("ok");
  }
});

##主动
关闭
elab.modal.close();
