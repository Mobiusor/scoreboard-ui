import React from 'react';
import { Avatar, Badge, DatePicker, Button, Space, Image } from 'antd'
import { getUsers, getUserMatches } from '../service/scoreboard.service'
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment'
import * as roles from '../model/role'
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD'

const scoreMap = { '-1': '-1', '0': null, '1': '+1', '2': 'MVP'}
const scoreColorMap = { '-1': 'red', '0': null, '1': 'blue', '2': 'geekblue'}

const roleMap = { 
  [roles.AVALON_LOYAL_SERVANT]: 'loyal-servant',
  [roles.AVALON_MERLIN]: 'merlin',
  [roles.AVALON_PERCIVALE]: 'percivale',
  [roles.AVALON_MINION_OF_MORDRED]: 'minion-of-mordred',
  [roles.AVALON_ASSASSIN]: 'assassin',
  [roles.AVALON_MORGANA]: 'morgana',
  [roles.AVALON_MORDRED]: 'mordred',
  [roles.AVALON_OBERON]: 'oberon',
}

class Match extends React.Component {
  state = { userMap: new Map(), userMatches: [], matches: [], dateRange: [moment(new Date(), dateFormat).add(-30, 'day'), moment(new Date(), dateFormat)] }

  componentDidMount() {
    this.loadData()
  }

  loadData = async () => {
    const users = await getUsers()
    const userMap = new Map();
    users.forEach(x => userMap[x.userid] = x)
    const [startTime, endTime] = this.state.dateRange
    const userMatches = await getUserMatches(startTime.format(dateFormat), endTime.format(dateFormat))
    this.setState({ userMap,userMatches })
  }

  renderItems() {
    return this.state.userMatches.map(user => {
      const matches = user.usermatches.map(match => {
        const badge = scoreMap[match.score]
        const color = scoreColorMap[match.score]
        let roleAvatarSrc = `/images/avalon/role-${roleMap[match.role]}.jpg`
        let borderColor = ((roleMap[match.role] & 0x0100) === 0 ? 'blue' : 'red')
        if (match.score === 0) {
          roleAvatarSrc = `/images/reject.jpg`
          borderColor = null
        }

        return (
          <span style={{ marginRight: '10px'}}>
            <Badge count={badge} color={color} offset={[-16, 0]}>
              <Avatar shape='square' src={<Image src={roleAvatarSrc} style={{ width: '32px', border: '2px solid', borderColor }}/>} />
            </Badge>
          </span>
        )
      })
      return (
        <div style={{margin: '8px', padding: '4px', borderBottom: '1px solid #ccc'}}>
          <Avatar style={{marginRight: '32px'}} src={this.state.userMap[user.userId].avatar} />
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