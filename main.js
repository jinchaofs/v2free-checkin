const puppeteer = require("puppeteer");
async function run() {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const base_url = process.env.BASE_URL || "https://cdn.v2free.net/";
    console.log("email:", email);
    console.log("password:", password);
    console.log("base_url:", base_url);
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: null,
            timeout: 100000
        });
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
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            console.log("=> 滚动到页面底部");
            const signinButton = await page.$(".usercheck a.btn-brand");
            signinButton.click();
            console.log("=> 点击签到");
            setTimeout(async () => {
                const buttonText = await page.$eval(".usercheck a.btn-brand", (btn) => btn.textContent.trim());
                if (buttonText.includes("已签到")) {
                    console.log("=> 签到成功");
                }
                browser.close();
            }, 1000);
        }
        
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
}

run();