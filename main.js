const puppeteer = require("puppeteer");
const http = require("axios");
const { default: axios } = require("axios");
async function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    })
}
async function run() {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const base_url = process.env.BASE_URL || "https://cdn.v2free.net/";

    console.log("email:", email);
    console.log("password:", password);
    console.log("base_url:", base_url);
    if (!email || !password) {
        console.error("用户名/密码缺失!");
        return;
    }
    try {
        console.log("=> 启动浏览器");
        const browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: null,
            timeout: 100000
        });
        console.log("=> 打开机场页面");
        const page = await browser.newPage();
        await page.goto(base_url);
        const loginLink = await page.$(`a[href="/auth/login"]`);
        if (loginLink) {
            console.log("=> 进入登录页面");
            loginLink.click();
            console.log("=> 点击登录按钮");
            await page.waitForNavigation();
            console.log("=> 进入登录表单页面");
            await page.$eval('input[name="Email"]', (input, email) => {
                input.value = email;
            }, email);
            console.log("=> 填写邮箱");
            await page.$eval('input[name="Password"]', (input, password) => {
                input.value = password;
            }, password);
            console.log("=> 填写密码");
            const loginButton = await page.$("#login");
            loginButton.click();
            console.log("=> 点击登录");
            await page.waitForNavigation();
            console.log("=> 进入首页");
            // await page.evaluate(() => {
            //     window.scrollTo(0, document.body.scrollHeight);
            // });
            // console.log("=> 滚动到页面底部");
            await sleep(1000);
            console.log("=> 点击签到");
            await page.evaluate(() => {
                const targetElement = document.querySelector('.usercheck #checkin');
                if (targetElement) {
                    targetElement.click();
                }
            });
            let flag = 0;
            let interval = setInterval(async () => {
                console.log("=> 检查是否已签到:", flag)
                if (flag > 10) {
                    browser.close();
                    clearInterval(interval);
                    throw "=> 签到失败";
                }
                try {
                    const buttonText = await page.$eval(".usercheck a.btn-brand", (btn) => btn.textContent.trim());
                    if (buttonText.includes("已签到")) {
                        console.log("=> 签到成功");
                        clearInterval(interval);
                        console.log("=> 获取剩余流量")
                        const lastCount = await page.$eval("#account-status .nodemain .nodename:first-child", ele => ele.textContent.trim()) || "";
                        console.log("=>", lastCount);
                        await post_message_by_feishu(`机场签到成功：\n${base_url}\n${lastCount}`);
                    }
                    browser.close();
                } catch (error) {
                }
                flag++;
            }, 1000);
        }

    } catch (error) {
        console.error(error.message);
        await post_message_by_feishu(error.message);
        process.exit(0);
    }
}
async function post_message_by_feishu(message) {
    const feishu_bot_url = process.env.FEISHU_BOT;

    if (!feishu_bot_url) {
        return;
    }
    console.log("=> 发送飞书消息: ", message);
    const data = {
        "msg_type": "text",
        "content": {
            "text": message
        }
    }
    try {
        await axios.post(feishu_bot_url, data);
        console.log("=> 飞书消息发送成功");
    } catch (error) {
        console.log("=> 飞书消息发送失败:");
        console.error(error);
    }
}
run();