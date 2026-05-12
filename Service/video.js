import axios from 'axios';


const url = import.meta.env.VITE_BACKEND_URL

export class VideoService {
    constructor() {

        this.instance = axios.create({
            baseURL: `${url}/api/v1`,
            withCredentials: true
        });
    }



    async getAllVideos({ query }) {
        try {
            return await this.instance.get('/getVideos', {
                params: {
                    query: query,
                    page: 1
                }
            }
            )
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }


    async getHomeVids(page) {
        try {
            return await this.instance.get('/getHomevids', {
                params: {

                    page: page
                }
            }
            )
        } catch (error) {
            return ("VideoService :: Login Error", error)
        }
    }

    async getVideoById({ id }) {

        try {
            return await this.instance.get(`/Get-video-by-id/${id}`, {

            }
            )


        } catch (error) {
            return ("VideoService ::Get Video By Id Error", error)
        }
    }

    async getSingleVideo({ id }) {
        try {
            return await this.instance.get(`/get-single-video/${id}`, {})
        } catch (error) {
            return ("VideoService ::Get Single video By Id Error", error)
        }
    }




    async changePublishStatus({ id, status }) {
        try {
            return await this.instance.patch(`/toggle-status/${id}`, {
                publishStatus: status
            })
        } catch (error) {
            return ("VideoService ::Get Single video By Id Error", error)
        }
    }


    async updateVideo({ id }, formData) {
        try {
            return await this.instance.patch(`/update-video/${id}`, formData)
        } catch (error) {
            return ("VideoService ::Update video Error", error)
        }
    }

    async deleteVideo({ id }) {
        try {
            return await this.instance.delete(`/delete-Video/${id}`)
        } catch (error) {
            return ("VideoService ::Update video Error", error)
        }
    }

    async uploadVideo(formData) {
        const config = {
            onUploadProgress: progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // Update your progress bar or feedback here
                console.log(`Upload Progress: ${percentCompleted}%`);
            }
        };
        try {
            return await this.instance.post(`/upload-Video`, formData, config)
        } catch (error) {
            return ("VideoService ::Get Single video By Id Error", error)
        }
    }

}

const Service = new VideoService()


export default Service