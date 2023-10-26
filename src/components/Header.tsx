export default function Header() {
    return (
        <div
            className="d-flex justify-content-start align-items-center ps-5 gap-3"
            style={{backgroundColor: '#502E81', minHeight: '50px', color: '#fff'}}
        >
            <img src="lsu-logo.svg" alt="LSU Logo" height="30" />
            <p>&</p>
            <img src="rutgers-logo.svg" alt="Rutgers Logo" height="30" />
        </div>
    );
}