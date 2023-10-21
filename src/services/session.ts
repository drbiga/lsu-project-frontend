import axios from "axios";

export default class SessionService {
    public createSession() {
        axios.post(`${import.meta.env.VITE_BASE_URL}/session`)
    }

    public startSession() {
        axios.post(`${import.meta.env.VITE_BASE_URL}/session/start`)
    }

    public async getRemainingTime() {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/session/remaining_time`)
        if (response.data.status === 'success') {
            return response.data.data
        } else {
            return -1
        }
    }

    public async getCurrentPart() {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/session/part`)
        if (response.data.status === 'success') {
            return response.data.data
        } else {
            return 'UNKNOWN'
        }
    }
}
