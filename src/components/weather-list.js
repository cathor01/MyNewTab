import React from 'react';

import {Card, Divider, Icon, List} from 'antd';
import WeatherIcons from 'react-weathericons';

String.prototype.replaceAll = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
}

export default class WeatherList extends React.Component {
    static defaultProps = {
        weather: []
    };

    static weatherMap = {
        "晴": "day-sunny",
        "多云": "cloud",
        "阴": "cloudy",
        "阵雨": "showers",
        "雷阵雨": "storm-showers",
        "雷阵雨并伴有冰雹": "storm-showers",
        "雨夹雪": "sleet",
        "小雨": "rain-mix",
        "中雨": "rain",
        "大雨": "rain",
        "暴雨": "rain",
        "大暴雨": "rain",
        "特大暴雨": "rain",
        "阵雪": "snow",
        "小雪": "snow",
        "中雪": "snow",
        "大雪": "snow",
        "暴雪": "snow",
        "雾": "fog",
        "冻雨": "sleet",
        "沙尘暴": "sandstorm",
        "浮尘": "dust",
        "扬沙": "sandstorm",
        "强沙尘暴": "sandstorm",
        "飑": "strong-wind",
        "龙卷风": "tornado",
        "弱高吹雪": "snow-wind",
        "轻雾": "day-fog",
        "霾": "day-haze"
    };

    static mapCnToCode(cn) {
        cn = cn.split("-")[0];

        if (cn in WeatherList.weatherMap) {
            return WeatherList.weatherMap[cn];
        }

        return "na";
    }

    render() {
        let weatherItems = [];

        for (var idx in this.props.weather) {
            let item = this.props.weather[idx];

            let otherStyle= {};
            if (item.date.substr(5) === new Date().Format("MM-dd")) {
                otherStyle.color = "orange";
            }

            weatherItems.push(<div className="weather-list-item" style={otherStyle}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4}}>
                    <WeatherIcons name={WeatherList.mapCnToCode(item.dayweather)} size="2x"/>
                    <div style={{ marginTop: "6px", textAlign: "center"}}>{item.dayweather}</div>
                </div>

                <div style={{display: "flex", flexDirection: "column", marginLeft: 4, alignItems: "center",  height: "100%"}}>
                    <div style={{display: "flex", flexDirection: "row", height: "2.5rem", fontSize: "1.2rem", justifyContent: "space-between"}}>
                        <div style={{alignSelf: "flex-start", padding: 0}}>{item.daytemp}</div>
                        <div style={{alignSelf: "center", fontSize: "1.8rem", padding: 0}}>/</div>
                        <div style={{alignSelf: "flex-end", padding: 0}}>{item.nighttemp}</div>
                    </div>
                    <div style={{textAlign: "center", marginTop: 0}}>{item.date.substr(5)}</div>
                </div>
            </div>);
        }


        return (
            <div className="weather-list">
                {weatherItems}
            </div>
        );
    }
}