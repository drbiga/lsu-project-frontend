export default function ReadComp(props: { link: string }) {
    return (
        <>
            <iframe src={props.link} style={{
                width: '100%',
                height: '100vh'
            }}></iframe>
        </>
    )
}
