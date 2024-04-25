export default function Survey(props: {link: string}) {
    return (
        <>
            <h1>Survey</h1>
            <iframe src={props.link} style={{
                width: '100%',
                height: '80vh'
            }}></iframe>
        </>
    )
}