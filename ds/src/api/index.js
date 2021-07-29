import axios from 'axios'
axios.defaults.baseURL = "http://ludir.cn:8888/api/private/v1/"

axios.interceptors.request.use(
    config => {
        let token = sessionStorage.getItem("token")
        if (token) { // 判断是否存在token，如果存在的话，则每个http headers都加上token
            config.headers.authorization = `${token}`; //挂载token

        }
        return config;
    },
    err => {
        return Promise.reject(err);
    })


function p(obj) { //post 参数 解析
    let url = new URLSearchParams()
    for (const k in obj) {
        url.append(k, obj[k])
    }
    return url
}

function setWho(obj) {
    const {
        who
    } = obj
    delete obj.who
    return who
}


const api = {
    Login(params) {
        return axios.post("login", p(params))
    },
    Nav() {
        return axios.get("menus")
    },
    Users(obj) {
        const {
            who
        } = obj
        delete obj.who
        switch (who) {
            case "list":
                return axios.get("users", {
                    params: obj
                })

                break;

            case "qx":
                return axios.put("users/" + obj + "/role")

                break;

            case "fp":
                return axios.put("users/" + obj.id + "/role", obj)

                break;

            case "addUser":
                return axios.post("users", p(obj))

                break;

            case "deleteUser":
                return axios.delete("users/" + obj.id, {
                    data: obj
                })

                break;
            default:
                break;
        }

    },
    modeStatus(id, type) {
        return axios.put("users/" + id + "/state/" + type)
    },
    searchUser(id) {
        return axios.get("users/" + id) //,{params:id}
    },
    roles(obj) {

        const {
            who
        } = obj
        delete obj.who
        switch (who) {
            case "list":

                return axios.get("roles")
                break;

            case "change":
                return axios.put("roles/" + obj.id, obj)
                break;

            case "delete":
                return axios.delete("roles/" + obj.id, {
                    data: obj
                })
                break;

            case "add":
                return axios.post("roles", p(obj))
                break;

        }

    },
    Rights(obj) {
        const {
            who
        } = obj
        delete obj.who
        switch (who) {
            case 'list':
                return axios.get("rights/" + obj.type, obj)
                break;

            case "author":
                return axios.post("roles/" + obj.roleId + "/rights", p(obj))
                break;
            default:
                break;
        }
    },

    Cate(obj) {
        let who = setWho(obj)
        switch (who) {
            case "list":
                return axios.get("categories", {
                    params: obj
                })
                break;

            case "attr":
                return axios.get("categories/" + obj.id + "/attributes", {
                    params: obj
                })
                break;

            case "add":
                return axios.post("categories/" + obj.id + "/attributes", p(obj))

                break;

            case "delete":
                return axios.delete("categories/" + obj.id + "/attributes/" + obj.attr_id, {
                    data: obj
                })

            case "editAttr":
                return axios.put("categories/" + obj.id + "/attributes/" + obj.attr_id, obj)
                break;

            case "edit":
                return axios.put("categories/" + obj.id, obj)
                break;

            case "addClass":
                return axios.post("categories", p(obj))
                break;

            case "deleteClass":
                return axios.delete("categories/" + obj.id, { data: obj })
                break;

            default:
                break;
        }
    },
    Goods(obj) {
        const who = setWho(obj)
        switch (who) {
            case "list":
                return axios.get("goods", {
                    params: obj
                })
                break;

            case "add":
                return axios.post("goods", p(obj))
                break;

            case "delete":
                return axios.delete("goods/" + obj.id, { data: obj })
                break;

            case "edit":
                return axios.put("goods/" + obj.id, obj)
                break;
            default:
                break;
        }
    },
    Orders(params) {
        const who = setWho(params)
        switch (who) {
            case 'list':
                return axios.get("orders", { params })
                break;

            case "addr":
                return axios.get("kuaidi/" + params.id, { params })
                break;

            case "stat":
                return axios.put("order/" + params.id, params)
                break;
            default:
                break;
        }
    },
    Reports() {
        return axios.get("reports/type/1")
    }
}

export default api