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


export default class SessionService {
    private socket: WebSocket | null;

    constructor() {
        this.socket = null;
    }

    public createSession() {
        axios.post(`${import.meta.env.VITE_BASE_URL}/sessions`);
    }

    public startSession() {
        const response = axios.post(`${import.meta.env.VITE_BASE_URL}/sessions/start`);
        response.then((v) => console.log(v.data));
    }

    public async getSession(seqNumber: number): Promise<Session> {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/sessions`, {
            params: {
                seq_number: seqNumber
            }
        })
        return response.data;
    }

    // public async getRemainingTime() {
    //     const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/sessions/remaining_time`);
    //     if (response.data.status === 'success') {
    //         return response.data.data
    //     } else {
    //         return -1
    //     }
    // }

    // public async getCurrentPart() {
    //     const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/sessions/part`);
    //     if (response.data.status === 'success') {
    //         return response.data.data
    //     } else {
    //         return 'UNKNOWN'
    //     }
    // }

    public async listenToTimerUpdates(setTimerValue: React.Dispatch<React.SetStateAction<number>>) {
        this.socket = createWebSocket('timer');
        this.socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            setTimerValue(data.minutes*60 + data.seconds);
        });   
    }

    public async listenToSessionPartUpdates(setPartValue: React.Dispatch<React.SetStateAction<SessionPart>>) {
        this.socket = createWebSocket('session_part');
        this.socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            setPartValue(data.session_part);
        });   
    }
}
