import React from 'react';
import { Avatar, Badge, DatePicker, Button, Space } from 'antd'
import { getUsers, getUserMatches } from '../service/scoreboard.service'
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment'
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD'

const scoreMap = { '-1': '-1', '0': null, '1': '+1', '2': 'MVP'}
const scoreColorMap = { '-1': 'red', '0': null, '1': 'blue', '2': 'geekblue'}

class Match extends React.Component {
  state = { users: new Map(), userMatches: [], matches: [], dateRange: [moment(new Date(), dateFormat).add(-30, 'day'), moment(new Date(), dateFormat)] }

  componentDidMount() {
    this.loadData()
  }

  loadData = async () => {
    const users = await getUsers()
    const [startTime, endTime] = this.state.dateRange
    const userMatches = await getUserMatches(startTime.format(dateFormat), endTime.format(dateFormat))
    this.setState({ users,userMatches })
  }

  renderItems() {
    return this.state.userMatches.map(user => {
      const matches = user.usermatches.map(match => {
        const badge = scoreMap[match.score]
        const color = scoreColorMap[match.score]
        return (
          <span style={{ marginRight: '24px'}}>
            <Badge count={badge} color={color}>
              <Avatar shape='square' icon={<UserOutlined />} />
            </Badge>
          </span>
        )
      })
      return (
        <div style={{margin: '8px', padding: '8px', borderBottom: '1px dashed #ccc'}}>
          <Avatar style={{marginRight: '32px'}} src={this.state.users[user.userId].avatar} />
          {matches}
        </div>
      )
    })
  }

  render = () => {
    return (
      <div>
        <Space size='large' style={{ marginBottom: '32px' }}>
          <RangePicker value={this.state.dateRange} onChange={val => this.setValue(val)}/>
          <Button onClick={this.loadData} type='primary'>Refresh</Button>
        </Space>

        {this.renderItems()}
      </div>
    );
  }

  setValue = (val) => {
    this.setState({dateRange: val})
  }
}

export default Match;