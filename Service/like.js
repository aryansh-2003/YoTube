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


      async getLikedVideos(){
        try {
            return await this.instance.get(`/liked-videos`)
        } catch (error) {
            return ("LikeService :: Get Liked Error", error)
        }
    }
    async likeComment({id}){
        try {
            return await this.instance.post(`/toggle-comment-like/${id}`)
        } catch (error) {
            return ("LikeService ::  Like comment Error", error)
        }
    }

    async likeTweet(id){
        console.log(id)
        try {
            return await this.instance.post(`/toggle-tweet-like/${id}`)
        } catch (error) {
            return ("LikeService ::  Like comment Error", error)
        }
    }




}

const Service = new LikeService()


export default Service