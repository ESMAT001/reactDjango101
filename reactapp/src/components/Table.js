import React, { useState, useContext, useEffect } from 'react'
import { BASEURI } from '../utils';
import Modal from './Modal';
import { authContext } from './ProvideAuth';
import AddStudent from './AddStudent';

function useAuthInfo() {
    let auth = useContext(authContext);
    return ({
        validateFetchRequest: auth.validateFetchRequest,
        user: auth.user,
        get_token: auth.get_token
    })
}

function Table({ data, renderDependency }) {

    const auth = useAuthInfo()
    const [deleteModalState, setDeleteModalState] = useState(false)
    const [updateModalState, setUpdateModalState] = useState(false)

    const [error, setError] = useState('')
    const [studentId, setStudentId] = useState('')
    const [values, setValues] = useState({
        name: '',
        fname: '',
        lastname: '',
        date: '',
        email: '',
        image: ''
    })

    useEffect(() => {
        renderDependency(prev => !prev)
        setError('')
    }, [deleteModalState, updateModalState])



    const deleteStudent = async () => {
        let headers = new Headers({
            'Content-Type': 'application/json',
            "username": auth.user,
            "token": auth.get_token()
        });
        let response = await fetch(BASEURI + '/api/del_students/', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ id: studentId })
        })
        response = await response.json();
        console.log(response)
        if (response.deleted) {
            renderDependency(prev => !prev)
            setStudentId("")
            setDeleteModalState(false)
        } else {
            setError(response.error)
        }
    }

    const updateStudentInfo = async () => {
        if (studentId === '')
            return;


        let headers = new Headers({
            'Content-Type': 'application/json',
            "username": auth.user,
            "token": auth.get_token()
        });
        let response = await fetch(BASEURI + '/api/get_students/', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ id: studentId })
        })
        response = await response.json();
        if (response.student_found) {
            let student = await JSON.parse(response.student)
            student = student[0].fields;
            console.log(student)
            setValues({
                name: student.name,
                fname: student.fname,
                lastname: student.last_name,
                date: student.date_of_birth,
                email: student.email,
                image: student.image
            })
            setUpdateModalState(true)
        } else {
            setError(response.error)
        }
    }

    return (
        <div>

            {
                deleteModalState && <Modal closeModal={() => {
                    setStudentId('')
                    setDeleteModalState(false)
                }} >
                    <p>are you sure?</p>
                    <button onClick={() => auth.validateFetchRequest(deleteStudent)} >del</button>
                    <button onClick={() => {
                        setStudentId('')
                        setDeleteModalState(false)
                    }} >cancel</button>
                </Modal>
            }

            {
                updateModalState && !deleteModalState && values.name && <Modal closeModal={() => {
                    setStudentId('')
                    setUpdateModalState(false)
                }}>
                    <AddStudent data={values} close={setUpdateModalState} />
                </Modal>
            }

            {error && <p>{error}</p>}
            <table className="mx-auto w-4/5 text-center mt-14 ">
                <thead className="">
                    <tr className="font-bold  bg-blue-400 text-white shadow-lg hover:shadow-xl transition duration-300 " >
                        <td className="py-4">Image</td>
                        <td>Name</td>
                        <td>Father`s Name</td>
                        <td>Lastname</td>
                        <td>Email</td>
                        <td>Date of Birth</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                       <p className="p-2" ></p>
                    </tr>
                </thead>
                <tbody className="text-gray-600 font-semibold">
                    {
                        data.students &&
                        data.students.map(
                            (student) => (
                                <tr key={student.pk} className="divide-x-2 divide-blue-400 divide-opacity-25 hover:bg-gray-100 transition duration-300" >
                                    <td className="p-3  ">
                                        <div className="w-40 hover: mx-auto flex flex-col justify-center">
                                        <img className=" w-full shadow-lg " src={BASEURI + '/images/' + student.fields.image} alt="student" />
                                        </div>
                                    </td>
                                    <td>
                                        {student.fields.name}
                                    </td>
                                    <td>
                                        {student.fields.fname}
                                    </td>
                                    <td>
                                        {student.fields.last_name}
                                    </td>
                                    <td>
                                        {student.fields.email}
                                    </td>
                                    <td>
                                        {student.fields.date_of_birth}
                                    </td>
                                    <td>
                                        <button
                                            className="capitalize px-4 py-2 bg-red-400 text-white font-bold shadow ml-3 focus:outline-none hover:shadow-lg hover:bg-red-300 transition duration-300"
                                            onClick={() => {
                                                setDeleteModalState(true)
                                                setStudentId(student.pk)
                                            }}>
                                            delete
                                            </button>
                                    </td>
                                    <td>
                                        <button
                                            className="capitalize px-4 py-2 bg-blue-400 text-white font-bold shadow ml-3 focus:outline-none hover:shadow-lg hover:bg-blue-300 transition duration-300"
                                            onClick={() => {
                                                setStudentId(student.pk)
                                                auth.validateFetchRequest(updateStudentInfo)
                                            }}>
                                            update
                                            </button>
                                    </td>
                                </tr>
                            )
                        )

                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table
