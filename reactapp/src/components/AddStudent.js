import React, { useState } from 'react'

function AddStudent() {

    const [values, setValues] = useState({
        name: '',
        fname: '',
        lastname: '',
        date: '',
        email: '',
    })

    const handleSubmit = (event) => {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>
                <input type="text" placeholder='name' value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
                <input type="text" placeholder='fname' value={values.fname} onChange={(e) => setValues({ ...values, fname: e.target.value })} />
                <input type="text" placeholder='lastname' value={values.lastname} onChange={(e) => setValues({ ...values, lastname: e.target.value })} />
                <input type="date" placeholder='date' value={values.date} onChange={(e) => setValues({ ...values, date: e.target.value })} />
                <input type="email" placeholder='email' value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
                <input type="file" />
            </label>
            <input type="submit" value="Submit" />
        </form>
    )
}

export default AddStudent
