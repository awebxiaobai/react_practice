import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
const Option = Select.Option
export default class ProductHome extends Component {
    state = {
        loading: false,
        total: 0,
        products: [],
        searchType: 'productName',
        searchName: ''
    }
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                            <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                        </span>
                    )
                }
            }
        ]
    }
    getProducts = async (pageNum) => {
        this.pageNum=pageNum
        this.setState({ loading: true })
        const { searchName, searchType } = this.state
        let result
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts({ pageNum, pageSize: PAGE_SIZE })
        }
        if (result.status === 0) {
            this.setState({ loading: false })
            const { total, list } = result.data
            // console.log(total, list)
            this.setState({
                total,
                products: list
            })
        }
    }
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus({ productId, status })
        if(result.status===0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }
    render() {
        const { products, total, loading, searchType, searchName } = this.state
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{ width: 200, margin: '0 15px' }}
                    value={searchName}
                    onChange={e => this.setState({ searchName: e.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <Icon type='plus' />
                添加商品
            </Button>
        )
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        dataSource={products}
                        columns={this.columns}
                        rowKey='_id'
                        loading={loading}
                        pagination={{
                            defaultPageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            total,
                            onChange: this.getProducts
                        }}
                    />
                </Card>
            </div>
        )
    }
}
