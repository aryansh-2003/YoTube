import axios from 'axios';



export class VideoService{
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

    

    async getAllVideos({query}){
        try {
            return await this.instance.get('/getVideos',{
                params:{
                    query: query,
                    page:1
                }
            }
            )
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }


     async getHomeVids(){
        try {
            return await this.instance.get('/getHomevids',{
                params:{

                    page:1
                }
            }
            )
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }

    async getVideoById({id}){

        try {
            return await this.instance.get(`/Get-video-by-id/${id}`,{
              
            }
            )
            

        } catch (error) {
            return ("VideoService ::Get Video By Id Error", error)
        }
    }

    async getSingleVideo({id}){
         try {
            return await this.instance.get(`/get-single-video/${id}`,{})
        } catch (error) {
            return ("VideoService ::Get Single video By Id Error", error)
        }
    }


    async changePublishStatus({id,status}){
         try {
            return await this.instance.patch(`/toggle-status/${id}`,{
                publishStatus : status
            })
        } catch (error) {
            return ("VideoService ::Get Single video By Id Error", error)
        }
    }

    async uploadVideo(formData){
        const config = {
  onUploadProgress: progressEvent => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    // Update your progress bar or feedback here
    console.log(`Upload Progress: ${percentCompleted}%`);
  }
};
        try {
            return await this.instance.post(`/upload-Video`,formData,config)
        } catch (error) {
            return ("VideoService ::Get Single video By Id Error", error)
        }
    }

}

const Service = new VideoService()


export default Service