## 现代浏览器主页、新标签页替换页
> 说的就是现代标签页，这辈子都不会支持IE 9以下的



#### 部署地址：

​	https://pages.cathor.cn (Powered by Github Pages)

#### 当前版本： 

​	0.1

#### 推荐使用场景：

1. 屏幕尺寸大于等于1366 * 768的电脑的现代浏览器（宽度小于1200会进入竖屏显示模式）
2. iPad
3. 说不定可以在Wallpaper Engine等桌面显示工具中使用？（未测试）

#### 预览效果：

![preview](docs/preview.png)


#### 使用需求：

1. 对于浏览器主页和标签页太丑无法接受的
2. 对于[知乎](https://zhihu.com)上推荐的各类主页功能和界面都不满意的
3. 对于Firefox的默认新标签页和其他扩展标签页控件无法使用Vimium-FF而苦恼的（It's me!）
4. 。。。。。。（都看到这里了还在乎什么？😂）



#### 功能介绍：

1. 搜索功能，默认配置了三个搜索选项（百度、Bing、Google）供选择，选择后会保存在localStorage中，可以通过修改配置文件进行额外配置（还有一个User的功能，暂时没做界面，想改去配置文件进行修改）

2. 收藏夹，需要点击旁边的配置图标进行定制，如下图所示：

   ![配置](docs/config.png)

   * 添加新分组可以增加一行
   * 标题左侧❌会删掉本行所有数据，请慎重
   * 点击新标签会在该行配置一个收藏页面
   * 标签右侧的❌会删掉该标签
   * 可以通过配置文件中tags对应值进行修改

3. 天气、时间，会自动根据IP地址去获取所在城市，并查询当前城市最近4天的天气，可以点击城市名旁的定位图标刷新城市与天气，每天默认只会获取一次数据，由于接口有每日访问数量限制，请勿无聊点击刷新；右上角有个日期插件，展示还没找好节日信息的接口，所以没做额外功能，该功能暂时没有可配置项。

4. 右下角俩图标：

   ![extra](docs/extra.png)

   ​	上面的可以选择背景图片（换后不能换回来，暂时需手动删除localStorage的相关字段），下面的用来修改配置文件，推荐对现有配置进行备份，同时可以在其他浏览器进行恢复操作。

#### 附件

1. 个人使用配置文件:

   ```json
   {
       "search": {
           "searchEngine": {
               "items": [
                   [
                       "百度",
                       "https://www.baidu.com/baidu?wd="
                   ],
                   [
                       "Bing",
                       "https://cn.bing.com/search?q="
                   ],
                   [
                       "Google",
                       "https://www.google.com/search?q="
                   ]
               ],
               "option": "https://www.baidu.com/baidu?wd="
           },
           "user": {
               "name": "Cathor",
               "homePage": "https://github.com/cathor01"
           }
       },
       "tags": [
           {
               "name": "编程",
               "value": [
                   [
                       "Unix时间戳",
                       "http://tool.chinaz.com/?adfwkey=dxc64"
                   ],
                   [
                       "Unicode编码",
                       "http://tool.chinaz.com/Tools/unicode.aspx"
                   ],
                   [
                       "Ping检测",
                       "http://ping.chinaz.com/"
                   ],
                   [
                       "AntD",
                       "http://ant.design/docs/react/introduce-cn"
                   ],
                   [
                       "JSONProxy",
                       "https://jsonp.afeld.me/"
                   ],
                   [
                       "高德API",
                       "http://lbs.amap.com/api/"
                   ],
                   [
                       "StackOverflow",
                       "https://stackoverflow.com/"
                   ],
                   [
                       "Android框架",
                       "https://www.cnblogs.com/angrycode/p/5956704.html"
                   ]
               ]
           },
           {
               "name": "搜索引擎",
               "value": [
                   [
                       "百度",
                       "http://www.baidu.com"
                   ],
                   [
                       "Google",
                       "https://www.google.com"
                   ]
               ]
           },
           {
               "name": "视频",
               "value": [
                   [
                       "B站",
                       "https://bilibili.com"
                   ],
                   [
                       "A站",
                       "http://www.acfun.cn/"
                   ],
                   [
                       "优酷",
                       "http://youku.com/"
                   ],
                   [
                       "油管",
                       "https://www.youtube.com/"
                   ],
                   [
                       "爱奇艺",
                       "http://www.iqiyi.com/"
                   ]
               ]
           },
           {
               "name": "购物",
               "value": [
                   [
                       "淘宝",
                       "https://www.taobao.com/"
                   ],
                   [
                       "京东",
                       "https://www.jd.com/"
                   ]
               ]
           },
           {
               "name": "生活",
               "value": [
                   [
                       "微博",
                       "https://weibo.com"
                   ],
                   [
                       "知乎",
                       "https://www.zhihu.com/"
                   ],
                   [
                       "贴吧",
                       "https://tieba.baidu.com"
                   ],
                   [
                       "脸书",
                       "https://www.facebook.com/"
                   ],
                   [
                       "Twitter",
                       "https://twitter.com/home"
                   ]
               ]
           },
           {
               "name": "存储",
               "value": [
                   [
                       "百度云",
                       "https://pan.baidu.com"
                   ],
                   [
                       "微云",
                       "https://www.weiyun.com/disk"
                   ]
               ]
           }
       ]
   }
   ```
   

   raw文件见：<a href="./docs/home_config.json">home_config</a>