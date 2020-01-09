//index.js
//获取应用实例
const app = getApp()

var date = new Date();
date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

Page({
  data: {
    goodsInfo:[],
    curGoodsInfo:null,
    curIndex:0,
    totalCount:10,
    time: date,
    buyText:"",
  },

  onLoad:function(e){
    var that = this;
    wx.request({
      url: 'https://www.mingshukeji.com.cn/api/RecommandGoods/GetRecentGoodsList',
      success:function(res){
        // console.log(res.data);
        var goods = res.data.data.DataList;
        var totalCount = res.data.data.TotalCount;
        that.setData({
          goodsInfo:goods,
          curGoodsInfo:goods[0],
          totalCount: totalCount,
        });
        
        wx.request({
          url: 'https://www.mingshukeji.com.cn/api/RecommandGoods/ClickCounIncrement',
          method: "POST",
          data: {
            id: goods[0].ID,
          },
        });
      }
    })
  },

  onShareAppMessage:function(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.curGoodsInfo.reason,
      path: '/page/index/index'
    }
  },

  buy:function(e){
    wx.setClipboardData({
      data: this.data.curGoodsInfo.command,
      success:function(res){
        wx.showModal({
          title: '优惠券获取成功',
          content: '请打开手机淘宝领取并购买！',
        })
      }
    })
  },

  next:function(e){
    var curIndex = this.data.curIndex + 1;
    if (curIndex == this.data.totalCount){
      wx.showToast({
        title: '已无更多推荐',
      });
      curIndex = 0;
    }
    var goodsInfo = this.data.goodsInfo[curIndex];
    // console.log(this.data.goodsInfo[curIndex]);
    this.setData({
      curIndex:curIndex,
      curGoodsInfo: goodsInfo,
      buyText:"",
    })

    wx.request({
      url: 'https://www.mingshukeji.com.cn/api/RecommandGoods/ClickCounIncrement',
      method: "POST",
      data: {
        id: goodsInfo.ID,
      },
    });
  },
})
;