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
function log(msg) {
    console.log(format(new Date())+' - '+msg )
}
function ActivateAutoSell() {
    let autoSellStatus = document.createElement('div');
    autoSellStatus.id = 'auto-status';
    autoSellStatus.style.cssText = 'pointer-events: all; position: absolute; left: 50%; transform: translate(-50%, 0);z-index: 99999';
    // autoSellStatus.addEventListener( 'click', function(){this.children[0].textContent = 'Auto-Sell Active';})
    let autoSellContent = document.createElement('div');
    autoSellContent.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    autoSellContent.textContent = 'Auto Follow';
    let resetBut = document.createElement('a');
    resetBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    resetBut.href = '#';
    resetBut.textContent = '重置';
    resetBut.addEventListener('click', function () {
        db.del("ok")
        db.del("uids")
        db.del("index")
        Toast("重置成功", 2000)
    })
    let startBut = document.createElement('a');
    startBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    startBut.href = '#';
    startBut.textContent = '开始';
    startBut.addEventListener('click', function () {
        db.set("start", 1)
        Toast("开始", 2000)
        sleep(2000).then(() => {
            location.reload()
        })
    })
    let stopBut = document.createElement('a');
    stopBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    stopBut.href = '#';
    stopBut.textContent = '停止';
    stopBut.addEventListener('click', function () {
        Toast("停止自动", 2000)
        db.set("start", null)
    })
    autoSellStatus.appendChild(autoSellContent);
    autoSellStatus.appendChild(startBut);
    autoSellStatus.appendChild(stopBut);
    autoSellStatus.appendChild(resetBut);
    document.body.prepend(autoSellStatus);
}

let BASE_URL = 'http://localhost:9999'

function getTask() {
    let uid = db.getString('uid');
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

function register() {
    let uid = db.getString('uid');
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

function launch() {
    console.log('当前版本 1.0.7')
    // register()
    return


    let invId = setInterval(() => {
        let curindex = db.get('index');
        let uids = db.get('uids');

        let dotime = db.get('dotime') ? db.get('dotime') : 1;

        if (!db.getString('uid')) {
            Toast('没有登录')
            return
        }
        let now = format(new Date())
        let radom_task_lock = Math.floor(Math.random() * Math.floor(50 * 60 * 1000))
        let locknext = db.get('locknext') ? db.get('locknext') : radom_task_lock;
        if (new Date().getTime() - dotime > locknext) {
            console.log('调用任务接口' + now)
            getTask().then(res => {
                let timestamp = new Date().getTime()
                db.set('locknext', radom_task_lock)
                db.set('dotime', timestamp)
                console.log('下一个查询时间 ：' + format(new Date(timestamp+radom_task_lock)))
                let posts = res.data
                if (posts.length > 0) {
                    for (let i = 0; i < posts.length; i++) {
                        let exist = db.get(posts[i].split('/')[5])
                        if (!exist) {
                            clearInterval(invId)
                            console.log('任务开始' + format(new Date()))

                            db.set(posts[i].split('/')[5], 1)
                            window.location.href = posts[i]
                            return
                        }
                    }
                }
            })
        }
        let pid = window.location.href.split('/')[5]
        let ouid = window.location.href.split('/')[3]
        let radom = Math.floor(Math.random() * Math.floor(20000))
        if (new Date().getTime() - dotime > 2 * 1000 + radom) {

            if (pid && ouid !== db.getString('uid')) {

                let pidStatus = db.get(pid)

                if (pidStatus === 1) {
                    // 点赞
                    if (document.getElementsByClassName('iconfont cursor-pointer bottom-icon text-info icon-like').length > 0) {
                        console.log('点赞' + format(new Date()))
                        db.set('dotime', new Date().getTime())
                        document.getElementsByClassName('iconfont cursor-pointer bottom-icon text-info icon-like')[0].click()
                        return
                    }
                    // 评论
                    getCommentList().then(res => {
                        let comments = res.data
                        let index = Math.floor(Math.random() * Math.floor(comments.length))
                        document.getElementsByClassName('ProseMirror')[0].getElementsByTagName('p')[0].textContent = comments[index]
                        sleep(500).then(() => {

                            document.getElementsByClassName('el-button el-button--text')[0].click()
                            db.set(pid, 2)
                            db.set('dotime', new Date().getTime())
                            console.log('评论成功' + format(new Date()))
                        })
                    })

                    return
                }
                //转发
                //                 if(pidStatus === 2){
                //                     document.getElementsByClassName('iconfont icon-repost cursor-pointer bottom-icon text-info el-dropdown-selfdefine   ')[0].click()
                //                     sleep(500).then(()=>{
                //                         document.querySelectorAll("li")[1].click()
                //                         db.set(window.location.href.split('/')[5],3)
                //                         db.set('dotime',new Date().getTime())
                //                         console.log('转发成功'+format(new Date()))

                //                     })
                //                     return
                //                 }
            }
        }

        // 关注锁
        //         let followed = db.get('followed')?db.get('followed'):[]
        //         let lockflo = db.get('lockflo')?db.get('lockflo'):0;
        //         if(new Date().getTime() - dotime > lockflo){
        //             getUsers().then(res => {
        //                 let users = res.data
        //                 console.log(users)
        //                 db.set('dotime',new Date().getTime())
        //                 if(users.length > 0 ){
        //                     for(let i = 0 ;i < users.length;i++){

        //                         if(followed.indexOf(users[i])===-1){
        //                             clearInterval(invId)
        //                             db.set('lockflo',Math.floor(Math.random()*Math.floor(30*60*1000))+30*60*1000)
        //                             db.set('dotime',new Date().getTime())
        //                             console.log('关注开始'+format(new Date()))
        //                             followed.push(users[i])
        //                             db.set('followed',followed)
        //                             window.location.href = 'https://monaconft.io/'+users[i]
        //                             return
        //                         }
        //                     }
        //                 }
        //             })
        //         }
        //         let _uid = window.location.href.split('/')[3]?window.location.href.split('/')[3]:'_skfkdjskfs!'
        //         if(followed.indexOf(_uid)> -1){
        //             let followEle = document.getElementsByClassName('btn follow-button round small');
        //             if(followEle[0]){
        //                 console.log("关注"+format(new Date()))
        //                 followEle[0].click();
        //             }else{

        //             }
        //         }

    }, 10000)
}
