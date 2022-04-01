import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Rank from './views/rank';
import Match from './views/match';
import DataEntry from './views/dataEntry';
import { Layout, Menu, Modal, Form, Button, Input } from 'antd';
import { login } from './service/scoreboard.service'
const { Header, Content } = Layout;


const router = [
  { key: 'rank', name: 'Rank', path: '/rank', component: Rank },
  { key: 'match', name: 'Match', path: '/match', component: Match },
  { key: 'dataEntry', name: 'Data Entry', path: '/dataEntry', component: DataEntry}
];

class App extends React.Component {
  state = { isLoginVisible: false, token: window.localStorage.getItem('token') }



  render = () => {
    const router = this.renderRouter()
    return (
      <>
        <Layout className="layout">
          <Header>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              {this.renderMenu()}
            </Menu>
            <div style={{ float: 'right', color: 'white'}}>aaa</div>
          </Header>
          <Content style={{ padding: '56px', textAlign: 'center', minHeight: 'calc(100vh - 64px)', background: '#fefefe' }}>
            {router}
          </Content>
        </Layout>
        { this.renderLoginModal() }
      </>
    )
  }

  renderMenu = () => {
    return router.map(x => <Menu.Item key={x.key}><a href={x.path}>{`${x.name}`}</a></Menu.Item>)
  }

  renderRouter = () => {
    if (this.state.token === null) return null

    const routerComponents = router.map(item => <Route path={item.path} element={<item.component />} key={item.key}/>);
    return (
      <BrowserRouter>
        <Routes>
          {routerComponents}
          <Route path="*" element={<Rank />} />
        </Routes>
      </BrowserRouter>
    )
  }

  renderLoginModal() {
    return (
      <Modal title="Login" visible={this.state.isLoginVisible} okText="Login" footer={null}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={this.handleOk}
          onFinishFailed={this.handleFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Alias"
            name="alias"
            rules={[{ required: true, message: 'Please input your alias!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  } 

  handleOk = async (values) => {
    const token = await login(values.alias, values.password)
    window.localStorage.setItem('token', token)
    this.setState({ isLoginVisible: false, token })
  }

  handleFinishFailed = () => {
    this.setState({ isLoginVisible: false })
  }

  componentDidMount = () => {
    const token = window.localStorage.getItem('token')
    if (token === null) {
      this.setState({isLoginVisible: true})
    }
  }
}

export default App;
