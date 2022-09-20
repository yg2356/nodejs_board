const bcrypt = require('bcrypt');
const express = require('express')
const fs = require('fs');
const app = express()
// const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())


// app.get('/mani', async function (req, res) {
//     for(let i=0;i<1000;i++){
//         fs.writeFileSync(`../boarddata/${i}_${Math.random()}`,'writer\nconetnt');
//     }
//     res.end();
// });

//글쓰기
app.get('/bc', function (req, res) {
    bcrypt.hash('1234', 10, function (err, result) {
        console.log('result');
        console.log(result);
        res.send(result);
    });

});

// 파일이름=파일이름알아내기()
// 패스워드=패스워드확인(파일이름)
// 비번비교=비교(패스워드, 입력평문)
// if(비번비교){
//     제거(파일이름)
// }

app.post('/removecode', function (req, res) {
    let no = req.query.id;
    let ps = req.body.password;
    fs.readdir('../boarddata/', function (err, arr) {
        let flag = 'error';
        for (let i = 0; i < arr.length; i++) {
            let temp = arr[i].split('_');
            if (parseInt(no) === parseInt(temp[0])) {
                flag = arr[i];
                break;
            }
        }
        fs.readFile('../boarddata/' + flag, function (err, cnt) {
            cnt = cnt.toString();
            let pwd = cnt.split('\n')[1];
            bcrypt.compare(ps, pwd, function (err, result) {
                if (result) {
                    fs.unlink('../boarddata/' + flag, function (err) {
                        res.redirect('/list?page=1');
                    })
                } else {
                    res.redirect('/remove?id=' + no);
                }
            });
            // console.log(13);
        })
        // console.log(123);
    })
})

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

app.get('/read', function (req, res) {
    let str = '';
    let id = parseInt(req.query.id);
    let page = parseInt(req.query.page);
    str += '<html>';
    str += '<head></head>';
    str += '<body>';
    fs.readdir('../boarddata/', function (err, arr) {
        let flag = 'error';
        for (let i = 0; i < arr.length; i++) {
            let temp = arr[i].split('_');
            if (id === parseInt(temp[0])) {
                flag = arr[i];
                break;
            }
        }

        fs.readFile('../boarddata/' + flag, function (err, cnt) {
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
    })
})

app.post('/boardsubmit', function (req, res) {
    console.log(req.body);
    // res.send(req.body);
    // return;
    let password = req.body.password;
    // console.log('password', password);
    let title = req.body.title;
    let writer = req.body.writer;
    let content = req.body.table;
    bcrypt.hash(password, 10, function (err, result) {
        // console.log('result');
        // console.log(result);
        // res.send(result);
        let body = writer + '\n' + result + '\n' + content;
        let no;
        fs.readdir('../boarddata/', function (err, arr) {
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

            fs.writeFile(filename, body, function (err) {
                console.log(err);
                res.redirect('/list?page=1');
            });
        })
    });
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

app.get('/list', function (req, res) {
    let amount = 10;
    let page = parseInt(req.query.page);

    fs.readdir('../boarddata/', function (err, arr) {
        let str = '';
        let temp;

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
            //str += '<div style="padding: 5px; border-bottom:1px solid #aaa;">';
            str += '<div>';
            str += '<b style = "color: green;">';
            //str+='<font size="4em" color="green">';
            str += sp[0] + ' ';
            //str+='</font>';
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
        //str += '<a href="/write">글쓰기</a>';
        str += '</body>';
        str += '</html>';

        res.send(str.toString());
    })
})


app.get('/', function (req, res) {
    fs.readFile('table.html', function (err, cnt) {
        console.log(req);
        res.send(cnt.toString());
    });
});

app.listen(3000);
//------------------------
//  title, write, no, content
//------------------------





