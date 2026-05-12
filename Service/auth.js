import axios from 'axios';
import { useNavigate } from 'react-router';

const url = import.meta.env.VITE_BACKEND_URL

export class AuthService {
    constructor() {

        this.instance = axios.create({
            baseURL: `${url}/api/v1/users`,
            withCredentials: true
        });

    }

    async getLoggedInUser() {
        const token = localStorage.getItem('token')
        if (!token) return null
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        return this.getCurrentUser(token)

    }
    async login(email, password) {
        try {
            const data = await this.instance.post('/login', { email: email, password: password }, { withCredentials: true })
            const { acessToken, refreshToken } = data?.data?.data

            return data
        } catch (error) {
            return ("AuthService :: Login Error", error)
        }
    }


    async registerUser(formData) {
        const keysArray = Array.from(formData.values());

        try {
            return this.instance.post('/register', formData)
        } catch (error) {
            return ("AuthService :: Register Error", error)
        }
    }

    async getCurrentUser() {
        try {
            const response = await this.instance.get('/current-user')

            return response

        } catch (error) {
            console.log(error.status, error)
        }
    }


    async logout() {
        try {
            const res = await this.instance.post('/logout');
            return res;
        } catch (err) {
            console.error("AuthService :: Logout Error", err);
            return false;
        }
    }


    async getUserChannel({ channel }) {
        try {
            if (!channel) return null
            return await this.instance.get(`/user-channel-profile/${channel}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )


        } catch (error) {
            console.log(error)
        }
    }


    async getUserHistory() {
        try {
            return await this.instance.get('/history',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )


        } catch (error) {
            console.log(error)
        }
    }

    async changeAvatar(formData) {
        try {
            return await this.instance.patch('/updateavatar', formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )


        } catch (error) {
            console.log(error)
        }

    }

    async changeCoverimage(formData) {
        try {

            return await this.instance.patch('/updatecover-image', formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }

            )


        } catch (error) {
            console.log(error)
        }


    }

}
const Service = new AuthService()


export default Service