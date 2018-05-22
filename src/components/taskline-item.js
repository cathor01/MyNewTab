import React from 'react';
import {Icon, Tag, Timeline} from 'antd';

const TaskItem = Timeline.Item;

export default class TaskLineItem extends React.Component {

    static defaultProps = {
        level: "low",
        time: new Date(),
        location: "教三 301",
        desc: "进行关于ReactJS的讲座",
        finish: () => {},
        drop: () => {},
    };

    static getTaskColor(level) {
        if (level === "low") {
            return "green"
        } else if (level === "normal") {
            return "orange"
        } else if (level === "high") {
            return "red";
        }

        return "orange";
    }

    /**
     * 获取标题颜色
     * @param interval
     * @returns {string}
     */
    static getTitleColor(interval) {
        if (interval < 0) {
            return "#999999_"
        }

        if (interval > 259200000) {
            return "#000000_" // 大于3天
        } else if (interval > 86400000) {
            return "#ffb900_green" // 3天到1天
        } else if (interval >  43200000) {
            return "#ff8c00_gold"; // 1天到12小时
        } else if (interval > 21600000) {
            return "#f7630c_orange"; // 12小时到6小时
        } else if (interval > 10800000) {
            return "#ca5010_volcano"; // 6小时到3小时
        } else {
            return "#ff0000_red"; // 3小时以内
        }

    }

    /**
     * 格式化时间差
     * @param timeInterval
     */
    static formatTimeInterval(timeInterval) {

        var days = Math.floor(timeInterval / (24 * 3600 * 1000));


        //计算出小时数
        var leave1 = timeInterval % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));

        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));

        return `${days}天${hours}小时${minutes}分钟`
    }

    render() {
        const timeLeft = this.props.time.getTime() - new Date().getTime();
        const taskColor = TaskLineItem.getTaskColor(this.props.level);
        const titleColor = TaskLineItem.getTitleColor(timeLeft).split("_");
        const timeLeftText = TaskLineItem.formatTimeInterval(timeLeft);


        const location = (this.props.location === "" || this.props.location === null)? (<div />) : (<div style={{marginLeft: 4}}><
            Icon type="environment-o"/>
            {this.props.location}</div>);

        let leftTime;

        if (titleColor[1] !== "") {
            leftTime = (<Tag color={titleColor[1]} style={{marginLeft: 4}}>剩余{timeLeftText}</Tag>);
        } else {
            leftTime = (<Tag style={{marginLeft: 4}}>剩余{timeLeftText}</Tag>);
        }

        return (<TaskItem style={{paddingBottom: 8}} color={taskColor}>
                <div style={{display: "flex", color: titleColor[0], flexWrap: "wrap"}}>
                    {this.props.time.Format("yyyy-MM-dd hh:mm")}
                    {location}
                    {leftTime}
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "baseline", }}>
                    {this.props.desc}
                    <Icon type="delete" size="large" style={{marginLeft: 4, color: "#f50"}} onClick={this.props.drop}/>
                    <Icon type="check-circle-o" size="large" style={{marginLeft: 4, color: "#52c41a"}} onClick={this.props.finish} />
                </div>
        </TaskItem>);
    }
}