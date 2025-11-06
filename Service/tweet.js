import axios from 'axios';



export class TweetService{
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

    

    async createTweet({message}){
        try {
            return await this.instance.post('/create-tweet',
                {
                    content:message
                }
            )
        } catch (error) {
            return ("TweetService :: Tweet Error", error)
        }
    }

       async getUserTweets({id}){
        try {
            return await this.instance.get(`/user-tweets/${id}`)
        } catch (error) {
            return ("TweetService :: Tweet Error", error)
        }
    }

       async getAllTweets(){
        try {
            return await this.instance.get(`/home-tweets`)
        } catch (error) {
            return ("TweetService :: Tweet Error", error)
        }
    }


}

const Service = new TweetService()


export default Service