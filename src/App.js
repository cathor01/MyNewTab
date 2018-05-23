import React, { Component } from 'react';

import './App.less';

import $ from 'jquery';
import {Affix, Button, Layout, Modal, Input, Upload, Icon} from 'antd';


import SearchPannel from "./components/search-pannel";
import DatetimePannel from "./components/datetime-pannel";
import TagPannel from "./components/tag-pannel";
import TodoPannel from "./components/todo-pannel";

const {Content, Footer} = Layout;
const {TextArea} = Input;

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

class App extends Component {

    static getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;


        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/jpeg");

        return dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");
    }

    config = null;

    state = {
        search: {
            searchEngine: {
                items: [],
                option: ""
            },
            user: {
                name: "",
                homePage: ""
            },
        },
        tags: [
        ],
        todo: [

        ],
        handle: {
            search: {
                changeSearch: (option) => {
                    this.config.search.searchEngine.option = option;
                    this.saveConfig();
                }
            },
            tags: {
                newTag: (name, item) => {
                    console.log("App: Add new Tag for " + name);
                    console.log(item);
                    this.config.tags.find(v => v.name === name).value.push(item);

                    this.saveConfig();
                },
                newRow: (name) => {
                    console.log("App: Add new Row " + name);

                    this.config.tags.push({name: name, value: []});

                    this.saveConfig();
                },
                deleteRow: (name) => {
                    console.log("App: Add new Row " + name);

                    let idx = this.config.tags.findIndex((item) => item.name === name);

                    if (idx > -1) {
                        this.config.tags.splice(idx, 1);
                    }

                    this.saveConfig();
                },
                deleteTag: (rowName, name) => {
                    console.log("App: Add new Row");
                    let row = this.config.tags.find((item) => item.name === rowName);
                    console.log(row);

                    if (row !== null) {
                        let idx = row.value.findIndex((item) => item[0] === name);

                        if (idx > -1) {
                            row.value.splice(idx, 1);
                            this.saveConfig();
                        }
                    }
                },
            },
            todo: {
                addTodo: (item) => {
                    if (! 'id' in item) {
                        item.id = new Date().getTime();
                    }

                    this.config.todo.push(item);
                    this.saveConfig();
                },
                updateTodo: (id, item) => {
                    let idx = this.config.todo.findIndex(a => a.id === id);
                    this.config.todo[idx] = item;
                    this.saveConfig();

                },
                removeTodo: (id) => {
                    let idx = this.config.todo.findIndex(a => a.id === id);
                    this.config.todo.splice(idx, 1);
                    this.saveConfig();
                }
            }
        },
        configVisibility: false,
        tempConfig: null
    };

    loadBackground() {
        return `url("${this.state.image.url}") no-repeat`;
    }

    saveConfig() {
        localStorage.setItem("config", JSON.stringify(this.config));
        this.setState(this.config);
    }

    handleConfigChange(ev) {
        this.setState({tempConfig: ev.target.value})
    }

    render() {
        const props = {
            action: '',
            onRemove: (file) => {

            },
            beforeUpload: (file) => {
                console.log(file);
                const isJPG = file.type === 'image/jpeg';
                const isPng = file.type === 'image/png';

                if (isJPG || isPng) {
                    var reader = new FileReader();
                    reader.onload = function(e){
                        console.log(reader.result);
                        App.saveLocalImage(reader.result);
                        $("#background").css("background-image", "url(\"" + reader.result + "\")");
                    };

                    reader.readAsDataURL(file);
                }

                return false;
            },
            fileList: this.state.fileList,
        };
        return (
            <div id="root-div" style={{width: "100%", height: "100%"}}>

                <div id="background" />
                <Layout className="layout">
                    <Content className="layout-content">
                        <div className="card-wrapper">
                            <SearchPannel searchEngine={this.state.search.searchEngine} user={this.state.search.user}
                                          tags={this.state.search.tags} handleFunc={this.state.handle.search}
                            />

                            <TagPannel items={this.state.tags} handle={this.state.handle.tags}/>
                        </div>
                        <div className="card-wrapper">
                            <DatetimePannel config={this.state.datetime}/>

                            <TodoPannel todo={this.state.todo} handle={this.state.handle.todo}/>
                        </div>
                    </Content>

                    <Upload className="background-icon"  {...props}>
                        <Button type="normal" shape="circle" icon="picture"
                                size="large"/>
                    </Upload>

                    <Button className="config-icon" type="primary" shape="circle" icon="edit"
                            size="large" onClick={() => this.setState({configVisibility: true})}/>
                    <Modal
                        title="配置文件"
                        visible={this.state.configVisibility}
                        onOk={() => {
                            this.config = JSON.parse(this.state.tempConfig);
                            this.saveConfig();
                            this.setState({configVisibility: false});
                        }}
                        onCancel={() => this.setState({configVisibility: false})}
                    >
                        <TextArea placeholder="配置文件" rows={15} onChange={this.handleConfigChange.bind(this)} defaultValue={JSON.stringify(this.config)}/>
                    </Modal>
                </Layout>

            </div>
        );
    }

    static saveLocalImage(source) {
        localStorage.setItem("background", source);
    }

    componentWillMount() {
        if (localStorage.getItem("config") !== null) {
            this.config = JSON.parse(localStorage.getItem("config"));
        } else {
            this.config = {"todo":[{"id":1527003650060,"time":"2018-06-15 14:30","level":"high","desc":"项目系统分析会议","location":"15楼西会议室","status":"undo"},{"id":1527003726505,"time":"2018-06-20 11:00","level":"low","desc":"新人培训计划","location":"5楼东侧工位","status":"undo"},{"id":1527003613708,"time":"2018-06-30 14:30","level":"normal","desc":"XX产品需求分析","location":"12楼东会议室","status":"undo"}],"search":{"searchEngine":{"items":[["百度","https://www.baidu.com/baidu?wd="],["搜狗","https://www.sogou.com/web?query="],["Bing","https://cn.bing.com/search?q="],["Google","https://www.google.com/search?q="]],"option":"https://www.sogou.com/web?query="},"user":{"name":"Cathor","homePage":"https://github.com/cathor01"}},"tags":[{"name":"搜索引擎","value":[["百度","http://www.baidu.com"],["搜狗","https://www.sogou.com/web?query="],["Google","https://www.google.com"]]},{"name":"视频","value":[["B站","https://bilibili.com"],["A站","http://www.acfun.cn/"],["优酷","http://youku.com/"],["油管","https://www.youtube.com/"],["爱奇艺","http://www.iqiyi.com/"]]},{"name":"购物","value":[["淘宝","https://www.taobao.com/"],["京东","https://www.jd.com/"],["天猫","https://www.tmall.com/"]]},{"name":"生活","value":[["微博","https://weibo.com"],["知乎","https://www.zhihu.com/"],["贴吧","https://tieba.baidu.com"],["脸书","https://www.facebook.com/"],["Twitter","https://twitter.com/home"],["QQ空间","https://qzone.qq.com/"]]},{"name":"阅读","value":[["QQ阅读","http://book.qq.com/"],["起点中文","https://www.qidian.com/"]]}]};
            localStorage.setItem("config", JSON.stringify(this.config));
        }

        if (!("todo" in this.config)) {
            this.config.todo = [];
        }

        this.setState({tempConfig: JSON.stringify(this.config)});
        this.setState(this.config);
    }

    componentDidMount() {
        if (localStorage.getItem("background") !== null) {
            $("#background").css("background-image", "url(\"" + localStorage.getItem("background") + "\")");
        }
    }
}

export default App;
