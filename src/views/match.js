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

const roleAvatarMap = { 
  [roles.AVALON_LOYAL_SERVANT]: '/avalon/role-loyal-servant.jpg',
  [roles.AVALON_MERLIN]: '/avalon/role-merlin.jpg',
  [roles.AVALON_PERCIVALE]: '/avalon/role-percivale.jpg',
  [roles.AVALON_MINION_OF_MORDRED]: '/avalon/role-minion-of-mordred.jpg',
  [roles.AVALON_ASSASSIN]: '/avalon/role-assassin.jpg',
  [roles.AVALON_MORGANA]: '/avalon/role-morgana.jpg',
  [roles.AVALON_MORDRED]: '/avalon/role-mordred.jpg',
  [roles.AVALON_OBERON]: '/avalon/role-oberon.jpg',
  
  [roles.VILLAGER]: '/werewolf/VILLAGER.jpg',
  [roles.POLICE_CHIEF]: '/werewolf/POLICE_CHIEF.jpg',
  [roles.PREDICTOR]: '/werewolf/PREDICTOR.jpg',
  [roles.WITCH]: '/werewolf/WITCH.jpg',
  [roles.HUNTER]: '/werewolf/WITCH.jpg',
  [roles.FOOL]: '/werewolf/FOOL.jpg',
  [roles.GUARD]: '/werewolf/GUARD.jpg',
  [roles.KNIGHT]: '/werewolf/KNIGHT.jpg',
  [roles.GRAVE_GUARD]: '/werewolf/GRAVE_GUARD.jpg',
  [roles.WEREWOLF]: '/werewolf/WEREWOLF.jpg',
  [roles.WOLF_KING]: '/werewolf/WOLF_KING.jpg',
  [roles.WHITE_WOLF_KING]: '/werewolf/WHITE_WOLF_KING.jpg',
  [roles.WOLF_BEAUTY]: '/werewolf/WOLF_BEAUTY.jpg',
  [roles.SNOW_WOLF]: '/werewolf/SNOW_WOLF.jpg',
  [roles.GARGOYLE]: '/werewolf/GARGOYLE.jpg',
  [roles.GHOST_RIDER]: '/werewolf/GHOST_RIDER.jpg',
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
        let roleAvatarSrc = `/images${roleAvatarMap[match.role]}`
        let borderColor = ((match.role & 0x7100) !== 0x0100 && (match.role & 0x7200) !== 0x1200 ? 'blue' : 'red')
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