import { useEffect, useState } from "react"
import SessionService from "./services/session"
import ReadComp from "./components/ReadComp";
import Homework from "./components/Homework";
import Survey from "./components/Survey";
const sessionService = new SessionService()

enum SessionPart {
  WAITING_START = 'WAITING_START',
  READ_COMP = 'READ_COMP',
  HOMEWORK = 'HOMEWORK',
  SURVEY = 'SURVEY',
  FINISHED = 'FINISHED'
}

let remainingTimeInterval: number | null = null;
let sessionPartInterval: number | null = null;

function App() {
    const [sessionPart, setSessionPart] = useState(SessionPart.WAITING_START)
    const [remainingTime, setRemainingTime] = useState(0)

    useEffect(() => {
        async function getRemainingTime() {
            const newRemainingTime = await sessionService.getRemainingTime()
            setRemainingTime(newRemainingTime)
        }

        if (remainingTimeInterval === null) {
            remainingTimeInterval = setInterval(getRemainingTime, 1);
        }
    }, [])

    useEffect(() => {
        async function getCurrentPart() {
            const newCurrentPart = await sessionService.getCurrentPart()
            setSessionPart(newCurrentPart)
        }

        if (sessionPartInterval === null) {
            sessionPartInterval = setInterval(getCurrentPart, 1);
        }
    }, [])

    return (
        <>
            <h1>Ola</h1>
            <button onClick={() => sessionService.createSession()}>Create Session</button>
            <button onClick={() => sessionService.startSession()}>Start Session</button>
            <p>Session part: {sessionPart.toString()}</p>
            <p>Remaining time: {remainingTime}</p>
            {
                sessionPart === SessionPart.READ_COMP && (<ReadComp />)
            }
            {
                sessionPart === SessionPart.HOMEWORK && (<Homework />)
            }
            {
                sessionPart === SessionPart.SURVEY && (<Survey />)
            }
        </>
    )
}

export default App
