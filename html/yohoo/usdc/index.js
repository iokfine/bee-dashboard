let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://unpkg.com/axios/dist/axios.min.js";
document.documentElement.appendChild(script);

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

async function tasksss() {
    document.querySelector("#body > div > div > div > div:nth-child(2) > div > div > div.fade.tab-pane.active.show").click()
    await sleep(1050)
    if (document.querySelector("#body > div > div > div > div:nth-child(2) > div > div > div.fade.tab-pane.active.show > ul > li:nth-child(2) > div > ul > li:nth-child(2) > div > div > div.QuestItem_control__RgEnQ > i")) {
        document.querySelector("#body > div > div > div > div:nth-child(2) > div > div > div.fade.tab-pane.active.show > ul > li:nth-child(2) > div > ul > li:nth-child(2) > div > div > div.QuestItem_control__RgEnQ > i").click()
        await sleep(1050)
    }
    document.querySelector("#body > div > div > div > div:nth-child(2) > div > div > div.fade.tab-pane.active.show > ul > li:nth-child(2) > div > ul > li:nth-child(2) > div > ul > li > div > div > div.col-xl-3.col-lg-3.col-md-3.col-sm-12.col-12.offset-xl-3.offset-lg-3.offset-md-3 > div > div").click()

}

async function status() {
    let autoSellStatus = document.createElement('div');
    autoSellStatus.id = 'auto-status';
    autoSellStatus.style.cssText = 'pointer-events: all; position: fixed; left: 50%; top: 0; transform: translate(-50%, 0);z-index: 99999';
    let autoSellContent = document.createElement('div');
    autoSellContent.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    let startBut = document.createElement('button');
    startBut.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // startBut.href = '#';
    startBut.textContent = '充值';
    startBut.addEventListener('click', function () {
        let addr = document.querySelector("#BuyTokensWithRamp > div > div > div > div.info-part.col-lg-6 > div > button").innerText
        axios.get('http://150.158.165.128:7002/topUpMtss?addr=' + addr).then(rsp => {
            Toast(rsp.data, 2000)
        });
    })

    let jiebang = document.createElement('button');
    jiebang.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // startBut.href = '#';
    jiebang.textContent = '解绑tw';
    jiebang.addEventListener('click', function () {
        document.querySelector("#btnHeaderUserControlProfile").click()
        sleep(200).then(() => {
            document.querySelector("#headerUserMenuDropdown > div > a:nth-child(2)").click()
            sleep(3000).then(() => {
                document.querySelector("#editUserPageTabsContainer > div > div > div > div > div > div > div > div.tab-content > form > div.row > div:nth-child(2) > div > div > div > div.text > span").click()
            })

        })
    })

    let tuichu = document.createElement('button');
    tuichu.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // startBut.href = '#';
    tuichu.textContent = '退出';
    tuichu.addEventListener('click', function () {

        document.querySelector("#btnHeaderUserControlProfile").click()
        sleep(200).then(() => {
            document.querySelector("#headerUserMenuDropdown > div > a:nth-child(3)").click()
        })

    })

    let task = document.createElement('button');
    task.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // startBut.href = '#';
    task.textContent = '任务';
    task.addEventListener('click', function () {
        tasksss()
    })

    let taskClame = document.createElement('button');
    taskClame.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // startBut.href = '#';
    taskClame.textContent = '提现任务';
    taskClame.addEventListener('click', async function () {
        if (document.getElementsByClassName('rewards-table-item-row row') && document.getElementsByClassName('rewards-table-item-row row').length > 0) {
          Toast(document.getElementsByClassName('rewards-table-item-row row').length, 2000)
          for (let i = 0; i < document.getElementsByClassName('rewards-table-item-row row').length; i++) {

                document.querySelector("#AppButton").click()
                await sleep(2000)
                document.querySelector("#ModalWithdraw > div > div.modal-body > form > div:nth-child(2) > div > button").click()
                await sleep(3000)
            }
        }
    })

    let prk = document.createElement('button');
    prk.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
    // startBut.href = '#';
    prk.textContent = '私钥';
    prk.addEventListener('click', async function () {
        window.open('https://reveal.magic.link/communitygaming')
    })

    autoSellStatus.appendChild(autoSellContent);
    autoSellStatus.appendChild(task);
    autoSellStatus.appendChild(startBut);
    autoSellStatus.appendChild(jiebang);
    autoSellStatus.appendChild(tuichu);
    autoSellStatus.appendChild(taskClame);
    autoSellStatus.appendChild(prk);
    document.body.prepend(autoSellStatus);

}

status()

function randomNum(num) {
    return Math.floor((Math.random() * num) + 1)
}

function type(selector, value, eventName) {
    let input = document.querySelector(selector);
    let lastValue = input.value;
    input.value = value;
    let event = new Event(eventName, {bubbles: true});
    // hack React15
    event.simulated = true;
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
}

sleep(2000).then(() => {

    if (location.href === 'https://www.communitygaming.io/signUp') {
        type('#username', 'nicolas' + randomNum(999999), 'input')

        type('#name', 'nicolas', 'input')

        type('#password', 'Hjx211211', 'input')

        type('#passwordAgain', 'Hjx211211', 'input')

        document.querySelector("#privacyPolicyChecked").click()

        type("#country", 'US', 'change')

        type("#signUpForm > div.form-group-nested.form-group > div > div:nth-child(1) > select", 1, 'change')

        type("#signUpForm > div.form-group-nested.form-group > div > div:nth-child(2) > select", 2, 'change')

        type("#signUpForm > div.form-group-nested.form-group > div > div:nth-child(3) > select", 2002, 'change')

    }
})
