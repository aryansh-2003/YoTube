import axios from 'axios';


const url = import.meta.env.VITE_BACKEND_URL


export class LikeService {
    constructor() {

        this.instance = axios.create({
            baseURL: `${url}/api/v1`,
            withCredentials: true

        });

    }



    async likeVideo({ videoId }) {
        try {
            return await this.instance.post(`/toggle-video-like/${videoId}`)
        } catch (error) {
            return ("LikeService :: Like Error", error)
        }
    }


    async getLikedVideos() {
        try {
            return await this.instance.get(`/liked-videos`)
        } catch (error) {
            return ("LikeService :: Get Liked Error", error)
        }
    }
    async likeComment({ id }) {
        try {
            return await this.instance.post(`/toggle-comment-like/${id}`)
        } catch (error) {
            return ("LikeService ::  Like comment Error", error)
        }
    }

    async likeTweet(id) {
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