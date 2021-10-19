import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Icon,
    message,
    Modal
} from 'antd'

import LinkButton from '../../components/link-button'
import { reqAddCategorys, reqCategorys, reqUpdateCategorys } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
export default class Category extends Component {
    state = {
        categorys: [],
        subCategorys: [],
        loading: false,
        parentId: '0',
        parentName: '',
        showStatus: 0
    }
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {/* <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> */}
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
                    </span>
                )
            },

        ];
    }
    getCategorys = async (parentId) => {
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            this.setState({ loading: false })
            if (parentId === '0') {
                this.setState({ categorys })
            } else {
                this.setState({ subCategorys: categorys })
            }
        } else {
            message.error('获取分类列表失败')
        }
    }
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategorys()
        })
    }
    showCategorys = () => {
        this.setState({
            subCategorys: [],
            parentId: '0',
            parentName: '',
        })
    }
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    showUpdate = (category) => {
        this.category = category
        this.setState({
            showStatus: 2
        })
    }
    addCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    showStatus: 0
                })
                const { parentId, categoryName } = values
                this.form.resetFields()
                const result = await reqAddCategorys({ parentId, categoryName })
                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        this.getCategorys()
                    } else if (parentId === '0') {
                        this.getCategorys('0')
                    }
                }
            }
        })
    }
    updateCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    showStatus: 0
                })
                const categoryId = this.category._id
                const { categoryName } = values
                // 清除输入数据
                this.form.resetFields()
                const result = await reqUpdateCategorys({ categoryId, categoryName })
                if (result.status === 0) {
                    this.getCategorys()
                }
            }
        })

    }
    handleCancel = () => {
        this.form.resetFields()
        this.setState({
            showStatus: 0
        })
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getCategorys()
    }
    render() {
        const { categorys, loading, subCategorys, parentId, parentName, showStatus } = this.state
        const category = this.category || {}
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{ marginRight: 5 }} />
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'></Icon>
                添加
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={loading}
                    rowKey='_id'
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={form => this.form = form}
                    />
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={form => this.form = form} />
                </Modal>
            </Card>
        )
    }
}
