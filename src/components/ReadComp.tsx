export default function ReadComp(props: { link: string }) {
    return (
        <div>
            <iframe src={props.link} style={{
                width: '100%',
                height: '90vh'
            }}></iframe>
        </div>
    )
}
