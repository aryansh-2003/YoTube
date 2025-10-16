import axios from 'axios';



export class SubscriptionService{
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

    

    async subscribeto({subscribetoid}){
        try {
            return await this.instance.post(`/subscribe/${subscribetoid}`)
        } catch (error) {
            return ("SubscribeService :: Subscribe Error", error)
        }
    }



}

const Service = new SubscriptionService()


export default Service