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
