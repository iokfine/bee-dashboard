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

function log(msg) {
    console.log(format(new Date())+' - '+msg )
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

let start = false;

function ActivateAutoSell() {
    let autoSellStatus = document.createElement('div');
    autoSellStatus.id = 'auto-status';
    autoSellStatus.style.cssText = 'pointer-events: all; position: absolute; left: 50%; transform: translate(-50%, 0);z-index: 99999';
    // autoSellStatus.addEventListener( 'click', function(){this.children[0].textContent = 'Auto-Sell Active';})
    let autoSellContent = document.createElement('div');
    autoSellContent.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    autoSellContent.textContent = 'Auto Like';
    // let resetBut = document.createElement('a');
    // resetBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // resetBut.href = '#';
    // resetBut.textContent = '重置';
    // resetBut.addEventListener('click', function () {
    //     db.del("ok")
    //     db.del("uids")
    //     db.del("index")
    //     Toast("重置成功", 2000)
    // })
    let startBut = document.createElement('a');
    startBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    startBut.href = '#';
    startBut.textContent = '开始';
    startBut.addEventListener('click', function () {
        Toast("开始", 2000)
        start = true
    })
    let stopBut = document.createElement('a');
    stopBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    stopBut.href = '#';
    stopBut.textContent = '停止';
    stopBut.addEventListener('click', function () {
        Toast("停止自动", 2000)
        start = false
    })
    autoSellStatus.appendChild(autoSellContent);
    autoSellStatus.appendChild(startBut);
    autoSellStatus.appendChild(stopBut);
    // autoSellStatus.appendChild(resetBut);
    document.body.prepend(autoSellStatus);
}

function launch() {
    ActivateAutoSell()
    let count = 1
    let herfold = location.href
    let invId = setInterval(() => {
        if (!start) {
            return
        }
        if(herfold !== location.href){
            herfold = location.href
            count = 1
            console.log("重置count")
        }
        let radom = Math.floor(Math.random() * Math.floor(3000))
        sleep(radom).then(()=>{
            let like = document.getElementsByClassName('iconfont cursor-pointer bottom-icon text-info icon-like')
            if (like &&document.getElementsByClassName('iconfont cursor-pointer bottom-icon text-info icon-like')[0]) {
                document.getElementsByClassName('iconfont cursor-pointer bottom-icon text-info icon-like')[0].parentNode.click()
                Toast("点赞" + count + "次", 3000)
                console.log("点赞" + count + "次")
                count++
            }else {
                start =false
                Toast("无点赞，关闭自动", 3000)
                console.log("无点赞，关闭自动")
            }
            if(count>5){
                start =false
                Toast("到达上线，关闭自动", 3000)
                console.log("到达上线，关闭自动")
            }
        })


    }, 8000)
}

