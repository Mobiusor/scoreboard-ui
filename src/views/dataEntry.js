import React from 'react'
import { Steps, DatePicker, Button, Transfer, Avatar, Select, Input, Space, Result } from 'antd'
import './dataEntry.css'
import { getUsers, addMatch } from '../service/scoreboard.service'
import moment from 'moment'
const { Step } = Steps
const { Option, OptGroup } = Select

const timeFormat = 'YYYY-MM-DD hh:mm:ss'

class DataEntry extends React.Component {
  state = {
    current: 0,
    users: [],
    userMap: new Map(),
    time: moment(new Date(), timeFormat),
    targetKeys: [],
    matchInfo: [],
    selectedKeys: [],
  }

  handleSubmit = async () => {
    await addMatch(this.state.time.format(timeFormat), this.state.matchInfo)
    this.setState({ current: this.state.current + 1})
  }

  handleNext = () => {
    const attendees = this.state.targetKeys
    const matchInfo = attendees.map(x => ({
      userId: x,
      score: null,
      role: null
    }))
    this.setState({current: this.state.current + 1, matchInfo})
  }

  render = () => {
    return (
      <>
        <Steps progressDot current={this.state.current}>
          <Step title="Board" description="Set board and attendees." />
          <Step title="Result" subTitle="Set the result" />
          <Step title="Submit" />
        </Steps>

        <div className="steps-content">
          {this.renderStepContent()}
        </div>

        <div className="steps-action">
          {this.state.current === 0 && (
            <Button type="primary" onClick={this.handleNext}>
              Next
            </Button>
          )}
          {this.state.current === 1 && (
            <Button type="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
          )}
        </div>
      </>
    )
  }

  renderStepContent = () => {
    if (this.state.current === 0) {
      return (
        <Space direction='vertical' size='large'>
          <DatePicker showTime onChange={this.handleChangeTime} value={this.state.time} />
          <Transfer
            rowKey={record => record.userid}
            dataSource={this.state.users}
            titles={['Users', 'Match']}
            targetKeys={this.state.targetKeys}
            selectedKeys={this.state.selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            // onScroll={onScroll}
            render={item => item.name}
          />
        </Space>
      )
    } else if (this.state.current === 1 && this.state.users.length > 0) {
      const items = this.state.matchInfo.map((info, index) => {
        const user = this.state.userMap[info.userId]
        return (
          <div key={info.userId}>
            <Space style={{margin: '8px', padding: '8px', borderBottom: '1px dashed #ccc'}}>
              <span style={{marginRight: '32px'}}>
                <Avatar src={user.avatar} />
              </span>
              <span style={{ display: 'inline-block', width: '120px', textAlign:'left', marginRight: '32px'}} > {user.name} </span>
              <Input.Group compact>
                <Select placeholder='Role' value={info.role} onChange={(val) => this.handleChangeRole(index, val)} style={{ width: '180px' }}>
                  <OptGroup label="Good">
                    <Option value={0x0000}>Loyal Servant</Option>
                    <Option value={0x0001}>Merlin</Option>
                    <Option value={0x0002}>Percival</Option>
                  </OptGroup>
                  <OptGroup label="Evil">
                    <Option value={0x0100}>Minion</Option>
                    <Option value={0x0101}>Assassin</Option>
                    <Option value={0x0102}>Morgana</Option>
                    <Option value={0x0103}>Mordred</Option>
                    <Option value={0x0104}>Oberon</Option>
                  </OptGroup>
                </Select>
                <Select placeholder='Status' value={info.score} onChange={(val) => this.handleChangeScore(index, val)} style={{ width: '120px' }}>
                  <Option value={1}>Win  +1</Option>
                  <Option value={-1}>Lose -1</Option>
                  <Option value={2}>MVP +2</Option>
                </Select>
              </Input.Group>
            </Space>
          </div>
        )
      })
      return (<>{items}</>)
    } else if (this.state.current === 2) {
      return (
        <Result
          status="success"
          title="Match successfully added"
          extra={[
            <Button type="primary" key="console">
              Go to match list
            </Button>
          ]}
        />
      )
    }
  }

  handleChangeTime = (val) => {
    this.setState({time: val})
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys })
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  }

  handleChangeRole = (index, newRole) => {
    const matchInfo = this.state.matchInfo
    matchInfo[index].role = newRole
    this.setState({ matchInfo})
  }

  handleChangeScore = (index, newScore) => {
    const matchInfo = this.state.matchInfo
    matchInfo[index].score = newScore
    this.setState({ matchInfo})
  }

  componentDidMount = () => {
    this.loadData()
  }

  loadData = async () => {
    const users = await getUsers()
    const userMap = new Map()
    users.forEach(user => userMap[user.userid] = user)
    this.setState({ users, userMap })
  }
}

export default DataEntry;