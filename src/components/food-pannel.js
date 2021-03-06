import React from 'react';

import $ from 'jquery';
import {Button, Card, Tag, Modal, Icon, Form, Input} from "antd";
const FormItem = Form.Item;

Array.prototype.contains = function(item){
    for(let i=0;i<this.length;i++){
        if(this[i] === item){
            return true;
        }
    }
    return false;
};

export default class FoodPannel extends React.Component {

    state = {
        food: ["a", "b", "c"],
        index: 0,
        runningRandom: false,
        loading: false,
        configVisibility: false,
        radius: 1000,
        newRadius: 1000,
    };

    changeNextIndex () {
        if (this.state.runningRandom) {
            this.setState({index: Math.floor(Math.random() * this.state.food.length)});
            setTimeout(this.changeNextIndex.bind(this), 50);
        }
    }

    handleButtonClick() {
        if (this.state.runningRandom) {
            this.setState({runningRandom: false});
        } else {
            this.setState({runningRandom: true});
            setTimeout(this.changeNextIndex.bind(this), 50);
        }
    }

    /**
     * 绑定Input修改某个state字段
     * @param key
     * @returns {Function}
     */
    handleChange(key) {
        return (event) => {
            this.setState({[key]: event.target.value});
            console.log(this.state)
        }
    }

    /**
     * 取消某个Modal的可视状态
     */
    cancelVisibility() {
        this.setState({configVisibility: false, newRadius: this.state.radius});
        console.log(this.state);
    }

    /**
     * 调用props传递的添加分类的方法
     */
    handleNewRadius() {
        this.setState({configVisibility: false, radius: this.state.newRadius});
        this.refreshLocationFood();
    }

    render() {
        let buttonText = (this.state.runningRandom)? "停止随机": "开始随机";

        var tags = [];

        let typeStr = this.state.food[this.state.index].type;

        if (typeStr !== undefined) {
            let types = this.state.food[this.state.index].type.split(/[\\|;]/);

            var visitedTags = [];

            for (var i = 0; i < types.length; i++) {
                if (visitedTags.contains(types[i])) {
                    continue;
                }

                tags.push(<Tag>{types[i]}</Tag>);
                visitedTags.push(types[i]);
            }
        }

        let appends = [];
        if (!this.state.runningRandom) {
            appends.push(<div className="food-address">{this.state.food[this.state.index].address}</div>);
            appends.push(<div style={{marginTop: 8}}>{tags}</div>);
        }

        // Modal的FormItem的样式
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };

        return (<Card hoverable="true" className="pannel-card">
                <div className="food-pannel">
                    <div style={{
                        alignSelf: "flex-start",
                        width: "100%",
                        marginBottom: "16px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <h2 style={{margin: 0, marginRight: 8}}>吃什么?</h2>
                        <Button style={{marginLeft: 4}} type="dashed" size="small" shape="circle" icon="sync"
                                loading={this.state.loading} onClick={this.refreshLocationFood.bind(this)}/>
                        <Icon style={{marginLeft: 8}} type="edit" size="large" onClick={() => {
                            this.setState({configVisibility: true})
                        }}/>
                    </div>
                    <div className="food-title"><a
                        style={{color: "black"}}
                        href={`https://ditu.amap.com/place/${this.state.food[this.state.index].id}`}>{this.state.food[this.state.index].name}</a>
                    </div>
                    {appends}
                    <Button style={{marginTop: 16}} type="primary"
                            onClick={this.handleButtonClick.bind(this)}>{buttonText}</Button>
                    <Modal
                        title="搜索配置"
                        visible={this.state.configVisibility}
                        onOk={this.handleNewRadius.bind(this)}
                        onCancel={this.cancelVisibility.bind(this)}
                    >
                        <FormItem {...formItemLayout}
                                  label="搜索半径">
                            <Input placeholder="半径" onChange={this.handleChange.apply(this, ["newRadius"])} defaultValue={this.state.newRadius}/>
                        </FormItem>
                    </Modal>
                </div>
            </Card>
        );
    }

    componentDidMount() {
        // 获取配置搜索半径
        if (localStorage.getItem("food_radius") !== null) {
            this.setState({radius: parseInt(localStorage.getItem("food_radius")), newRadius: parseInt(localStorage.getItem("food_radius"))})
        }

        if (localStorage.getItem("food") !== null) {
            this.setState({food: JSON.parse(localStorage.getItem("food"))});
            return;
        }

        // 更新当前环境
        this.refreshLocationFood();
    }

    /**
     * 刷新当前环境食物
     */
    refreshLocationFood() {
        if (navigator.geolocation) {
            this.setState({loading: true});
            var getOptions = {
                //是否使用高精度设备，如GPS。默认是true
                enableHighAccuracy:true,
                //超时时间，单位毫秒，默认为0
                timeout:5000,
                //使用设置时间内的缓存数据，单位毫秒
                //默认为0，即始终请求新数据
                //如设为Infinity，则始终使用缓存数据
                maximumAge:0
            };

            navigator.geolocation.getCurrentPosition((position) => {
                var latlon=position.coords.latitude+","+position.coords.longitude;
                $.ajax({
                    url: `https://restapi.amap.com/v3/place/around?key=df2f1fa19e465008a0643d67a90e98c0&location=${latlon}&keywords=&types=050000&radius=${this.state.radius}&offset=100&page=1&extensions=base&callback=callback`,
                    type: "GET",
                    dataType: "jsonp",
                    jsonpCallback: "callback",
                    success: (result) => {
                        var food = [];
                        let content = result.pois;
                        for (var i = 0 ; i < content.length; i++) {
                            food.push({"name": content[i].name, "address": content[i].address, "type": content[i].type, id: content[i].id});
                        }

                        if (food.length === 0) {
                            food.push({"name": "暂无数据", "address": "", type: "", id: -1})
                        }

                        console.log(content);

                        this.setState({food: food});

                        localStorage.setItem("food", JSON.stringify(food));
                        localStorage.setItem("food_radius", `${this.state.radius}`);
                        this.setState({loading: false});
                    }
                });
            }, (wtf) => {
                console.log(wtf);
                this.error(wtf.message);
                this.setState({loading: false});
            }, getOptions);
        }
    }

    error(message) {
        Modal.error({
            title: '定位出现异常',
            content: (
                <div>
                    <p>{message}</p>
                </div>
            ),
            onOk() {},
        });
    }

}