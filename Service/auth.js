import axios from 'axios';



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
    
    console.log(keysArray,formData);
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
             return await this.instance.get('/current-user',
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            )


        } catch (error) {
            console.log(error)
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

}

const Service = new AuthService()


export default Service