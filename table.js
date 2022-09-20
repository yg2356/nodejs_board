const bcrypt = require('bcrypt');
const express = require('express')
const fs = require('fs');
const app = express()

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

function 파일읽기(path) {
    return new Promise(function (resolve) {
        fs.readFile(path, function (err, cnt) {
            resolve(cnt);
        })
    })
}

function 폴더목록읽기(path) {
    return new Promise(function (resolve) {
        fs.readdir(path, function (err, cnt) {
            resolve(cnt);
        })
    })
}

function 파일쓰기(filename, body) {
    return new Promise(function (resolve) {
        fs.writeFile(filename, body, function () {
            resolve();
        })
    })
}

function 비크립트해쉬(password, salt) {
    return new Promise(function (resolve) {
        bcrypt.hash(password, salt, function (err, result) {
            resolve(result);
        })
    })
}
function 비크립트컴페어(ps, pwd) {
    return new Promise(function (resolve) {
        bcrypt.compare(ps, pwd, function (err, result) {
            resolve(result);
        });
    })
}

function 파일삭제(path) {
    return new Promise(function (resolve) {
        fs.unlink(path, function (err) {
            resolve();
        })
    })
}
app.post('/removecode', async function (req, res) {
    let no = req.query.id;
    let ps = req.body.password;
    let arr = await 폴더목록읽기('../boarddata/');
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i].split('_');
        if (parseInt(no) === parseInt(temp[0])) {
            flag = arr[i];
            break;
        }
    }
    let flag = 'error';
    let cnt = await 파일읽기('../boarddata/' + flag);
    cnt = cnt.toString();
    let pwd = cnt.split('\n')[1];
    let result = await 비크립트컴페어(ps, pwd);
    let path;
    if (result) {
        await 파일삭제('../boarddata/' + flag)
        path = '/list?page=1';
    } else {
        path = '/remove?id=' + no;
    }
    res.redirect(path)
});

app.get('/remove', function (req, res) {
    let str = '';
    let id = req.query.id;
    str += '<html>';
    str += '<head></head>';
    str += '<script>';
    str += '</script>';
    str += '<body>';
    str += '<form action="/removecode?id='
    str += id;
    str += '" method="post">';
    str += '<input type="password" name="password" size = "30" Placeholder = "비밀번호.">\n';
    str += '<input type ="submit" id="btn1" value="삭제">\n';
    str += '</form>\n';
    str += '</body>';
    str += '</html>';
    res.send(str);
})

app.get('/read', async function (req, res) {
    let str = '';
    let id = parseInt(req.query.id);
    let page = parseInt(req.query.page);
    str += '<html>';
    str += '<head></head>';
    str += '<body>';

    let arr = await 폴더목록읽기('../boarddata/');
    let flag = 'error';
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i].split('_');
        if (id === parseInt(temp[0])) {
            flag = arr[i];
            break;
        }
    }

    let cnt = await 파일읽기('../boarddata/' + flag);
    let wricnt = cnt.toString().split('\n');
    str += '<div style="color:red; font-family: fantasy; font-size:50px">'
    str += wricnt[0];
    str += '</div>';
    str += '<div style="color:green; font-family: fantasy; font-size:50px">';
    let data = '';
    for (let i = 2; i < wricnt.length; i++) {

        let line = '';
        for (let j = 0; j < wricnt[i].length; j++) {
            let char = '';
            if ('<' === wricnt[i][j]) {
                char = '&lt;';
            }
            else if ('>' === wricnt[i][j]) {
                char = '&gt;';
            } else {
                char = wricnt[i][j]
            }
            line += char;
        }
        data += line;
        data += '<br/>';
    }
    str += err ? 'err' : data;
    str += '</div>';
    str += '<a href="/list?page='
    str += page;
    str += '">뒤로가기</a>\n';
    str += '<a href="/remove?id=';
    str += id;
    str += '">삭제하기</a>';
    str += '</body>';
    str += '</html>';
    res.send(str);
})

app.post('/boardsubmit', async function (req, res) {
    let password = req.body.password;
    let title = req.body.title;
    let writer = req.body.writer;
    let content = req.body.table;
    // let {password,title,writer,content} = req.body;
    let result = await 비크립트해쉬(password, 10);
    let body = writer + '\n' + result + '\n' + content;
    let no;
    let arr = await 폴더목록읽기('../boarddata/');
    arr.sort(function (a, b) {
        let ano = parseInt(a.split('_')[0]);
        let bno = parseInt(b.split('_')[0]);
        if (ano > bno) return -1;
        if (ano < bno) return 1;
        return 0;
    });

    no = parseInt(arr[0].split('_')[0]) + 1;
    let data = encodeURIComponent(title);
    let filename = '../boarddata/' + no + '_' + data;

    await 파일쓰기(filename, body);
    res.redirect('/list?page=1');
});
app.get('/board', function (req, res) {
    let str = '';
    let page = parseInt(req.query.page);
    str += '<html>';
    str += '<head></head>';
    str += '<body>';
    str += '<form action="/boardsubmit" method="POST">';
    str += '<input type = "text" name = "writer" size = "30" Placeholder = "글쓴이"';
    str += 'style="width:300x; hegiht:800px; font-size:20px; border:2px solid skyblue; border-radius:2px; margin-right: 10px"';
    str += '>\n';
    str += '<input type = "password" name="password" size = "30" Placeholder = "비밀번호."';
    str += 'style="width:300x; hegiht:800px; font-size:20px; border:2px solid skyblue; border-radius:2px"';
    str += '>\n';
    str += '<div>';
    str += '<input type = "text" name = "title" size = "30" Placeholder = "제목을 입력해주세요."';
    str += 'style="width:300x; hegiht:800px; font-size:30px; border:2px solid skyblue; border-radius:5px; margin-top:10px; margin-bottom:15px"';
    str += '>\n';
    str += '</div>';

    str += '<div>';
    str += '<textarea name = "table" rows = "30" cols = "70" warp = "physical" style = "font-size:20px"></textarea>'
    str += '</div>';

    str += '<div>';
    str += '<input type = "submit" value = "제출">';
    str += '</div>';
    str += '</form>';
    str += '<div>'
    str += '<a href="/list?page='
    str += page;
    str += '">뒤로가기</a></div>';
    str += '</body>';
    str += '</html>';
    res.send(str);
})

app.get('/list', async function (req, res) {
    let amount = 10;
    let page = parseInt(req.query.page);
    let arr = await 폴더목록읽기('../boarddata/');
    let str = '';
    str += '<head>';
    str += '<style>';
    str += 'table{width:100%; border:1px solid #333333; border-collapse: collapse;}';
    str += 'th{padding:5px; border:1px solid #333333; text-align: center;}';
    str += 'td{padding: 10px; border:1px solid #333333; text-align: center;}';

    str += '#btn1{margin-right:-5px; border:1px solid skyblue; background-color:rgba(0,0,0,0); color:skyblue; padding:5px; border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px;}';
    str += '#btn2{margin-right:-5px; border:1px solid skyblue; background-color:rgba(0,0,0,0); color:skyblue; padding:5px; border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px;}';
    str += '#btn3{margin-right:-5px; border:1px solid skyblue; background-color:rgba(0,0,0,0); color:skyblue; padding:5px; border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px;}';
    str += '#btn4{margin-right:-5px; border:1px solid skyblue; background-color:rgba(0,0,0,0); color:skyblue; padding:5px; border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px;}';

    str += '#btn1:hover{color:red; background-color:yellow;}'
    str += '#btn2:hover{color:red; background-color:yellow;}'
    str += '#btn3:hover{color:red; background-color:yellow;}'
    str += '#btn4:hover{color:red; background-color:yellow;}'

    str += '</style>';

    str += '<script>\n';
    str += 'function init(){window.location.href ="/list?page=1";}\n'

    str += 'function back(){'
    if (page != 1) {
        str += 'window.location.href = "/list?page='
        str += (page - 1);
        str += '";'
    }
    str += '}\n';

    str += 'function front(){window.location.href = "/list?page='
    str += (page + 1);
    str += '";}\n'

    str += 'function board(){window.location.href = "/board?page='
    str += page;
    str += '";}\n'

    str += '</script>\n';
    str += '</head>';
    str += '<html>';
    str += '<body>';
    str += '<p style="font-size:32px; color:#FFDC37; font-family:돋움;"> 게시판 구현</p>';
    str += '<table>';
    str += '<tr>';
    str += '<th>No.</th>';
    str += '<th>제목</th>';
    str += '</tr>';
    arr.sort(function (a, b) {
        let ano = parseInt(a.split('_')[0]);
        let bno = parseInt(b.split('_')[0]);
        if (ano > bno) return -1;
        if (ano < bno) return 1;
        return 0;
    });
    arr = arr.splice((page - 1) * amount, amount);

    for (let i = 0; i < arr.length; i++) {
        str += '<tr>';
        let sp = arr[i].split('_');
        str += '<td>';
        str += '<div>';
        str += '<b style = "color: green;">';
        str += sp[0] + ' ';
        str += '</b>';
        str += '</td>';
        str += '<td>';
        str += '<a href="/read?id='
        str += sp[0];
        str += '&page=';
        str += page;
        str += '">\n';

        let title = '';
        for (let j = 1; j < sp.length; j++) {
            if (j > 1) {
                title += '_' + sp[j];
            }
            else {
                title += sp[j];
            }
        }

        str += decodeURIComponent(title);

        str += '</a>';
        str += '</div>';
        str += '\n';
        str += '</td>';
        str += '</tr>';
    }

    str += '</table>';
    str += '<div id="btn_group">';
    str += '<input type ="button" id="btn1" value="맨처음" onclick ="init()">\n';
    str += '<input type ="button" id="btn2" value="이전" onclick ="back()">\n';
    str += '<input type ="button" id="btn3" value="다음" onclick ="front()">\n';
    str += '<input type ="button" id="btn4" value="글쓰기" onclick ="board()">\n';
    str += '</div>';
    str += '</body>';
    str += '</html>';

    res.send(str.toString());

})


app.get('/', async function (req, res) {
    let cnt = await 파일읽기('table.html');
    res.send(cnt.toString());
});

app.listen(3000);





