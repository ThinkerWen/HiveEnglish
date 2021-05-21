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

module.exports = {parseSentence}