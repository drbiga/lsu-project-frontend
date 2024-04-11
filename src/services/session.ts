import axios from "axios";
import createWebSocket from "./session_utils/websocket";


export enum SessionPart {
    WAITING_START = 'WAITING_START',
    READ_COMP = 'READ_COMP',
    HOMEWORK = 'HOMEWORK',
    SURVEY = 'SURVEY',
    FINISHED = 'FINISHED'
}

export interface Session {
	seq_number: number;
	read_comp_link: string;
	survey_link: string;
}

export interface SessionData {
    session_part: string;
    remaining_time: number;
}

export default class SessionService {
    private socket: WebSocket | null;

    constructor() {
        this.socket = null;
    }

    public createSession() {
        axios.post(`http://localhost:8000/sessions`);
    }

    public startSession() {
        const response = axios.post(`http://localhost:8000/sessions/start`);
        response.then((v) => console.log(v.data));
    }

    public async getSession(seqNumber: number): Promise<Session> {
        const response = await axios.get(`http://localhost:8000/sessions`, {
            params: {
                seq_number: seqNumber
            }
        })
        return response.data;
    }


    public async listen(setSessionData: React.Dispatch<React.SetStateAction<SessionData>>) {
        this.socket = createWebSocket();
        this.socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            setSessionData(data);
        });
    }

    public async resumeSession(): Promise<{status: string, message: string}> {
        const response = await axios.post(`http://localhost:8000/sessions/executing/resume`);
        return response.data
    }
}
