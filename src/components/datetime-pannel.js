import React from 'react';

import {Card, Calendar, Popover, Button, Icon} from 'antd';
import WeatherList from "./weather-list";
import $ from 'jquery';


export default class DatetimePannel extends React.Component {
    state = {
        currentTime: new Date().Format("hh:mm:ss"),
        location: {},
        weather: [],
        loading: false
    };

    static defaultProps = {
        config: {},
    };

    updateCurrentTime() {
        this.setState({
            currentTime: new Date().Format("hh:mm:ss")
        });
    }

    constructor(props){
        super(props);

        setInterval(this.updateCurrentTime.bind(this), 1000);
    }

    render(){
        const calendar = (<Calendar fullscreen={false} onPanelChange={console.log} />);

        return(
            <Card hoverable="true" className="pannel-card">
                <div className="datetime-pannel">
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                        <div style={{fontSize: "1.1em"}}>
                            {this.state.location.city}
                            <Button style={{marginLeft: 4}} type="dashed" size="small" shape="circle" icon="environment-o" loading={this.state.loading} onClick={this.reloadLocation.bind(this)}/>
                        </div>
                        <Popover content={calendar}>
                            <Button style={{alignSelf: "flex-end"}} type="dashed">{new Date().toLocaleDateString()}</Button>
                        </Popover>
                    </div>
                    <div className="time-text">{this.state.currentTime}</div>

                    <WeatherList weather={this.state.weather}/>
                </div>
            </Card>
        );
    }



    componentDidMount() {
        if (localStorage.getItem("weather-date") === new Date().Format("MM-dd")) {
            let location = JSON.parse(localStorage.getItem("weather-location"));
            let weather = JSON.parse(localStorage.getItem("weather-config"));
            this.setState({location: location, weather: weather});
            return;
        }

        this.reloadLocation();
    }


    reloadLocation() {
        this.setState({loading: true});
        $.ajax({
            url: "https://restapi.amap.com/v3/ip?key=df2f1fa19e465008a0643d67a90e98c0&callback=callback",
            type: "GET",
            dataType: "jsonp",
            jsonpCallback: "callback",
            success: (result) => {
                console.log(result);
                this.setState({location: result});
                $.ajax({
                    url: "https://restapi.amap.com/v3/weather/weatherInfo?key=df2f1fa19e465008a0643d67a90e98c0&extensions=all&callback=callback&city=" + this.state.location.adcode,
                    type: "GET",
                    dataType: "jsonp",
                    jsonpCallback: "callback",
                    success: (weatherResult) => {
                        let weather = weatherResult.forecasts[0].casts;
                        localStorage.setItem("weather-location", JSON.stringify(result));
                        localStorage.setItem("weather-config", JSON.stringify(weather));
                        localStorage.setItem("weather-date", new Date().Format("MM-dd"));
                        this.setState({weather: weather, loading: false})
                    }
                })
            }
        })
    }
}