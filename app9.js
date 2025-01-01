"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// これより下はBBS関係
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

app.post("/read", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  const start = Number( req.body.start );
  console.log( "read -> " + start );
  if( start==0 ) res.json( {messages: bbs });
  else res.json( {messages: bbs.slice( start )});
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  console.log( [name, message] );
  //　リアルタイムの表示
  const id = Date.now();
  const timestamp = new Date();
  const isoString = timestamp.toLocaleString();
  // 本来はここでDBMSに保存する
  bbs.push( {id:id, name: name, message: message ,timestamp:timestamp, likes:0} );
  res.json( {number: bbs.length } );
});

app.post("/like", (req, res) => {
    const post_id = Number(req.body.id);
    const post = bbs.find(bbs => bbs.id == post_id);
    if (post) {
        if (!post.likes) post.likes = 0;  
        post.likes += 1;  
        res.json({ success:true, likes:post.likes });
    }else res.json({ success:false, message:"投稿が見つかりません" });
});

app.post("/delete", (req, res) => {
    const post_id = Number(req.body.id);
    for(let i=0; i<bbs.length; i++){
        if(bbs[i].id==post_id){
            bbs.splice(i,1);
            return res.json({success:true});
        }
    }
});

// サーバー起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));
