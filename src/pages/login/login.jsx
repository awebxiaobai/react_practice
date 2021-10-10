import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import './login.less'
import logo from './images/logo.png'
import { reqLogin } from '../../api'
const Item = Form.Item
class Login extends Component {
    handleSubmit = (event) => {
        event.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
               const {username,password}=values
               const data=await reqLogin(username,password)
               console.log('请求成功',data)
               this.props.history.replace('/')
            }
        });
    };
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback('密码必须输入')
        } else if (value.length < 4) {
            callback('密码长度不能小于4位')
        } else if (value.length > 12) {
            callback('密码长度不能大于12位')
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
            callback('密码必须是英文、数字或下划线组成')
        } else {
            callback()
        }
    }
    render() {
        const form = this.props.form
        const { getFieldDecorator } = form
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {getFieldDecorator('username', {
                                rules: [
                                    { required: true, message: '用户名必须输入' },
                                    { min: 4, message: '用户名至少4位' },
                                    { max: 12, message: '用户名最多12位' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、字母或下划线组成' }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />,
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        validator: this.validatePwd
                                    }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}
const WrapLogin = Form.create()(Login)
export default WrapLogin
