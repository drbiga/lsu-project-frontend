import { ErrorMessage, Field, Form, Formik } from "formik";


export default function Admin() {
    return (
        <div className="container-fluid">
            <h1>Admin</h1>
            <div className="d-flex">
                {/* Create Session Form */}
                <Formik
                    initialValues={{ email: '', password: '' }}
                    // validate={values => {
                    //     const errors = {};
                    //     if (!values.email) {
                    //         errors.email = 'Required';
                    //     } else if (
                    //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    //     ) {
                    //         errors.email = 'Invalid email address';
                    //     }
                    //     return errors;
                    // }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            setSubmitting(false);
                        }, 400);
                    }}
                >
                {({ isSubmitting }) => (
                    <Form>    
                        <label className="form-label">Session</label>
                        <Field className="" placeholder="Session sequence number" component="div" type="email" name="email" />
                        <ErrorMessage name="email" component="div" />
                        <Field type="password" name="password" />
                        <ErrorMessage name="password" component="div" />
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
                </Formik>

                {/* List sessions */}
                <ol>
                    
                </ol>
            </div>
        </div>
    )
}
