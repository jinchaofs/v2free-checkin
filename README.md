# 机场自动签到程序
该程序使用浏览器自动化方式，模拟认为鼠标键盘操作，进行自动化登录和签到；

## 部署方式
1. Fork这个仓库
2. 到`Settings`→`Secrets and Variables`→`Actions` 中，在添加以下secret：

| 参数  | 是否必须  | 内容  | 示例  |
| ------------ | ------------ | ------------ | ------------ |
| FREE_EMAIL  | 是  | 机场注册邮箱  |  demo@gmail.com  |
| FREE_PASSWORD  | 是  | 机场注册密码  | passxxxxx  |
| FREE_BASE_URL  | 是  | 机场地址  | https://examplea.com  |
| FEISHU_BOT  | 否  | 飞书机器人地址  |  https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxx |

3. 在仓库首页点击`Actions`，选择`V2free auto checkin`，点击右侧的`Run workflow`，运行一次之后。后续每天会自动执行一次。