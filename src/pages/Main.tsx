import { useEffect, useState } from "react";
import SessionService, { Session, SessionPart } from "../services/session";
import ReadComp from "../components/ReadComp";
import Homework from "../components/Homework";
import Survey from "../components/Survey";
import StudentService from "../services/student";
import Header from "../components/Header";
import UserSelection from "./UserSelection";
const sessionService = new SessionService();
const studentService = new StudentService();


function Main() {
    const [sessionStarted, setSessionStarted] = useState(false);
    const [sessionPart, setSessionPart] = useState(SessionPart.WAITING_START);
    const [nextSessionSeqNumber, setNextSessionSeqNumber] = useState(0);
    const [session, setSession] = useState<Session | null>(null);
    const [remainingTime, setRemainingTime] = useState(0);
    const [studentNames, setStudentNames] = useState<string[]>([]);
    const [selectStudentName, setSelectedStudentName] = useState<string>('');

    const [headerIsHidden, setHeaderIsHidden] = useState<boolean>(true);

    useEffect(() => {
        async function getStudentNames() {
            const names = await studentService.getAllStudentNames();
            setStudentNames(names);
        }

        getStudentNames();
    }, []);

    useEffect(() => {
        async function getNextSeqNumber() {
            const seqNumber = await studentService.getNextSessionSeqNumber(selectStudentName);
            if (seqNumber.status === 'success') {
                setNextSessionSeqNumber(seqNumber.data);
            } else {
                alert(seqNumber.message);
            }
        }
        
        if (selectStudentName !== '') {
            getNextSeqNumber();
        }
    }, [selectStudentName]);


    return (
        <>
        <Header />
            {
                selectStudentName === '' ? <UserSelection studentNames={studentNames} setSelectedStudentName={setSelectedStudentName} /> : (
                    <div>
                        {
                            // If the session is finished
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
                            // Else
                                <div className="container">
                                    <div className="collapse" id="collapseExample">
                                        <h1>Welcome back, {selectStudentName}!</h1>
                                        <p>Your next session is #{nextSessionSeqNumber}</p>
                                    </div>
                                    <p>
                                        <button onClick={() => setHeaderIsHidden(!headerIsHidden)} className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="true" aria-controls="collapseExample">
                                            {headerIsHidden ? "Show Header" : "Hide Header"}
                                        </button>
                                    </p>
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
                                                        setSession(await sessionService.getSession(nextSessionSeqNumber));
                                                    }
                                                }}
                                            >
                                                Start Session
                                            </button>
                                        )}
                                    </div>
                                    {/* <p>Session part: {sessionPart.toString()}</p>
                                    <p>Remaining time: {remainingTime}</p> */}
                                    {
                                        (sessionPart === SessionPart.READ_COMP && session) && (<ReadComp link={session.read_comp_link} />)
                                    }
                                    {
                                        sessionPart === SessionPart.HOMEWORK && (<Homework />)
                                    }
                                    {
                                        (sessionPart === SessionPart.SURVEY && session) && (<Survey link={session.survey_link} />)
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
