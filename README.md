### yuanchat

弹幕收发


##### 安装


```
$ git clone https://github.com/wallaceyuan/chatV2.git
$ npm install
```


##### 启动命令

```
# 运行客户端
$ npm run app

# 运行服务端
$ npm run sclient

浏览器打开http://127.0.0.1:3000/ 查看效果
```

##### 依赖redis和mysql
```
# windows安装启动
D:\redis
$ redis-server redis.conf

# mac
$ redis-server
或者将redis启动到后台
$ launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

##### 安装下载项目js

```
# 全局安装bower
$ npm install -g bower

# 安装js依赖
$ bower install
```

##### 前端模板

```
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').__express);
```

##### 测试页面

```
./views/online.html

```

##### 在线人数查看

```
./views/online.html?liveid=xxx

```

##### 服务器部署

###### PM2

当在内网服务器部署时，推荐使用 [PM2](https://github.com/Unitech/pm2/) 来守护你的应用进程。

###### 全局安装 PM2

```
# 如果有权限要求，记得加 sudo
$ npm install pm2 -g
```