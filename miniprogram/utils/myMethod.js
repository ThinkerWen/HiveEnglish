// 翻译接口配套加密
function truncate(q) {
    var len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}

// 朗读
function pronounce(e) {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    if (e.currentTarget.dataset.type == 0) { // 读来源
        if (this.testHans(this.data.searchReasult.wordHead)) { // 含英文
            innerAudioContext.src = API + this.data.searchReasult.wordHead + "&type=1"
        } else wx.showToast({
            title: '暂不支持非英文',
            icon: 'none',
            duration: 1500,
        })
    } else { // 读结果
        if (this.testHans(this.data.searchReasult.tranCn)) { // 含英文
            innerAudioContext.src = API + this.data.searchReasult.tranCn + "&type=1"
        } else wx.showToast({
            title: '暂不支持非英文',
            icon: 'none',
            duration: 1500,
        })
    }
    innerAudioContext.onPlay(() => {
        console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
    })
}

// 校验是否含有英文
function testHans(str) {
    for (var i in str) {
        var asc = str.charCodeAt(i);
        if ((asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122)) {
            return true;
        }
    }
    return false
}

module.exports = {
    truncate: truncate,
    testHans: testHans,
    pronounce: pronounce,
}