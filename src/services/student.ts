import axios from "axios";

interface StartSessionResponse {
    status: string;
    message: string;
}

export default class StudentService {
    public async getAllStudentNames(): Promise<string[]> {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/students`);
        return response.data;
    }

    public async getNextSessionSeqNumber(name: string): Promise<number> {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/students/${name}/num_finished_sessions`);
        return response.data + 1;
    }

    public async startNextSession(name: string): Promise<StartSessionResponse> {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/students/${name}/start_next_session`);
        return response.data;
    }
}