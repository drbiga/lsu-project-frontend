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

interface SetSurveyQueueLinkResponse {
    status: string;
    message?: string;
}


interface GetStudentResponse {
    name: string;
    survey_queue_link: string;
}

export default class StudentService {
    public async getAllStudentNames(): Promise<string[]> {
        const response = await axios.get(`http://localhost:8000/students`);
        return response.data;
    }

    public async getStudent(studentName: string): Promise<GetStudentResponse> {
        const response = await axios.get(`http://localhost:8000/students/${studentName}`);
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

    public async setStudentSurveyQueueLink(studentName: string, surveyQueueLink: string): Promise<SetSurveyQueueLinkResponse> {
        const response = await axios.put(`http://localhost:8000/students?student_name=${studentName}&survey_queue_link=${surveyQueueLink}`);
        return response.data;
    }
}