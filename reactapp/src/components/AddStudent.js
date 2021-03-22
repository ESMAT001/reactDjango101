import React, { useState, useContext } from 'react';
import { authContext } from './ProvideAuth';
import { BASEURI } from '../utils'

function useAuthInfo() {
    let auth = useContext(authContext);
    return ({
        validateFetchRequest: auth.validateFetchRequest,
        user: auth.user,
        get_token: auth.get_token
    })
}

function AddStudent({ data = undefined,close }) {
    const auth = useAuthInfo()
    const [error, setError] = useState(false)
    const [values, setValues] = useState(data || {
        name: '',
        fname: '',
        lastname: '',
        date: '',
        email: '',
        image: ''
    })

    const imageRef = React.createRef()

    const handleSubmit = async (event) => { 
        event.preventDefault();
        if(values.image ==='')
            return setError('please chose an image!')
        const sendData = async () => {
            const formData = new FormData();
            const image = imageRef.current.files.length && values.image ? imageRef.current.files[0] : false;
            formData.append("image", image)
            for (const key in values) {
                if (Object.hasOwnProperty.call(values, key)) {
                    const element = values[key];
                    formData.append(key, element)
                }
            }
            const header = {
                'username': auth.user,
                'token': auth.get_token()
            }
            let response = await fetch(BASEURI + "/api/add_student/", {
                method: 'POST',
                headers: header,
                body: formData
            })
            response = await response.json()
            if(response.created){
                close(false)
            }else{
                setError(response.error)
            }
        }
        auth.validateFetchRequest(sendData)
    }
    return (
        <form onSubmit={handleSubmit} >
            {error && <p>{error}</p>}
            <input type="text" required={true} placeholder='name' value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
            <input type="text" required={true} placeholder='fname' value={values.fname} onChange={(e) => setValues({ ...values, fname: e.target.value })} />
            <input type="text" required={true} placeholder='lastname' value={values.lastname} onChange={(e) => setValues({ ...values, lastname: e.target.value })} />
            <input type="date" required={true} placeholder='date' value={values.date} onChange={(e) => setValues({ ...values, date: e.target.value })} />
            <input type="email" required={true} placeholder='email' value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
            <label htmlFor="image" >current: {values.image} </label>
            <input type="file" id='image' className="hidden" ref={imageRef} onChange={(e) => setValues({ ...values, image: e.target.files[0].name || "" })} />

            <button type="submit">save</button>
        </form>
    )
}

export default AddStudent
