import React from 'react';

import $ from 'jquery';
import {Button, Card} from "antd";


export default class FoodPannel extends React.Component {

    runningRandom = false;

    state = {
        food: ["a", "b", "c"],
        index: 0
    };

    changeNextIndex () {
        if (this.runningRandom) {
            this.setState({index: (this.state.index + 1) % this.state.food.length});
            setTimeout(this.changeNextIndex.bind(this), 50);
        }
    }

    handleButtonClick() {
        if (this.runningRandom) {
            this.runningRandom = false;
        } else {
            this.runningRandom = true;
            setTimeout(this.changeNextIndex.bind(this), 50);
        }
    }

    render() {
        const buttonText = (this.runningRandom)? "停止随机": "开始随机"
        return (<Card hoverable="true" className="pannel-card">
            <div className="food-pannel">
                <div>{this.state.food[this.state.index].name}</div>
                <div>{this.state.food[this.state.index].address}</div>
                <div>{this.state.food[this.state.index].type}</div>
                <Button style={{marginTop: 16}} type="primary" onClick={this.handleButtonClick.bind(this)}>{buttonText}</Button>
            </div>
        </Card>
        );
    }

    componentDidMount() {
        if (localStorage.getItem("food") !== null) {
            this.setState({food: JSON.parse(localStorage.getItem("food"))});
            return;
        }


        if (navigator.geolocation) {
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
                    url: `https://restapi.amap.com/v3/place/around?key=df2f1fa19e465008a0643d67a90e98c0&location=${latlon}&keywords=&types=050000&radius=1000&offset=50&page=1&extensions=base&callback=callback`,
                    type: "GET",
                    dataType: "jsonp",
                    jsonpCallback: "callback",
                    success: (result) => {
                        var food = [];
                        let content = result.pois;
                        for (var i = 0 ; i < content.length; i++) {
                            food.push({"name": content[i].name, "address": content[i].address, "type": content[i].type});
                        }

                        console.log(content);

                        this.setState({food: food});

                        localStorage.setItem("food", JSON.stringify(food));
                    }
                });
            }, (wtf) => {
                console.log(wtf);
            }, getOptions);
        }
    }
}