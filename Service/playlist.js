import axios from 'axios';




const url = import.meta.env.VITE_BACKEND_URL

export class PlaylistService {
    constructor() {

        this.instance = axios.create({
            baseURL: `${url}/api/v1`,
            withCredentials: true
        });

    }



    async createPlaylist({ name, description }) {
        try {
            return await this.instance.post('/create-playlist', {
                name: name,
                description: description
            })
        } catch (error) {
            return ("PlaylistService :: create Error", error)
        }
    }
    async getUserPlaylist() {
        try {
            return await this.instance.get('/get-playlist')
        } catch (error) {
            return ("PlaylistService :: getting playlist Error", error)
        }
    }

    async addVideoToPlaylist({ playlistId, videoId }) {
        try {
            return await this.instance.patch(`/add-video/${playlistId}/${videoId}`)
        } catch (error) {
            return ("PlaylistService :: getting playlist Error", error)
        }
    }

    async getPlaylistById({ playlistId }) {
        try {
            return await this.instance.get(`/get-playlist-by-id/${playlistId}`)
        } catch (error) {
            return ("PlaylistService :: getting playlist Error", error)
        }
    }

    async deleteVideoFromPlaylist({ playlistId, videoId }) {
        try {
            return await this.instance.delete(`/remove-video/${playlistId}/${videoId}`)
        } catch (error) {
            return ("PlaylistService :: getting playlist Error", error)
        }
    }


}

const Service = new PlaylistService()


export default Service