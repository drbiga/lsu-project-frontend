import { useCallback, useEffect, useState } from "react";
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

    const handleStartSession = useCallback(async () => {
        const response = await studentService.startNextSession(selectStudentName);
        if (response.status === 'err') {
            alert(response.message);
        } else {
            await sessionService.listenToTimerUpdates(setRemainingTime);
            await sessionService.listenToSessionPartUpdates(setSessionPart);
            setSessionStarted(true);
            setSession(await sessionService.getSession(nextSessionSeqNumber));
        }
    }, [selectStudentName, nextSessionSeqNumber]);

    let sessionComponent;
    switch (sessionPart) {
        case SessionPart.WAITING_START: {
            sessionComponent = (<></>);
            break;
        }
        case SessionPart.READ_COMP: {
            if (session) {
                sessionComponent = (<ReadComp link={session.read_comp_link} />);
            }
            break;
        }
        case SessionPart.HOMEWORK: {
            sessionComponent = (<Homework />);
            break;
        }
        case SessionPart.SURVEY: {
            if (session) {
                sessionComponent = (<Survey link={session.survey_link} />);
            }
            break;
        }
        case SessionPart.FINISHED: {
            // setSessionStarted(false);
            console.log("Aqui");
            sessionComponent = (
                <div
                    style={{ minHeight: '100vh' }}
                    className="d-flex flex-column align-items-center justify-content-center"
                >
                    <h1>We are done</h1>
                    <p>Thank you for participating in the program and for concluding one more session</p>
                    <p>Way to go!</p>
                </div>
            )
            break;
        }
        default: {
            sessionComponent = (<h1>Something weird is happenning...</h1>)
        }
    }

    return (
        <>
        <Header />
            {
                selectStudentName === '' ? <UserSelection studentNames={studentNames} setSelectedStudentName={setSelectedStudentName} /> : (
                    <div>
                        <div className="container-fluid">
                            <div className="collapse" id="collapseExample">
                                <h1>Welcome back, {selectStudentName}!</h1>
                                <p>Your next session is #{nextSessionSeqNumber}</p>
                            </div>
                            <p>
                                <button onClick={() => setHeaderIsHidden(!headerIsHidden)} className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="true" aria-controls="collapseExample">
                                    {headerIsHidden ? "Show Header" : "Hide Header"}
                                </button>
                            </p>
                            <div className="">
                                {!sessionStarted && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleStartSession}
                                    >
                                        Start Session
                                    </button>
                                )}
                            </div>
                            {sessionComponent}
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Main;
