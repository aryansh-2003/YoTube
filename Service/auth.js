import axios from 'axios';
import { useNavigate } from 'react-router';


export class AuthService{
    constructor(){

    this.instance = axios.create({
     baseURL: 'https://youtube-backend-052x.onrender.com/api/v1/users',
         });
        
    }

    async getLoggedInUser(){
        const token = localStorage.getItem('token')
        if(!token) return null
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        return this.getCurrentUser(token)

    }
    async login(email,password){
        try {
            const data = await this.instance.post('/login',{email:email,password:password},{withCredentials:true})
            const {acessToken,refreshToken} = data?.data?.data
            localStorage.removeItem(acessToken,refreshToken)
            localStorage.setItem('token',acessToken)
            localStorage.setItem('refreshToken',refreshToken)
            axios.defaults.headers.common['Authorization'] =   `Bearer ${acessToken}`
            return data
        } catch (error) {
            return ("AuthService :: Login Error", error)
        }
    }

    async Logout(){
        try {
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            delete axios.defaults.headers.common['Authorization']
            return await this.instance.post('/logout')
        } catch (error) {
            return ("AuthService :: Logout Error", error)
        }
    }

    async registerUser(formData){
           const keysArray = Array.from(formData.values());
    
        try {
            return this.instance.post('/register',formData)
        } catch (error) {
            return ("AuthService :: Register Error", error)
        }
    }

    async getCurrentUser(){
        try {
             const token = localStorage.getItem('token')
             if(!token) return null
             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
             const response =  await this.instance.get('/current-user',
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            )

            return response

        } catch (error) {
            if(error.status === 401){
                console.log("hello",error.status)
                this.instance.post(`/refresh-token`,{refreshToken:localStorage.getItem('refreshToken')}).then((res) => {
                    if(res.status == 200){
                    console.log(res + ',' + "accessToken:" + res.data?.data?.accessToken + "," + "refreshToken:" + res.data?.data?.refreshToken)
                    localStorage.setItem('token',res.data?.data?.accessToken)
                    localStorage.setItem('refreshToken',res.data?.data?.refreshToken)
                    axios.defaults.headers.common['Authorization'] =   `Bearer ${res.data?.data?.accessToken}`
                    window.location.reload(true);
                    }
                })
            }
            // this.getCurrentUser()
            console.log(error.status)
        }
    }


  async logout() {
  try {
    // Send logout to backend first (optional, only if your backend needs it)
    await this.instance.post('/logout');

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    // Remove headers everywhere
    delete axios.defaults.headers.common['Authorization'];
    delete this.instance.defaults.headers.common['Authorization'];

    return true;
  } catch (err) {
    console.error("AuthService :: Logout Error", err);
    return false;
  }
}


 async getUserChannel({channel}){
        try {
             if(!channel) return null
             const token = localStorage.getItem('token')
             if(!token) return null
             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
             return await this.instance.get(`/user-channel-profile/${channel}`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
             )


        } catch (error) {
            console.log(error)
        }
    }


async getUserHistory(){
        try {
             const token = localStorage.getItem('token')
             if(!token) return null
             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
             return await this.instance.get('/history',
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            )


        } catch (error) {
            console.log(error)
        }
    }

async changeAvatar(formData){
        try {
             const token = localStorage.getItem('token')
             if(!token) return null
             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
             return await this.instance.patch('/updateavatar',formData,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            )


        } catch (error) {
            console.log(error)
        }

    }

async changeCoverimage(formData){
        try {
             const token = localStorage.getItem('token')
             if(!token) return null
             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
             return await this.instance.patch('/updatecover-image',formData,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }

            )


        } catch (error) {
            console.log(error)
        }
    

}

}
const Service = new AuthService()


export default Service