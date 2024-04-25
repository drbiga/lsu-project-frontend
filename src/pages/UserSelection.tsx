interface UserSelectionProps {
    studentNames: string[];
    setSelectedStudentName: React.Dispatch<React.SetStateAction<string>>;
}

export default function UserSelection(props: UserSelectionProps) {
    const { studentNames, setSelectedStudentName } = props;

    const style = {backgroundColor: '#0000'};

    return (
        <div
            style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
            className="container d-flex flex-column align-items-center justify-content-center"
        >
            {/* Black overlay */}
            <div style={{ backgroundColor: '#000a', zIndex: 1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}></div>
            <video
                autoPlay
                loop
                muted
                style={{overflow: 'hidden', maxWidth: '100%', position: 'absolute', zIndex: 0}}
            >
                <source
                    src="video.mp4"
                    type="video/mp4"
                    style={{overflow: 'hidden'}}
                ></source>
            </video>
            <div
                style={{zIndex: 2, color: '#fff', ...style}}
            >
                <h1 style={style}>Welcome back!</h1>
                <div style={style}>
                    <p style={{color: '#ddda', ...style}}>To the best time of your life</p>
                    <h2 style={{ fontSize: '1.2em', ...style}}>Who are you?</h2>
                    <ul style={{listStyle: "none", ...style}}>
                        {studentNames.map((name) => (
                            <li className="mb-1" key={name} style={style}>
                                <button className="btn btn-primary container" onClick={() => {
                                    setSelectedStudentName(name);
                                }}>{name}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}