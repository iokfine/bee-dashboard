// 数据库
let db = {
    set: function (key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    },
    get: function (key) {
        return JSON.parse(localStorage.getItem(key));
    },
    getString: function (key) {
        return localStorage.getItem(key);
    },
    del: function (key) {
        return localStorage.removeItem(key);
    },
};

function add0(m) {
    return m < 10 ? '0' + m : m
}

function format(date) {
    //shijianchuo是整数，否则要parseInt转换
    var time = date;
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

// 延迟执行
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// 提示
async function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 20%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}

let BASE_URL = 'http://localhost:9999'

function getTask(uid) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest(); //这里没有考虑IE浏览器，如果需要择if判断加
        xhr.open('GET', BASE_URL + "/mona/taskList?uid=" + uid, true);
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                resolve(JSON.parse(xhr.response))
            }
        }
    })
}

function getCommentList() {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest(); //这里没有考虑IE浏览器，如果需要择if判断加
        xhr.open('GET', BASE_URL + '/mona/commentList');
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                resolve(JSON.parse(xhr.response))
            }
        }
    })
}

function getUsers() {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest(); //这里没有考虑IE浏览器，如果需要择if判断加
        xhr.open('GET', BASE_URL + '/mona/users');
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                resolve(JSON.parse(xhr.response))
            }
        }
    })
}

function saveUid(uid) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest(); //这里没有考虑IE浏览器，如果需要择if判断加
        xhr.open('GET', BASE_URL + "/mona/register?uid=" + uid, true);
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                resolve(JSON.parse(xhr.response))
            }
        }
    })
}

function addTask(uid, type, content) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest(); //这里没有考虑IE浏览器，如果需要择if判断加
        xhr.open('POST', BASE_URL + "/mona/addTask", true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify({
            uid: uid,
            type: type,
            content,
        }));
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                resolve(JSON.parse(xhr.response))
            }
        }
    })
}

function doneTask(uid) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest(); //这里没有考虑IE浏览器，如果需要择if判断加
        xhr.open('GET', BASE_URL + "/mona/doneTask?uid="+uid, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                resolve(JSON.parse(xhr.response))
            }
        }
    })
}
function postLike(uid) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest(); //这里没有考虑IE浏览器，如果需要择if判断加
        xhr.open('GET', BASE_URL + "/mona/post/like?uid="+uid, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                resolve(JSON.parse(xhr.response))
            }
        }
    })
}


function log(msg) {
    console.log(format(new Date()) + ' - ' + msg)
}

let start = true;
let uid = db.getString('uid')

function handle() {
    let autoSellStatus = document.createElement('div');
    autoSellStatus.id = 'auto-status';
    autoSellStatus.style.cssText = 'pointer-events: all; position: absolute; left: 50%; transform: translate(-50%, 0);z-index: 99999';
    // autoSellStatus.addEventListener( 'click', function(){this.children[0].textContent = 'Auto-Sell Active';})
    let autoSellContent = document.createElement('div');
    autoSellContent.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // autoSellContent.textContent = '菜单';
    let resetBut = document.createElement('button');
    resetBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // resetBut.href = '#';
    resetBut.textContent = '停止';
    resetBut.addEventListener('click', function () {
        db.set('clicklimit', 0)
        db.set("likeusers", [])
        console.log(uid)
        doneTask(uid)
    })
    let startBut = document.createElement('button');
    startBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // startBut.href = '#';
    startBut.textContent = '任务';
    startBut.addEventListener('click', function () {
        // Toast("同步成功", 2000)
        // getUsers().then(res => {
        //     let users = res.data
        //     console.log(users)
        //     db.set("likeusers", users)
        //     location.reload()
        // })

        addTask(uid, 0, '').then(resp=>{
            Toast(resp.data)
        })
    })
    // let stopBut = document.createElement('button');
    // stopBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // // stopBut.href = '#';
    // stopBut.textContent = '点赞';
    // stopBut.addEventListener('click', function () {
    //     // db.set("likeusers", [window.location.href.split('/')[3]])
    //     // db.set('clicklimit', 10)
    //     // launch()
    //     let ouid = window.location.href.split('/')[3]
    //     addTask(uid, 1, ouid).then(resp=>{
    //         Toast(resp.data)
    //     })
    // })
    let LoopLikeBut = document.createElement('button');
    LoopLikeBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    LoopLikeBut.textContent = '点赞';
    LoopLikeBut.addEventListener('click', function () {
        log('点赞开始')
        Toast("点赞开始", 3000)
       loopLike()
    })
    let comment_ = document.createElement('button');
    comment_.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    comment_.textContent = '评论';
    comment_.addEventListener('click', function () {
        getCommentList().then(res => {
            let comments = res.data
            let index = Math.floor(Math.random() * Math.floor(comments.length))
            document.getElementsByClassName('ProseMirror')[0].getElementsByTagName('p')[0].textContent = comments[index]
            sleep(500).then(() => {
                document.getElementsByClassName('el-button el-button--text')[0].click()
                console.log('评论成功' + format(new Date()))
            })
        })
    })
    let e_ = document.createElement('button');
    e_.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    e_.textContent = 'e';
    e_.addEventListener('click', function () {
        location.href = 'https://monaconft.io/ethfans/posts'
    })
    let c_ = document.createElement('button');
    c_.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    c_.textContent = 'c';
    c_.addEventListener('click', function () {
        location.href = 'https://monaconft.io/chrissangmi/posts'
    })
    autoSellStatus.appendChild(autoSellContent);
    autoSellStatus.appendChild(startBut);
    // autoSellStatus.appendChild(stopBut);
    autoSellStatus.appendChild(resetBut);
    autoSellStatus.appendChild(comment_);
    autoSellStatus.appendChild(LoopLikeBut);
    autoSellStatus.appendChild(e_);
    autoSellStatus.appendChild(c_);
    document.body.prepend(autoSellStatus);
}

handle()

let count = 1
let herfold = location.href
db.set('clicklimit', Math.floor(Math.random() * Math.floor(1)) + 3)

function dotask() {
    let limit = db.get('clicklimit')

    let ouid = window.location.href.split('/')[3]
    let likeusers = db.get("likeusers") ? db.get("likeusers") : []
    if (likeusers.length === 0) {
        log("没有任务可做")
        return;
    }
    if (likeusers.indexOf(ouid) < 0) {
        log("不可点击页面")
        return;
    }
    log('uid: ' + ouid + ' limit : ' + limit)
    if (herfold !== location.href) {
        log("herfold : " + herfold + "  location.href :" + location.href)
        herfold = location.href
        count = 1
        log("重置count")
    }
    console.log(likeusers)

    if (!start) {

        if (likeusers && likeusers.length > 0) {
            log("下一个")
            likeusers.splice(likeusers.indexOf(ouid), 1);
            db.set("likeusers", likeusers)
            start = true
            sleep(5000).then(() => {
                if (likeusers.length > 0) {
                    let index = Math.floor(Math.random() * Math.floor(likeusers.length))
                    window.location.href = 'https://monaconft.io/' + likeusers[index] + "/posts"

                } else {
                    log('没有下一个了')
                    launch()
                    doneTask(uid)
                }
            })
        }
        return
    }

    let radom = Math.floor(Math.random() * Math.floor(5000)) + 10000
    sleep(radom).then(() => {
        let like = document.getElementsByClassName('iconfont cursor-pointer bottom-icon text-info icon-like')
        if (like && like[0]) {
            like[0].parentNode.click()
            Toast("点赞" + count + "次", 3000)
            log("点赞" + count + "次")
            postLike(uid)
            count++
        } else {
            start = false
            Toast("无点赞，关闭自动", 3000)
            log("无点赞，关闭自动")
        }
        if (count > limit) {
            start = false
            Toast("到达上线，关闭自动", 3000)
            log("到达上线，关闭自动")
        }
        dotask()
    })
}
let loopLikeUrl = ''
function loopLike() {
    // if(db.get('loopLikeUrl')){
    //     if(db.get('loopLikeUrl') !== location.href){
    //         db.del('loopLikeUrl')
    //         return
    //     }
    // }else {
    //     db.set('loopLikeUrl',location.href)
    // }
    let radom = Math.floor(Math.random() * Math.floor(5000)) + 10000
    let like = document.getElementsByClassName('iconfont cursor-pointer bottom-icon text-info icon-like')
    if (like && like.length > 0&& like[0].parentNode) {
        sleep(radom).then(() => {
            like[0].parentNode.click()
            Toast('点赞', 3000)
            log('点赞')
            loopLike();
        })
    }else{
        Toast('点完了')
        log("点完了")
    }

}
// let limit = 20
function launch() {

    let likeusers = db.get("likeusers");
    if(likeusers && likeusers.length > 0){
        log("继续把没做完的任务做完")
        // clearInterval(invId);
        dotask()
        return;
    }
    let invId = setInterval(() => {
        if (!uid) {
            Toast('没有登录')
            return
        }
        getTask(uid).then(resp => {
            if(resp.data){
                log("获得新任务")
                clearInterval(invId);
                let uids = resp.data.uids;
                let likers = []
                for (let i = 0; i < uids.length; i++) {
                    if(uids[i]===uid){
                        log('删除自己')
                    }else{
                        likers.push(uids[i])
                    }
                }
                console.log(likers)
                db.set("likeusers", likers)
                let index = Math.floor(Math.random() * Math.floor(likers.length))
                window.location.href = 'https://monaconft.io/' + likers[index] + "/posts"
                dotask()
            }
        })
    }, 60000)
}

launch()

