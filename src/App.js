import React, { Component } from 'react';

import './App.less';

import $ from 'jquery';
import {Affix, Button, Layout, Modal, Input, Upload, Icon} from 'antd';


import SearchPannel from "./components/search-pannel";
import DatetimePannel from "./components/datetime-pannel";
import TagPannel from "./components/tag-pannel";

const {Content, Footer} = Layout;
const {TextArea} = Input;

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
                        <SearchPannel searchEngine={this.state.search.searchEngine} user={this.state.search.user}
                                      tags={this.state.search.tags} handleFunc={this.state.handle.search}
                        />

                        <TagPannel items={this.state.tags} handle={this.state.handle.tags}/>

                        <DatetimePannel config={this.state.datetime}/>
                    </Content>

                    <Upload style={{position: "fixed", right: 50, bottom: 100}}  {...props}>
                        <Button type="normal" shape="circle" icon="picture"
                                size="large"/>
                    </Upload>

                    <Button style={{position: "fixed", right: 50, bottom: 50}} type="primary" shape="circle" icon="edit"
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
            this.config = {
                search: {
                    searchEngine: {
                        items: [
                            ["百度", "https://www.baidu.com/baidu?wd="],
                            ["Bing", "https://cn.bing.com/search?q="],
                            ["Google", "https://www.google.com/search?q="]
                        ],
                        option: "https://www.baidu.com/baidu?wd="
                    },
                    user: {
                        "name": "Cathor",
                        "homePage": "https://github.com/cathor01"
                    },
                },
                tags: [
                ],
            };
            localStorage.setItem("config", JSON.stringify(this.config));
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
