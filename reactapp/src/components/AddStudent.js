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

function AddStudent({ data = undefined, close }) {
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
        if (values.image === '')
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
            if (response.created) {
                close(false)
            } else {
                setError(response.error)
            }
        }
        auth.validateFetchRequest(sendData)
    }
    return (
        <form onSubmit={handleSubmit} className="bg-white flex flex-col p-12 space-y-4" >
            <p className="text-lg text-center font-bold text-gray-700" >Add Student</p>
            {error && <p className="text-red-400 font-semibold text-center capitalize">{error}</p>}
            <input type="text"
                className="border-green-400 border-4 text-gray-700 font-bold px-3 py-3 focus:outline-none shadow"
                required={true} placeholder='Name' value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
            <input type="text"
                className="border-green-400 border-4 text-gray-700 font-bold px-3 py-3 focus:outline-none shadow"
                required={true} placeholder='fname' value={values.fname} onChange={(e) => setValues({ ...values, fname: e.target.value })} />
            <input type="text"
                className="border-green-400 border-4 text-gray-700 font-bold px-3 py-3 focus:outline-none shadow"
                required={true} placeholder='lastname' value={values.lastname} onChange={(e) => setValues({ ...values, lastname: e.target.value })} />
            <input type="date"
                className="border-green-400 border-4 text-gray-700 font-bold px-3 py-3 focus:outline-none shadow"
                required={true} placeholder='date' value={values.date} onChange={(e) => setValues({ ...values, date: e.target.value })} />
            <input type="email"
                className="border-green-400 border-4 text-gray-700 font-bold px-3 py-3 focus:outline-none shadow"
                required={true} placeholder='email' value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
            <p className="font-bold text-center text-blue-400">
                Current image : {values.image}
            </p>
            <label htmlFor="image" className="text-center capitalize px-4 py-2 bg-green-400 text-white font-bold shadow ml-3 focus:outline-none hover:shadow-lg hover:bg-green-300 transition duration-300"  >Chose Image</label>
            <input type="file" id='image' className="hidden" ref={imageRef} onChange={(e) => {
                setError("")
                setValues({ ...values, image: e.target.files[0].name || "" })
            }} />

            <button type="submit" className="text-center capitalize px-4 py-2 bg-blue-400 text-white font-bold shadow ml-3 focus:outline-none hover:shadow-lg hover:bg-blue-300 transition duration-300">save</button>
        </form>
    )
}

export default AddStudent
