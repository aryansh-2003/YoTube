import axios from 'axios';


const url = import.meta.env.VITE_BACKEND_URL


export class DashboardService {
    constructor() {

        this.instance = axios.create({
            baseURL: `${url}/api/v1`,
            withCredentials: true
        });
    }



    async getChannelVideos(id) {
        try {
            return await this.instance.get(`/get-channel-videos/${id}`)
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }

    async getDashboard() {
        try {
            return await this.instance.get(`/dashboard`)
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }





}

const Service = new DashboardService()


export default Service