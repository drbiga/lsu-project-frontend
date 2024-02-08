export default function Header() {
    const backgroundColor = '#502E81';
    return (
        <div
            className="d-flex justify-content-start align-items-center ps-5 gap-3"
            style={{backgroundColor, minHeight: '50px', height: '5vh', color: '#fff'}}
        >
            <img style={{backgroundColor}} src="lsu-logo.svg" alt="LSU Logo" height="30" />
            <p style={{backgroundColor}}>&</p>
            <img style={{backgroundColor}} src="rutgers-logo.svg" alt="Rutgers Logo" height="30" />
        </div>
    );
}