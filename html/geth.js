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

function tokenlist() {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest(); //这里没有考虑IE浏览器，如果需要择if判断加
        xhr.open('GET', 'http://localhost:9999/geth/post', false);
        xhr.onreadystatechange = function () {
            console.log('调用tokenlist')
            if (xhr.status === 200 && xhr.readyState === 4) {
                console.log(xhr.response)
                resolve(JSON.parse(xhr.response))
            }
        }
    })
}

let start = false;
let index = 0

function status() {
    let autoSellStatus = document.createElement('div');
    autoSellStatus.id = 'auto-status';
    autoSellStatus.style.cssText = 'pointer-events: all; position: absolute; left: 50%; transform: translate(-50%, 0);z-index: 99999';
    let autoSellContent = document.createElement('div');
    autoSellContent.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    autoSellContent.textContent = '黄哥天下无敌';
    let startBut = document.createElement('button');
    startBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // startBut.href = '#';
    startBut.textContent = '开始';
    startBut.addEventListener('click', function () {
        Toast("开始", 2000)
        index = 0
        start = true
    })
    let stopBut = document.createElement('button');
    stopBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // stopBut.href = '#';
    stopBut.textContent = '停止';
    stopBut.addEventListener('click', function () {
        Toast("停止自动", 2000)
        start = false
    })
    let testBut = document.createElement('button');
    testBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // stopBut.href = '#';
    testBut.textContent = 'TEST';
    testBut.addEventListener('click', function () {
        Toast("TEST", 2000)
        let posts = document.getElementById("posts_").value.split('\n')
        console.log(posts)
        if (posts[0]) {
            document.querySelector("#url").value = posts[0]
            sleep(1000).then(() => {
                document.querySelector("body > div.vertical-center > div > div:nth-child(2) > div > div.input-group > span > button").click()
                sleep(1000).then(() => {
                    document.querySelector("body > div.vertical-center > div > div:nth-child(2) > div > div.input-group > span > ul > li:nth-child(3) > a").click()
                })
            })
        }

    })
    autoSellStatus.appendChild(autoSellContent);
    autoSellStatus.appendChild(startBut);
    autoSellStatus.appendChild(stopBut);
    autoSellStatus.appendChild(testBut);
    document.body.prepend(autoSellStatus);
}

function posts() {
    let autoSellStatus = document.createElement('div');
    autoSellStatus.id = 'auto-status';
    autoSellStatus.class = 'row';


    autoSellStatus.style.cssText = 'text-align: center;';
    // autoSellStatus.addEventListener( 'click', function(){this.children[0].textContent = 'Auto-Sell Active';})
    let autoSellContent = document.createElement('textarea');
    autoSellContent.placeholder = '粘贴posts链接... 每行一个';
    autoSellContent.id = 'posts_';
    autoSellContent.style.cssText = 'width:718px;height:400px';
    autoSellContent.addEventListener('blur', function () {
        Toast("已保存", 2000)
        db.set("posts", document.getElementById("posts_").value)
    })
    autoSellStatus.appendChild(autoSellContent);
    document.getElementsByClassName('container')[0].append(autoSellStatus);
}

if (document.querySelector("body > div > div > div:nth-child(4)")) {
    document.querySelector("body > div > div > div:nth-child(4)").remove()
} else {
    sleep(10000).then(() => {
        if (document.querySelector("body > div > div > div:nth-child(4)")) {
            document.querySelector("body > div > div > div:nth-child(4)").remove()
        }
    })
}

posts();
status()

sleep(100).then(() => {
    document.getElementById("posts_").value = db.get('posts');
})
let invId = setInterval(() => {
    if (!start) {
        return
    }

    if (document.querySelector("#requests > tbody")) {
        if (document.getElementById("posts_").value) {
            let posts = document.getElementById("posts_").value.split('\n')
            console.log(posts)
            if (posts[index]) {
                document.querySelector("#url").value = posts[index]
                sleep(1000).then(() => {
                    document.querySelector("body > div.vertical-center > div > div:nth-child(2) > div > div.input-group > span > button").click()
                    sleep(1000).then(() => {
                        document.querySelector("body > div.vertical-center > div > div:nth-child(2) > div > div.input-group > span > ul > li:nth-child(3) > a").click()
                    })
                })


                index++
            } else {
                index = 0
                start = false
                Toast('已经结束')
            }

        } else {
            Toast('请输入posts')
        }
    } else {
        Toast('没有水')
    }


}, 10000)

