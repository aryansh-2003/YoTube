import axios from 'axios';



export class CommentService{
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

    


    async addComment(videoId,data){
        try {
            return await this.instance.post(`/add-comment/${videoId}`,{content:data})
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }

    
    async getComment({videoId},page,limit){
        try {
            return await this.instance.get(`/get-comments/${videoId}`,{
                params:{
                    page:1,
                    limit:10
                }
            })
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }

    async deleteComment({commentId}){
        try {
            return await this.instance.delete(`/delete-comment/${commentId}`,{
                params:{
                    page:1,
                    limit:10
                }
            })
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }

    async updateComment({commentId,content}){
        try {
            return await this.instance.patch(`/update-comment/${commentId}`,{content:content}
            )
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }


}

const Service = new CommentService()


export default Service