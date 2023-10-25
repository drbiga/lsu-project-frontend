import { useEffect, useState } from "react";
import SessionService, { SessionPart } from "../services/session";
import ReadComp from "../components/ReadComp";
import Homework from "../components/Homework";
import Survey from "../components/Survey";
import StudentService from "../services/student";
const sessionService = new SessionService();
const studentService = new StudentService();


function Main() {
    const [sessionStarted, setSessionStarted] = useState(false);
    const [sessionPart, setSessionPart] = useState(SessionPart.WAITING_START);
    const [remainingTime, setRemainingTime] = useState(0);
    const [studentNames, setStudentNames] = useState<string[]>([]);
    const [selectStudentName, setSelectedStudentName] = useState<string>('');

    useEffect(() => {
        async function getStudentNames() {
            const names = await studentService.getAllStudentNames();
            setStudentNames(names);
        }

        getStudentNames();
    }, []);

    return (
        <>
            {
                selectStudentName === '' ? (
                    <div
                        style={{ minHeight: '100vh' }}
                        className="container d-flex flex-column align-items-center justify-content-center"
                    >
                        <h1>Welcome...</h1>
                        <div>
                            <p style={{color: '#0005'}}>To the best time of your life</p>
                            <h2 style={{ fontSize: '1.2em'}}>Who are you?</h2>
                            <ul style={{listStyle: "none"}}>
                                {studentNames.map((name) => (
                                    <li key={name}>
                                        <button className="btn btn-primary" onClick={() => {
                                            setSelectedStudentName(name);
                                        }}>{name}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div>
                        {
                            sessionPart === SessionPart.FINISHED ? (
                                <div
                                    style={{ minHeight: '100vh' }}
                                    className="d-flex flex-column align-items-center justify-content-center"
                                >
                                    <h1>We are done</h1>
                                    <p>Thank you for participating in the program and for concluding one more sesion</p>
                                    <p>Way to goo!</p>
                                </div>
                            ) : (
                                <div>
                                    <h1>Welcome back, {selectStudentName}!</h1>
                                    <div>
                                        {!sessionStarted && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={async () => {
                                                    const response = await studentService.startNextSession(selectStudentName);
                                                    if (response.status === 'err') {
                                                        alert(response.message);
                                                    } else {
                                                        await sessionService.listenToTimerUpdates(setRemainingTime);
                                                        await sessionService.listenToSessionPartUpdates(setSessionPart);
                                                        setSessionStarted(true);
                                                    }
                                                }}
                                            >
                                                Start Session
                                            </button>
                                        )}
                                    </div>
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
                                    {
                                        sessionPart === SessionPart.FINISHED && (
                                            <>{setSessionStarted(false)}</>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                )
            }
        </>
    )
}

export default Main;
