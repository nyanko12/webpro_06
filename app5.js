const express = require("express");
const session = require("express-session");
const app = express();

app.use(session({
  secret: 'nyanko',   
  resave: false,
  saveUninitialized: true,     
}));


app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});//わからないことがあったらこのように表示させるようにする
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  let judgement = '';
  // 複数の条件を組み合わせるために||(論理和演算子)を用いる
  if((cpu == 'グー' && hand == 'パー') ||
     (cpu == 'チョキ' && hand == 'グー') ||
     (cpu == 'パー' && hand == 'チョキ')){
      judgement = '勝ち';
      win += 1;
  }else if((cpu == 'グー' && hand == 'グー') ||
           (cpu == 'チョキ' && hand == 'チョキ') ||
           (cpu == 'パー' && hand == 'パー')){
          judgement = 'あいこ';
  }else judgement = '負け';

  total +=1;
  // 今はダミーで人間の勝ちにしておく
  //let judgement = '勝ち';
  //win += 1;
  //total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/question", (req, res) => {
  let score=0;

  if( req.query.test1 ) score -= 20;
  if( req.query.test2 ) score += 20;
  if( req.query.test3 ) score += 30;
  if( req.query.test4 ) score -= 30;
  if( req.query.test5 ) score -= 50;
  if( req.query.test6 ) score += 50;

  res.render( 'question', {score: score});
})

app.get("/number", (req, res) => {
  if(!req.session.answer){
    req.session.answer = Math.floor(Math.random() * 100 + 1);
  }

  const value = req.query.range;
  const answer = req.session.answer;
  let judgement = '';
  if(value == answer) judgement = 'ピッタリ';
  else {
    judgement = value - answer;
  }

  res.render( 'number', {answer: answer.toString() , judgement: judgement});
})

app.listen(8080, () => console.log("Example app listening on port 8080!"));
