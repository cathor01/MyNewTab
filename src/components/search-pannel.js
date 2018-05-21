import React, {Component} from 'react';
import { Avatar, Card, Input, Select } from 'antd'
import {Information} from "./information";
import TagPannel from "./tag-pannel";

const Search = Input.Search;

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

    constructor(props){
        super(props);
        this.state = {
            searchOption: this.props.searchEngine.option
        };
    }

    handleSelectChange(value) {
        console.log(`select ${value}`);

        this.props.handleFunc.changeSearch(value);

        this.setState({searchOption: value})
    }

    handleSearch(value) {
        console.log(`WTF:??? ${value}`);

        window.location.href = this.state.searchOption + value;
    }

    render() {

        var selectOptions = [];

        for (var i in this.props.searchEngine.items) {
            var option = this.props.searchEngine.items[i];
            selectOptions.push(<Select.Option value={option[1]}>{option[0]}</Select.Option>)
        }

        const searchBefore = (
            <Select style={{ width: 90, textAlign: "center" }} defaultValue={this.state.searchOption}
                    onChange={this.handleSelectChange.bind(this)}>
                {selectOptions}
            </Select>
        );

        return(<Card className="pannel-card" hoverable="true">
            <div className="search-pannel">
                <Information user={this.props.user.name} homePage={this.props.user.homePage}/>


                <Search addonBefore={searchBefore} style={{marginTop: "24px"}} placeholder="input search text" enterButton size="large"
                    onSearch={this.handleSearch.bind(this)} />
            </div>
        </Card>);
    }
}
