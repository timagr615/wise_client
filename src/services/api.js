import axios from "axios";
import { fetchToken } from "../views/auth/Auth";

const API_SERVER = "https://wiseapi.ru/";
//const API_SERVER = "http://localhost:8002/";

const apiInstance = axios.create({
    baseURL: API_SERVER,
    headers: { "Content-Type": "application/json", "accept": "application/json" },
});

apiInstance.interceptors.request.use(
    (config) => {
        return Promise.resolve(config)
    },
    (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
    (response) => Promise.resolve(response),
    (error) => {
        return Promise.reject(error);
    }
)

class API {
    
    static Login = async (data) => {
        const response = await apiInstance.post(`login`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"}
            });
        return response.data;
    }

    static Registration = async (data) => {
        const response = await apiInstance.post(`user/create`, data);
        return response.data;
    }

    static GetMe = async () => {
        const response = await apiInstance.get('user/me', {
            headers: {
                'Authorization': `Bearer ${fetchToken()}`
            }
        });
        return response;
    }

    static ChatGetAdmin = async (data, token) => {
        const response = await apiInstance.get(`chat/admin/${data}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }

    static ChatGetUser = async (data, token) => {
        const response = await apiInstance.get(`chat/user/${data}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }

    static ChatGet = async (data, token) => {
        const response = await apiInstance.get(`chat/${data}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response;
    }

    static ChatClear = async (data, token) => {
        const response = await apiInstance.get(`chat/${data}/clear`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }

    static CreateMessage = async (data, token) => {
        const response = await apiInstance.post(`/chat/message/create`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                }
            });
        return response.data;
    }

    static CreateMessageFiles = async (data, params, token) => {
        const response = await apiInstance.post(`/chat/message_file/create`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
                },
            params: params
            });
        return response.data;
    }

    static DownloadFile = async (file_id, filename, token) => {
        /*const response = await apiInstance.get(`chat/download/${file_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/octet-stream"
                }
            })*/

            const url = API_SERVER + `chat/download/${file_id}`;
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': "application/octet-stream"
                }
              });
        const href = window.URL.createObjectURL(response.data);

        const anchorElement = document.createElement('a');

        anchorElement.href = href;
        anchorElement.download = filename;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
    }
}

export default API;