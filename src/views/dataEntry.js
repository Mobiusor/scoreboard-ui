import React from 'react'
import { Steps } from 'antd'
const { Step } = Steps

class DataEntry extends React.Component {
  state = {currentStep: 0}
  render = () => {
    return (
      <>
        <Steps progressDot current={this.state.currentStep}>
          <Step title="Board" description="Set board and attendees." />
          <Step title="Result" subTitle="Set the result" />
          <Step title="Submit" />
        </Steps>
      </>
    )
  }
}

export default DataEntry;