
var getFakeUserInfo = () => {
  var userInfo = {
    avatarUrl
      :
      "https://wx.qlogo.cn/mmopen/vi_32/hZFN3vLlkvyrI7Yhk9iaChXfq7oHxnxjfwcLLlAbCybjZhEQqEzr5sNibcribFmng3mVyCqUaEbw3F8me3DZh4ibRA/132",
    city
      :
      "Yantai",
    country
      :
      "China",
    gender
      :
      1,
    language
      :
      "zh_CN",
    nickName
      :
      "Rollbback",
    province
      :
      "Shandong"
  }
  return userInfo;
}

var getFakeTask = ()=>{
  var task = {
    newWords: [],
    oldWords: []
  }
  for (var i=0; i<20; i++){
    var word = {};
    var name = 'a'+i;
    word.name = name;
    word.sentence = name + 'not a big X';
    word.meaning = "n. 字幕";
    word.soundmark = "/a'res/";
    word.sentenceMeaning = "且随疾风前行";
    word.audioUrl = "";
    task.newWords.push(word);
    task.oldWords.push(word);
  }
  return task;
}

module.exports = {getFakeUserInfo, getFakeTask}