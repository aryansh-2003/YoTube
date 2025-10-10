import axios from 'axios';



export class DashboardService{
    constructor(){

    this.instance = axios.create({
     baseURL: 'http://localhost:8000/api/v1',
    //  headers: {'X-Custom-Header': 'foobar'}
    });
    this.instance.interceptors.request.use(
        (config) =>{
            const accessToken = localStorage.getItem('token')
            if(accessToken){
                config.headers.Authorization = `Bearer ${accessToken}`
                console.log(accessToken)
            }
            return config
        },
        (error) => Promise.reject(error)
    )
    }

    

    async getChannelVideos(id){
        try {
            return await this.instance.get(`/get-channel-videos/${id}`)
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }



}

const Service = new DashboardService()


export default Service