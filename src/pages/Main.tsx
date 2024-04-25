import { useCallback, useEffect, useState } from "react";
import SessionService, { Session, SessionData, SessionPart } from "../services/session";
import ReadComp from "../components/ReadComp";
import Homework from "../components/Homework";
import Survey from "../components/Survey";
import StudentService from "../services/student";
import Header from "../components/Header";
import UserSelection from "./UserSelection";

import styled from "styled-components";

import { BiChevronRight } from "react-icons/bi";
import { Form, Formik, Field } from "formik";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const sessionService = new SessionService();
const studentService = new StudentService();

function presentText(sessionPart: string): string {
    const whitespace = sessionPart.replace('_', ' ').toLowerCase();
    const upper = whitespace.charAt(0).toUpperCase() + whitespace.slice(1);
    return upper;
}

function presentTime(time: number): string {
    return `Minutes: ${(Math.max(time / 60 - 1, 0)).toFixed(0)} Seconds: ${time % 60}`;
}


const HeadingInfo = styled.span`
    color: #502E81;
    font-weight: bold;
`;


function Main() {
    const [sessionStarted, setSessionStarted] = useState(false);
    const [nextSessionSeqNumber, setNextSessionSeqNumber] = useState(0);
    const [session, setSession] = useState<Session | null>(null);
    const [studentNames, setStudentNames] = useState<string[]>([]);
    const [selectStudentName, setSelectedStudentName] = useState<string>('');
    const [sessionData, setSessionData] = useState<SessionData>({remaining_time: 0, session_part: "WAITING_START"});
    const [hideSurveyQueueLinkForm, setHideSurveyQueueLinkForm] = useState(false);
    const [surveyQueueLink, setSurveyQueueLink] = useState<string>('');

    const [resumeSessionButtonVisible, setResumeSessionButtonVisible] = useState(false);

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

    useEffect(() => {
        // If the user has already done his/her first session, then we already
        // have the survey queue link.
        if (selectStudentName !== '' && nextSessionSeqNumber > 1) {
            async function execute() {
                const student = await studentService.getStudent(selectStudentName);
                setSurveyQueueLink(student.survey_queue_link);
            }

            execute();
        }
    }, [selectStudentName, nextSessionSeqNumber]);

    // Reminding the user to press the Submit button when the Read Comp part of the
    // session is ending.
    useEffect(() => {
        console.log(sessionData);
        if (sessionData.session_part === SessionPart.READ_COMP && sessionData.remaining_time <= 1) {
            setResumeSessionButtonVisible(true);
            alert('Your time for the reading comprehension has finished. Please submit the survey by pressing the Submit button at the bottom and then press the Proceed to homework button.')
        }
    }, [sessionData]);

    const handleStartSession = useCallback(async () => {
        const response = await studentService.startNextSession(selectStudentName);
        if (response.status === 'err') {
            alert(response.message);
        } else {
            await sessionService.listen(setSessionData);
            setSessionStarted(true);
            setSession(await sessionService.getSession(nextSessionSeqNumber));
        }
    }, [selectStudentName, nextSessionSeqNumber]);

    const handleResumeSession = useCallback(async () => {
        async function handle() {
            const response = await sessionService.resumeSession();
            if (response.status === 'err') {
                alert(response.message);
            } else {
                setResumeSessionButtonVisible(false);
            }
        }
        handle();
    }, [selectStudentName]);

    let sessionComponent;
    switch (sessionData.session_part) {
        case SessionPart.WAITING_START: {
            sessionComponent = (<></>);
            break;
        }
        case SessionPart.READ_COMP: {
            if (session) {
                sessionComponent = (
                    <>
                        <ReadComp link={nextSessionSeqNumber === 1 ? session.read_comp_link : surveyQueueLink} />
                    </>
                );
            }
            break;
        }
        case SessionPart.HOMEWORK: {
            sessionComponent = (<Homework />);
            break;
        }
        case SessionPart.SURVEY: {
            if (session) {
                sessionComponent = (<Survey link={surveyQueueLink} />);
            }
            break;
        }
        case SessionPart.FINISHED: {
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
                selectStudentName === '' ? (
                    <UserSelection studentNames={studentNames} setSelectedStudentName={setSelectedStudentName} />
                ) : (
                    <div style={{ height: '5vh' }}>
                        <div className="container-fluid d-flex flex-row justify-content-center align-items-center px-5 gap-5">
                            <div className="d-flex flex-row align-items-start">
                                <BiChevronRight color="#502E81" size={30} />
                                <p><HeadingInfo>Welcome back:</HeadingInfo> {presentText(selectStudentName)}!</p>
                            </div>
                            <div className="d-flex flex-row align-items-start">
                                <BiChevronRight color="#502E81" size={30} />
                                <p><HeadingInfo>Next session:</HeadingInfo> session #{nextSessionSeqNumber}</p>
                            </div>
                            <div className="d-flex flex-row align-items-start">
                                <BiChevronRight color="#502E81" size={30} />
                                <p><HeadingInfo>Session Part:</HeadingInfo> {presentText(sessionData.session_part)} </p>
                            </div>
                            <div className="d-flex flex-row align-items-start">
                                <BiChevronRight color="#502E81" size={30} />
                                <p><HeadingInfo>Remaining Time:</HeadingInfo> {presentTime(sessionData.remaining_time)}</p>
                            </div>
                            {!sessionStarted && (
                                <p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleStartSession}
                                    >
                                        Start Session
                                    </button>
                                </p>
                            )}
                            {sessionStarted && resumeSessionButtonVisible && sessionData.session_part === SessionPart.READ_COMP && (
                                <p>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleResumeSession}
                                    >
                                        Proceed to Homework
                                    </button>
                                </p>
                            )}
                            {(nextSessionSeqNumber === 1 && sessionStarted && !hideSurveyQueueLinkForm) && (
                                <Formik
                                    initialValues={{
                                        surveyQueueLink: ''
                                    }}
                                    onSubmit={(values, actions) => {
                                        async function submit() {
                                            const response = await studentService.setStudentSurveyQueueLink(selectStudentName, values.surveyQueueLink);
                                            if (response.status === 'success') {
                                                setHideSurveyQueueLinkForm(true);
                                                setSurveyQueueLink(values.surveyQueueLink);
                                            } else {
                                                alert('Something went wrong. Please contact mcost16@lsu.edu immediatelly');
                                            }
                                            actions.setSubmitting(false);
                                        }

                                        submit();
                                    }}
                                >
                                    <Form>
                                        <Field id="surveyQueueLink" name="surveyQueueLink" placeholder="Survey Queue Link here..." />
                                        <button type="submit">Submit</button>
                                    </Form>
                                </Formik>
                            )}
                        </div>
                        {sessionComponent}
                        {/* <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        /> */}
                    </div>
                )
            }
        </>
    )
}

export default Main;
