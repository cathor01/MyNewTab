import React from 'react'
import $ from 'jquery'

import {Card, Icon, Input, List, Modal, Tag, Form} from 'antd'
const FormItem = Form.Item;

export default class TagPannel extends React.Component {
    static defaultProps = {
        items: [
            {
                name: "编程",
                value: [
                ["UTF-8编码", "https://baidu.com"],
                ["GBK", "https://baidu.com"]
                ]
            },
            {
                name: "艺术",
                value: [
                    ["UTF-8编码", "https://baidu.com"],
                    ["GBK", "https://baidu.com"],
                    ["UTF-8编码", "https://baidu.com"],
                    ["GBK", "https://baidu.com"],
                    ["UTF-8编码", "https://baidu.com"],
                    ["GBK", "https://baidu.com"],
                    ["UTF-8编码", "https://baidu.com"],
                    ["GBK", "https://baidu.com"],
                    ["UTF-8编码", "https://baidu.com"],
                    ["GBK", "https://baidu.com"],
                    ["UTF-8编码", "https://baidu.com"],
                    ["GBK", "https://baidu.com"],
                ]
            },
        ],
        handle: {
            newTag: (name, item) => {
                console.log("Add new Tag for " + name)
            },
            newRow: (name) => {
                console.log("Add new Row")
            },
            deleteRow: (name) => {
                console.log("Add new Row")
            },
            deleteTag: (row, name) => {
                console.log("Delete Tag for " + name)
            }
        }
    };

    state = {
        editable: false,
        newRowVisibility: false,
        newTagVisibility: false,
        newRowName: "",
        newTagName: "",
        newTagLink: "",
        newTagRow: ""
    };

    handleDeleteRow(row) {
        return () => {
            this.props.handle.deleteRow(row)
        }
    }

    handleDeleteTag(row, name) {
        return (ev) => {
            ev.preventDefault();
            this.props.handle.deleteTag(row, name)
        }
    }

    handleNewRowModal() {
        this.props.handle.newRow(this.state.newRowName);
        this.setState({newRowVisibility: false});
    }

    handleNewTagModal() {
        this.props.handle.newTag(this.state.newTagRow, [this.state.newTagName, this.state.newTagLink]);
        this.setState({newTagVisibility: false});
    }


    handleChange(key) {
        return (event) => {
            this.setState({[key]: event.target.value})
            console.log(this.state)
        }
    }

    cancelVisibility(key) {
        return () => {
            this.setState({[key]: false});
            console.log(this.state);
        }
    }

    render() {
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

        return (
            <Card hoverable="true" className="pannel-card">
                <div className="tag-pannel">
                    <div style={{alignSelf: "flex-start", marginBottom: "16px", display: "flex", flexDirection: "row", alignItems: "baseline"}}>
                        <h2 style={{margin: 0, marginRight: 8}}>收藏夹</h2>
                        <Icon type="edit" size="large" onClick={() => {
                            this.setState({editable: !this.state.editable})
                        }}/>
                    </div>
                    <List
                        className="list"
                        bordered="true"
                        split="true"
                        dataSource={this.props.items}
                        footer={
                            <div style={{display: (!this.state.editable) ? "none" : "inline-block"}}>
                                <a style={{fontSize: "1.1em"}} onClick={() => this.setState({newRowVisibility: true})}>添加新分组</a>
                                <Modal
                                    title="添加新分组"
                                    visible={this.state.newRowVisibility}
                                    onOk={this.handleNewRowModal.bind(this)}
                                    onCancel={this.cancelVisibility.apply(this, ["newRowVisibility"])}
                                >
                                    <FormItem {...formItemLayout}
                                              label="分组名称">
                                        <Input placeholder="新分组" onChange={this.handleChange.apply(this, ["newRowName"])}/>
                                    </FormItem>
                                </Modal>
                            </div>}
                        renderItem={(content) => {
                            var tags = [];

                            $.each(content.value, (key, item) => {

                                console.log(item);
                                tags.push(<Tag
                                    className="tag-item"
                                    closable={this.state.editable}
                                    onClose={this.handleDeleteTag.apply(this, [content.name, item[0]])}
                                    style={{margin: "2px", borderSize: '2px', textAlign: "center"}}><a
                                    href={item[1]}>{item[0]}</a></Tag>)
                            });

                            tags.push(<Tag
                                className="tag-item"
                                style={{
                                    display: (!this.state.editable) ? "none" : "inline-block",
                                    background: '#fff',
                                    borderStyle: 'dashed',
                                    borderSize: '2px',
                                    margin: "2px",
                                }}
                            >
                                <div
                                    onClick={() => this.setState({newTagVisibility: true, newTagRow: content.name})}>
                                    <Icon type="plus"/>新标签
                                </div>
                                <Modal
                                    title="新标签"
                                    visible={this.state.newTagVisibility}
                                    onOk={this.handleNewTagModal.bind(this)}
                                    onCancel={this.cancelVisibility.apply(this, ["newTagVisibility"])}
                                >
                                    <FormItem {...formItemLayout}
                                              label="标签名程">
                                        <Input placeholder="标签名" onChange={this.handleChange.apply(this, ["newTagName"])}/>
                                    </FormItem>
                                    <FormItem {...formItemLayout}
                                              label="标签链接">
                                        <Input placeholder="标签链接" onChange={this.handleChange.apply(this, ["newTagLink"])}
                                           style={{marginTop: 16}}/>
                                    </FormItem>
                                </Modal>
                            </Tag>);

                            const titleTag = (<div
                                style={{verticalAlign: "middle", fontSize: "1.1em"}}
                            >
                                <div style={{display: (!this.state.editable) ? "none" : "inline"}}>
                                    <Icon type="close-circle-o" style={{marginRight: 4}}
                                          onClick={this.handleDeleteRow.apply(this, [content.name])}/>
                                </div>
                                {content.name}
                            </div>);

                            return (<List.Item className="list-item" key={content.name}>
                                <List.Item.Meta
                                    title={titleTag}
                                    style={{maxWidth: "20%"}}
                                />
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end"
                                }}>{tags}</div>
                            </List.Item>)
                        }}/>
                </div>
            </Card>);
    }
}