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
            <table>
                <thead>
                    <tr>
                        <td>i</td>
                        <td>i</td>
                        <td>i</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.students &&
                        data.students.map(
                            (student) => (
                                <tr key={student.pk}>
                                    <td>{student.pk}</td>
                                    <td>
                                        <img className="w-20 h-20" src={BASEURI + '/images/' + student.fields.image} alt="student" />
                                    </td>
                                    <td>
                                        {student.fields.name}
                                    </td>
                                    <td>
                                        {student.fields.fname}
                                    </td>
                                    <td>
                                        {student.fields.email}
                                    </td>
                                    <td>
                                        <button onClick={() => {
                                            setDeleteModalState(true)
                                            setStudentId(student.pk)
                                        }}>
                                            delete
                                            </button>
                                    </td>
                                    <td>
                                        <button onClick={() => {
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
