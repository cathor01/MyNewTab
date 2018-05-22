import React from 'react';

import {Button, Card, DatePicker, Icon, Input, Modal, TimePicker, Select, Form, Timeline} from 'antd';
import TaskLineItem from "./taskline-item";

const FormItem = Form.Item;

export default class TodoPannel extends React.Component {
    static defaultProps = {
        todo: [
        ],

        handle: {
            addTodo: (item) => {

            },
            updateTodo: (id, item) => {

            },
            removeTodo: (id) => {

            },
        }
    };


    state = {
        todoModalVisibility: false,
        newTodoDesc: "",
        newTodoDate: "",
        newTodoLevel: "normal",
        newTodoTime: null,
        newTodoLocation: "",
        timeOpen: false,
    };

    /**
     * 解析时间字符串
     * @param str
     * @returns {*}
     */
    static parseTime(str) {
        let matchResult = str.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+)/);
        if (matchResult !== null && matchResult.length === 6) {
            return new Date(parseInt(matchResult[1]), parseInt(matchResult[2]) - 1, parseInt(matchResult[3]),
                parseInt(matchResult[4]), parseInt(matchResult[5]), 0)
        }

        return null;
    }

    handleOpenChange = (open) => {
        this.setState({ timeOpen: open });
    };

    handleClose = () => this.setState({ timeOpen: false });


    handleChange(key) {
        return (event) => {
            this.setState({[key]: event.target.value});
            console.log(this.state)
        }
    }

    handleSelectChange(value) {
        console.log(`select ${value}`);
        this.setState({newTodoLevel: value})
    }

    handleNewTodoModal(what) {
        console.log(what);
        console.log(this.state);

        const item = {
            id: new Date().getTime(),
            time: this.state.newTodoDate + " " + this.state.newTodoTime,
            level: this.state.newTodoLevel,
            desc: this.state.newTodoDesc,
            location: this.state.newTodoLocation,
            status: "undo"
        };

        this.props.handle.addTodo(item);
        this.setState({todoModalVisibility: false})
    }

    handleDropTodo(id) {
        return () => this.props.handle.removeTodo(id);
    }

    handleFinishTodo(id, item) {
        return () => {
            item.status = "done";
            this.props.handle.updateTodo(id, item);
        }
    }

    handleDropTodo(id) {
        return () => this.props.handle.removeTodo(id);
    }

    render() {

        const timelineItems = [];

        let todos = this.props.todo;

        todos = todos.sort((a, b) => (a.time > b.time)? 1: (a.time === b.time)? 0 : -1);

        for (var i in todos) {
            const item = todos[i];
            const realTime = TodoPannel.parseTime(item.time);
            if (realTime - new Date() > 0 && item.status === "undo") {
                console.log(item);
                timelineItems.push(<TaskLineItem location={item.location} time={realTime}
                                                 level={item.level} desc={item.desc}
                                                 drop={this.handleDropTodo.apply(this, [item.id])}
                                                 finish={this.handleFinishTodo.apply(this, [item.id, item])}
                />)
            }
        }

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
            <div className="todo-pannel">
                <div style={{alignSelf: "flex-start", marginBottom: "16px", display: "flex", flexDirection: "row", alignItems: "baseline"}}>
                    <h2 style={{margin: 0, marginRight: 8}}>待办事项</h2>
                    <Icon type="plus-circle-o" size="large" onClick={() => this.setState({todoModalVisibility: true})}/>

                    <Modal
                        title="添加新日程"
                        visible={this.state.todoModalVisibility}
                        onOk={this.handleNewTodoModal.bind(this)}
                        onCancel={() => this.setState({todoModalVisibility: false})}
                    >
                        <FormItem {...formItemLayout}
                                  label="任务描述">
                            <Input placeholder="描述" onChange={this.handleChange.apply(this, ["newTodoDesc"])}/>
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label="任务地点">
                            <Input placeholder="地点" onChange={this.handleChange.apply(this, ["newTodoLocation"])}/>
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label="任务优先级">
                            <Select defaultValue={this.state.newTodoLevel} style={{ width: 120 }} onChange={this.handleSelectChange.bind(this)}>
                                <Select.Option value="normal">普通</Select.Option>
                                <Select.Option value="high">高优先级</Select.Option>
                                <Select.Option value="low">低优先级</Select.Option>
                            </Select>
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label="任务时间">
                            <Input.Group compact>
                                <DatePicker size="normal" onChange={(date, dateString) => this.setState({newTodoDate: dateString})} />
                                <TimePicker
                                    open={this.state.timeOpen}
                                    format="HH:mm"
                                    onOpenChange={this.handleOpenChange.bind(this)}
                                    onChange={(time, timeString) => this.setState({newTodoTime: timeString})}
                                    addon={() => (
                                        <Button size="small" type="primary" onClick={this.handleClose.bind(this)}>
                                            确认
                                        </Button>
                                    )}
                                />
                            </Input.Group>
                        </FormItem>
                    </Modal>
                </div>

                <Timeline
                    style={{
                        marginLeft: 32,
                        marginTop: 8
                    }}
                    >
                    {timelineItems}
                </Timeline>
            </div>
        </Card>);
    }
}