var parseSentence = (sentenceString, wordMark) => {
  var sentenceRaw = sentenceString.split(" ");
  var sentence = [];
  var symbolFlag = false;
  for(let item of sentenceRaw){
    var word = {};
    var symbol = {};
    word.selected = false;
    if(!isLetter(item[item.length-1])){
      word.word = item.slice(0, item.length-1);
      symbol.word = item[item.length-1];
      symbol.type = 0;
      symbolFlag = true;
    }
    else{
      word.word = item;
    }
    if(word.word == wordMark){
      word.type = 2;
    }
    else{
      word.type = 1;
    }
    sentence.push(word);
    if(symbolFlag){
      sentence.push(symbol);
    }
  }
  return sentence;
}

var isLetter = (char) => {
  var patt=new RegExp("[a-zA-Z]");
  return patt.test(char)
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {parseSentence,
  formatTime: formatTime}