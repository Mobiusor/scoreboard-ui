import React from 'react';
import { Form, Input, Button, Space } from 'antd'
import { getSelfInfo, updateUser } from '../service/scoreboard.service'
import { message } from 'antd';

class Setting extends React.Component {
  state = { info: {} }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    const info = await getSelfInfo()
    info.password = null
    this.setState({ info })
  } 

  onFinish = async () => {
    const info = this.state.info
	if (info.password == null || info.password == '') {
		message.error('please input your password')
		return
	}
    await updateUser(info.userid, info)
	message.success('success')
  }

  handleNameChange = (e) => {
    const info = this.state.info
    info.name = e.target.value
    this.setState({ info })
  }

  handleAvatarChange = (e) => {
    const info = this.state.info
    info.avatar = e.target.value
    this.setState({ info })
  }

  handlePasswordChange = (e) => {
    const info = this.state.info
    info.password = e.target.value
    this.setState({ info })
  }

  render() {
    return (
      <Space direction='vertical'>
        <Input placeholder='name' value={this.state.info.name} onChange={this.handleNameChange} style={{ width: '320px'}}/>
        <Input placeholder='avatar' value={this.state.info.avatar} onChange={this.handleAvatarChange} style={{ width: '320px'}}/>
        <Input.Password placeholder='password' value={this.state.info.password} onChange={this.handlePasswordChange} style={{ width: '320px'}}/>
        <Button type="primary" onClick={this.onFinish}>
          Submit
        </Button>
      </Space>
    );
  }
}

export default Setting;