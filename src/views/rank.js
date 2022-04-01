import React from 'react';
import { Avatar, Badge } from 'antd'
import { getUsers, getRank,  } from '../service/scoreboard.service'

class Rank extends React.Component {
  state = { users: new Map(), rank: [] }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    const users = await getUsers()
    const rank = await getRank()
    this.setState({ users, rank })
  }

  renderItems() {
    return this.state.rank.map((x, index) => {
      const colorMapping = {0: 'yellow', 1: 'silver', 2: 'brown'}
      const badgeColor = colorMapping[index] ?? 'red'
      return (
        <div style={{margin: '8px', padding: '8px', borderBottom: '1px dashed #ccc'}}>
          <span style={{marginRight: '32px'}}>
            <Badge count={index + 1} color={badgeColor}>
              <Avatar src={this.state.users[x.userId].avatar} />
            </Badge>
          </span>
          <span style={{ display: 'inline-block', width: '240px', textAlign:'left', marginRight: '32px'}} > {this.state.users[x.userId].name} </span>
          <span> score: {x.totalScore} </span>
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        {this.renderItems()}
      </div>
    );
  }
}

export default Rank;