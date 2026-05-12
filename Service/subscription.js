import axios from 'axios';


const url = import.meta.env.VITE_BACKEND_URL

export class SubscriptionService {
    constructor() {

        this.instance = axios.create({
            baseURL: `${url}/api/v1`,
            withCredentials: true
        });

    }



    async subscribeto({ subscribetoid }) {
        try {
            return await this.instance.post(`/subscribe/${subscribetoid}`)
        } catch (error) {
            return ("SubscribeService :: Subscribe Error", error)
        }
    }


    async getUserSubscribers({ id }) {
        try {
            return await this.instance.get(`/get-subscribers/${id}`)
        } catch (error) {
            return ("SubscribeService :: Get user subscriber Error", error)
        }
    }

    async getUserSubscription() {
        try {
            return await this.instance.get(`/get-subscribed-channel`)
        } catch (error) {
            return ("SubscribeService :: Get user Subscription Error", error)
        }
    }



}

const Service = new SubscriptionService()


export default Service