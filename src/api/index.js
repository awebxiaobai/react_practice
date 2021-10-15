import { message } from "antd";
import axios from "axios";
import ajax from "./ajax";

export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')
export const reqAddUser = user => ajax('/manage/user', user, 'POST')

export const reqCategorys = (parentId) => ajax('/manage/category/list', { parentId })
export const reqAddCategorys = ({ categoryName, parentId }) => ajax('/manage/category/add', { categoryName, parentId }, 'POST')
export const reqUpdateCategorys = ({ categoryId, categoryName }) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')

export const reqWeather = city => {
    return new Promise((resolve, reject) => {
        axios.get(
            'https://restapi.amap.com/v3/weather/weatherInfo',
            { params: { Key: 'f378e8660929352f72ec7acb136e7469', city } }
        ).then((responce) => {
            // console.log(responce)
            resolve(responce.data.lives[0])
        }).catch((err) => {
            message.error('请求出错了' + err.message)
        })
    })
}