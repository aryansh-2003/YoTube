import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL


export class notificationService {
    constructor() {

        this.instance = axios.create({
            baseURL: `${url}/api/v1`,
            withCredentials: true
        });

        this.instance.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem('token')
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )
    }




    async getNotification() {
        try {
            return await this.instance.get(`/get-notifications`)
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }




}

const Service = new notificationService()


export default Service