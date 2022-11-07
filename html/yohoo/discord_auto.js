let dotimeState = null
let locknextState = null
let token = null
let channalId = ''
let auto = false
let index = 0

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

let start = false
function handle() {
    let autoSellStatus = document.createElement('div');
    autoSellStatus.id = 'auto-status';
    autoSellStatus.style.cssText = 'pointer-events: all; position: absolute; left: 50%; transform: translate(-50%, 0);z-index: 99999';
    // autoSellStatus.addEventListener( 'click', function(){this.children[0].textContent = 'Auto-Sell Active';})
    let autoSellContent = document.createElement('div');
    autoSellContent.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    autoSellContent.textContent = '黄哥天下无敌';
    let resetBut = document.createElement('button');
    resetBut.textContent = '开始';
    resetBut.addEventListener('click', function () {
        Toast("开始了")
        channalId = location.href.split('/')[5].split('#')[0]
        start = true
    })

    let startBut = document.createElement('button');
    startBut.textContent = '停止';
    startBut.addEventListener('click', function () {
        Toast("停止")
        start = false
    })
    let stopBut = document.createElement('button');
    stopBut.textContent = '测试发送';
    stopBut.addEventListener('click', function () {
        let arr = document.getElementById('content_').value.split('\n')
        console.log(arr)

        channalId = location.href.split('/')[5].split('#')[0]

        if(arr){
            Toast("测试发送第一条")
            send(arr[0],token,channalId)
        }else{
            Toast("消息为空")
        }

    })
    let input = document.createElement('button');
    input.textContent = '设置';
    input.addEventListener('click', function () {
        if(document.getElementById('text_').style.cssText.indexOf("block") != -1){
            document.getElementById('text_').style.cssText = 'background-color:white;height: 500px; position: absolute; left: 50%; top: 150px;;z-index: 99999;width: 500px;display: none;padding: 20px;';
        } else{
            document.getElementById('text_').style.cssText = 'background-color:white;height: 500px; position: absolute; left: 50%; top: 150px;;z-index: 99999;width: 500px;display: block;padding: 20px;';
        }
    })
    autoSellStatus.appendChild(autoSellContent);
    autoSellStatus.appendChild(startBut);
    autoSellStatus.appendChild(stopBut);
    autoSellStatus.appendChild(resetBut);
    autoSellStatus.appendChild(input);
    document.body.prepend(autoSellStatus);

    let text_ = document.createElement('div');
    text_.id = 'modal_';
    text_.innerHTML =
        "<div id='text_' style='background-color: white; height: 500px; position: absolute; left: 50%; top: 150px; z-index: 99999; width: 500px; display: none;padding: 20px;'>"+
        "<div>token：<input id='token_' /></div>"+
        "<div>延迟：<input id='delay_' value = '30'/> 秒</div>"+
        "<div style='margin-top: 20px;'><div>内容：</div><textarea placeholder='粘贴... 每行一个' id='content_' style='width: 80%; height: 400px'></textarea></div>"+
        +"</div>"
    document.body.prepend(text_);

}

function messages(token,channalId) {
    return new Promise((resolve, reject) => {
        // {"token":"mBNB","toAddress":"0xBB98e423471694a855c82B649230f58576677EF7"}
        var xhr = new XMLHttpRequest(); //这里没有考虑IE浏览器，如果需要择if判断加
        xhr.open('GET', 'https://discord.com/api/v9/channels/'+channalId+'/messages?limit=100', true);
        xhr.setRequestHeader('authorization',document.getElementById('token_').value);

        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {

                resolve(JSON.parse(xhr.response))
            }
        }
    })
}

function send(msg,token,channalId) {
    return new Promise((resolve, reject) => {
        // {"token":"mBNB","toAddress":"0xBB98e423471694a855c82B649230f58576677EF7"}
        var xhr = new XMLHttpRequest(); //这里没有考虑IE浏览器，如果需要择if判断加
        xhr.open('POST', 'https://discord.com/api/v9/channels/'+channalId+'/messages', true);
        xhr.setRequestHeader('authorization',document.getElementById('token_').value );
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        let body = {"content":msg,"nonce":Math.floor(100000 + Math.random() * 900000000000000000),"tts":false}
        xhr.send((JSON.stringify(body)))
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                resolve(JSON.parse(xhr.response))
            }
        }
    })
}

handle()
setTimeout(()=>{
    let invId = setInterval(() => {
        if(!start){
            return
        }


        let dotime =dotimeState ? dotimeState : 1;
        let radom_task_lock = document.getElementById('delay_').value * 1000
        let locknext = locknextState? locknextState : radom_task_lock;
        log("上次做完 "+new Date(dotimeState))
        log("锁定时间 "+locknextState/1000 + " s")
        if (new Date().getTime() - dotime > locknext) {

            if(auto){
                messages(token,channalId).then(resp=>{
                    let index = Math.floor(Math.random() * Math.floor(70))+29
                    console.log(resp[index])
                    if(resp[index].mentions.length ===0){
                        let content = resp[index].content
                        send(content,token,channalId)
                        log('发送成功 “ '+content+" ”")
                        // 记录
                        let timestamp = new Date().getTime()
                        dotimeState = timestamp
                    }else{
                        log('不发送')
                    }
                })
            }else{
                let arr = document.getElementById('content_').value.split('\n')
                if(arr[index]){
                    send(arr[index],token,channalId)
                    index++
                }else{
                    index = 0
                }


            }

        }
    }, 10*1000)
}, 10000)
