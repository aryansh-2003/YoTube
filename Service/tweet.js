import axios from 'axios';





const url = import.meta.env.VITE_BACKEND_URL

export class TweetService {
    constructor() {

        this.instance = axios.create({
            baseURL: `${url}/api/v1`,
            withCredentials: true
        });
    }

    async createTweet({ message }) {
        try {
            return await this.instance.post('/create-tweet',
                {
                    content: message
                }
            )
        } catch (error) {
            return ("TweetService :: Tweet Error", error)
        }
    }

    async getUserTweets({ id }) {
        try {
            return await this.instance.get(`/user-tweets/${id}`)
        } catch (error) {
            return ("TweetService :: Tweet Error", error)
        }
    }

    async getAllTweets({ page, limit }) {
        try {
            return await this.instance.get(`/home-tweets`, {
                params: {

                    page: page,
                    limit: limit
                }
            }
            )
        } catch (error) {
            return ("TweetService :: Tweet Error", error)
        }
    }

    async getAllLikedTweets() {
        try {
            return await this.instance.get(`/liked-tweets`)
        } catch (error) {
            return ("TweetService :: Tweet Error", error)
        }
    }


}

const Service = new TweetService()


export default Service