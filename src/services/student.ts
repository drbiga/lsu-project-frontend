import axios from "axios";

interface StartSessionResponse {
    status: string;
    message: string;
}

interface NextSeqNumberResponse {
    status: string;
    data: number;
    message?: string;
}

export default class StudentService {
    public async getAllStudentNames(): Promise<string[]> {
        const response = await axios.get(`http://localhost:8000/students`);
        return response.data;
    }

    public async getNextSessionSeqNumber(name: string): Promise<NextSeqNumberResponse> {
        const response = await axios.get(`http://localhost:8000/students/${name}/next_session_seq_number`);
        return response.data;
    }

    public async startNextSession(name: string): Promise<StartSessionResponse> {
        const response = await axios.post(`http://localhost:8000/students/${name}/start_next_session`);
        return response.data;
    }
}