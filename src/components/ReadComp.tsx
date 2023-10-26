export default function ReadComp(props: { link: string }) {
    return (
        <>
            <h1>Read Comp</h1>
            <iframe src={props.link} style={{
                width: '100%',
                height: '80vh'
            }}></iframe>
        </>
    )
}
