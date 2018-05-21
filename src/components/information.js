import React from 'react'
import {Avatar} from 'antd'

export class Information extends React.Component {
    static defaultProps = {
        user: "",
        homePage: "",
        color: "#ffbf00"
    };

    render() {
        var avatar = (<Avatar style={{backgroundColor: this.props.color,
            verticalAlign: 'middle'}} size="large" shape="square">
            <a style={{textDecoration: "none", color: "white"}}>{this.props.user}</a>
            </Avatar>);
        return (
            <div className="author">
                {avatar}
                <div style={{display: 'flex', flexDirection: 'column', flexAlign: 'center', alignItems: 'flex-start', marginLeft: 8}}>
                    <div className="place">{this.props.user}</div>
                    <a href={this.props.homePage} className="date">{this.props.homePage}</a>
                </div>
            </div>
        );
    }
}