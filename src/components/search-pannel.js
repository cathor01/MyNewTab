import React, {Component} from 'react';
import {Avatar, Button, Card, Input, Select} from 'antd'
import {Information} from "./information";
import TagPannel from "./tag-pannel";
import querystring from 'querystring';
import $ from "jquery";

const Search = Input.Search;
const {Option} = Select;
let currentValue;
let timeout;

export default class SearchPannel extends Component {
    static defaultProps = {
        searchEngine: {
        },
        user: {
        },
        handleFunc: {
            changeSearch: (option) => {

            }
        }
    };

    "%E7%8E%8B";

    constructor(props){
        super(props);
        this.state = {
            searchOption: this.props.searchEngine.option,
            searchValue: '',
            data: [],
        };
    }

    handleSelectChange(value) {
        console.log(`select ${value}`);

        this.props.handleFunc.changeSearch(value);

        this.setState({searchOption: value})
    }

    handleSearch() {
        let value = this.state.searchValue;
        console.log(`WTF:??? ${value}`);

        window.location.href = this.state.searchOption + value;
    }

    fetch(value, callback) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value;

        window.sogou = {
            sug: (d) => {
                console.log(d);
                if (currentValue === value) {
                    const result = d[1];
                    const data = [];
                    result.forEach((r) => {
                        data.push({
                            value: r,
                            text: r,
                        });
                    });
                    callback(data);
                }
            }
        };

        function fake() {
            $.ajax({
                url: "//www.sogou.com/suggnew/ajajjson",
                type: "GET",
                dataType: "jsonp",
                jsonpCallback: "window.sogou.sug",
                jsonp: 'window.sogou.sug',
                data: {'key': value, 't': new Date().getMilliseconds().toString(), type: "web", ori: "yes"},
                success: (d) => {
                    if (currentValue === value) {
                        const result = d[1];
                        const data = [];
                        result.forEach((r) => {
                            data.push({
                                value: r,
                                text: r,
                            });
                        });
                        callback(data);
                    }
                }});
        }

        timeout = setTimeout(fake, 300);
    }

    handleChange = (value) => {
        this.setState({ searchValue: value });
        this.fetch(value, data => this.setState({ data: data }));
    };

    render() {

        var selectOptions = [];

        for (var i in this.props.searchEngine.items) {
            var option = this.props.searchEngine.items[i];
            selectOptions.push(<Option value={option[1]}>{option[0]}</Option>)
        }

        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);

        return(<Card className="pannel-card" hoverable="true">
            <div className="search-pannel">
                <Information user={this.props.user.name} homePage={this.props.user.homePage}/>


                <Input.Group compact style={{width: "100%", padding: 4, marginTop: 16}}>
                    <Select className="search-source" defaultValue={this.state.searchOption}
                            onChange={this.handleSelectChange.bind(this)}>
                        {selectOptions}
                    </Select>
                    <Select
                        mode="combobox"
                        className="search-input"
                        placeholder="搜索项"
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onChange={this.handleChange}
                    >
                        {options}
                    </Select>
                    <Button type="primary" icon="search" onClick={this.handleSearch.bind(this)} />
                </Input.Group>
            </div>
        </Card>);
    }
}
