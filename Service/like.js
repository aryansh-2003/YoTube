import axios from 'axios';



export class LikeService{
    constructor(){

    this.instance = axios.create({
     baseURL: 'https://youtube-backend-052x.onrender.com/api/v1',
    //  headers: {'X-Custom-Header': 'foobar'}
    });
    this.instance.interceptors.request.use(
        (config) =>{
            const accessToken = localStorage.getItem('token')
            if(accessToken){
                config.headers.Authorization = `Bearer ${accessToken}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )
    }

    

    async likeVideo({videoId}){
        try {
            return await this.instance.post(`/toggle-video-like/${videoId}`)
        } catch (error) {
            return ("LikeService :: Like Error", error)
        }
    }



}

const Service = new LikeService()


export default Service