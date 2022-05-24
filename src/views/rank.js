import React from 'react';
import { Avatar, Badge } from 'antd'
import { getUsers, getRank } from '../service/scoreboard.service'

class Rank extends React.Component {
  state = { userMap: new Map(), rank: [] }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    const users = await getUsers()
    const userMap = new Map();
    users.forEach(x => userMap[x.userid] = x)
    const rank = await getRank()
    this.setState({ userMap, rank })
  }

  renderItems() {
    return this.state.rank.map((x, index) => {
      const badgeColorMapping = {0: 'yellow', 1: 'silver', 2: 'brown'}
	  const ratingLowerBound = [0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2700, 3000, 4000]
	  const ratingColorList = ['gray', '#8bc34a', '#4caf50', 'cyan', 'blue', 'violet', 'orange', 'orange', 'red', 'red', 'black', '#d9e3f0']
	  const ratingTitleList = ['Newbie', 'Pupil', 'Apprentice', 'Specialist', 'Expert', 'Candidate Master', 'Master', 'International Master', 'Grandmaster', 'International Grandmaster', 'Legendary Grandmaster', 'God']
	  
      
	  
	  var ratingIndex = ratingLowerBound.length - 1
	  while(ratingIndex > 0 && ratingLowerBound[ratingIndex] > x.rating) {
		  ratingIndex--;
	  }
	  //ratingIndex = index;
	  var ratingColor = ratingColorList[ratingIndex]
	  const badgeColor = badgeColorMapping[index] ?? ratingColor
      return (
        <div style={{margin: '8px', padding: '8px', borderBottom: '1px solid #ccc', background: ratingColor, color: 'white', borderRadius: '10px' }}>
          <span style={{marginRight: '32px'}}>
            <Badge count={index + 1} color={badgeColor}>
              <Avatar src={this.state.userMap[x.userId].avatar} />
            </Badge>
          </span>
          <span style={{ display: 'inline-block', width: '140px', textAlign:'left', marginRight: '32px'}} > {this.state.userMap[x.userId].name} </span>
          <span style={{ display: 'inline-block',textAlign:'left', marginRight: '32px', width: '160px'}}> 
			  {ratingTitleList[ratingIndex]}
		   </span>
		  <span style={{ display: 'inline-block',textAlign:'left', marginRight: '32px'}}> 
			  {x.rating}
		   </span>
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