import axios from 'axios';



export class PlaylistService{
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

    

    async createPlaylist({name,description}){
        try {
            return await this.instance.post('/create-playlist',{
                name:name,
                description:description
            })
        } catch (error) {
            return ("PlaylistService :: create Error", error)
        }
    }
     async getUserPlaylist(){
        try {
            return await this.instance.get('/get-playlist')
        } catch (error) {
            return ("PlaylistService :: getting playlist Error", error)
        }
    }

      async addVideoToPlaylist({playlistId,videoId}){
        try {
            return await this.instance.patch(`/add-video/${playlistId}/${videoId}`)
        } catch (error) {
            return ("PlaylistService :: getting playlist Error", error)
        }
    }

    async getPlaylistById({playlistId}){
        try {
            return await this.instance.get(`/get-playlist-by-id/${playlistId}`)
        } catch (error) {
            return ("PlaylistService :: getting playlist Error", error)
        }
    }


}

const Service = new PlaylistService()


export default Service