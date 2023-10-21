import { useEffect, useState } from "react"
import SessionService from "./services/session"
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
        sessionPart === SessionPart.READ_COMP && (
          <>
            <h1>Read Comp</h1>
            <iframe src="https://rutgers.ca1.qualtrics.com/jfe/form/SV_8JlFopZFaZ4EE9o" style={{
              width: '100%',
              height: '80vh'
            }}></iframe>
          </>
        )
      }
      {
        sessionPart === SessionPart.HOMEWORK && (
          <>
            <h1>Homework</h1>
            <p>
              Thank you for anwering the reading and composition section of this session.
              Please proceed to your normal homework now in a <b>separate</b> tab.
            </p>
            <a href="https://google.com" target="_blank">Click here to open a new tab and continue working</a>
          </>
        )
      }
      {
        sessionPart === SessionPart.SURVEY && (
          <>
            <h1>Survey</h1>
          </>
        )
      }
    </>
  )
}

export default App
