"use strict";

let number=0;
const bbs = document.querySelector('#bbs');
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    const params = {  // URL Encode
        method: "POST",
        body:  'name='+name+'&message='+message,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log( params );
    const url = "/post";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        console.log( response );
        document.querySelector('#message').value = "";
    });
});



document.querySelector('#check').addEventListener('click', () => {
    const params = {  // URL Encode
        method: "POST",
        body:  '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        let value = response.number;
        console.log( value );

        console.log( number );
        if( number != value ) {
            const params = {
                method: "POST",
                body: 'start='+number,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'               
                }
            }
            const url = "/read";
            fetch( url, params )
            .then( (response) => {
                if( !response.ok ) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then( (response) => {
                number += response.messages.length;
                for( let mes of response.messages ) {
                    let cover = document.createElement('div');
                    cover.className = 'cover';
                    //　削除機能といいね機能を作動させるためにidを付与している
                    cover.id = 'post-' + mes.id;
                    let name_area = document.createElement('span');
                    name_area.className = 'name';
                    name_area.innerText = mes.name;
                    let mes_area = document.createElement('span');
                    mes_area.className = 'mes';
                    mes_area.innerText = mes.message;
                    
                    //　リアルタイムの表示
                    let timestamp_area = document.createElement('span');
                    timestamp_area.className = 'timestamp';
                    timestamp_area.innerText = new Date(mes.timestamp).toLocaleString();

                    // 削除機能
                    let delete_btn = document.createElement('button');
                    delete_btn.innerText = '削除';
                    delete_btn.addEventListener('click', () => {
                        delete_post(mes.id);
                    });

                    // いいね機能
                    let like_btn = document.createElement('button');
                    if (mes.likes==undefined) mes.likes=0;
                    like_btn.innerText = 'いいね'+mes.likes;  
                    like_btn.addEventListener('click', () => {
                        like_post(mes.id);
                    });

                    cover.appendChild(name_area);
                    cover.appendChild(mes_area);
                    //　追加した部分
                    cover.appendChild(timestamp_area);  
                    cover.appendChild(like_btn);  
                    cover.appendChild(delete_btn);  

                    bbs.appendChild(cover);
                }
            });
        }
    });
});

// 投稿削除機能の処理
function delete_post(id) {
    const params = {
        method:"POST",
        body:'id='+id,
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };
    const url = "/delete";
    fetch(url, params)
        .then(response => {
            if (!response.ok) throw new Error('削除エラー');
            return response.json();
        })
        .then(response => {
            if (response.success) {
                const postElement = document.querySelector('#post-'+id);
                if (postElement) postElement.remove();
            } 
        })
}

// いいね機能の処理
function like_post(id) {
    const params = {
        method: "POST",
        body: 'id='+id,
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };
    const url = "/like";
    fetch(url, params)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.json();
        })
        .then((response) => {
            if (response.success) {
                const like_btn=document.querySelector('#post-'+id+' button');
                like_btn.innerText='いいね'+response.likes;  
            }
        })
}

