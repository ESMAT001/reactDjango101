import React, { useState, useEffect, useContext } from 'react';
import AuthButton from './AuthButton';
import Table from './Table';
import Modal from './Modal';
import AddStudent from './AddStudent';
import { BASEURI } from './utils';
import { authContext } from './ProvideAuth';


function useAuthInfo() {
    let auth = useContext(authContext);
    return ({
        user: auth.user,
        token: auth.token
    })
}





function Home() {

    const [data, setData] = useState({
        students: null,
        error: null
    });

    const authData = useAuthInfo()


    const [addStudentModalState, setAddStudentState] = useState(false);

    const fetchData = async (query = 'all') => {

        let response = await fetch(BASEURI + '/api/students/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: authData.user,
                token: authData.token
            })
        })
        response = await response.json();
        if (response.fetch) {
            response = JSON.parse(response.data);
            console.log(response)
            setData({ ...data, students: response })
            return;
        }

        setData({
            ...data,
            error: response.message
        })

    }

    const delete_token = async (e) => {
        e.preventDefault()
        await fetch(BASEURI + '/api/clear_token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: authData.user,
                token: authData.token
            })
        })

    }

    useEffect(() => {
        fetchData()
        window.addEventListener('beforeunload', delete_token)
    }, [])

    return (
        <div className="bg-blue">
            <AuthButton />
            <button className="bg-green-400 p-4 text-white" onClick={
                () => {
                    setAddStudentState(true)
                }
            } >
                Add student
            </button>
            <p className="text-red-400 text-xl" >{data.error}</p>
            <div>
                <Table data={data} />


            </div>

            {
                addStudentModalState &&
                <Modal closeModal={() => { setAddStudentState(false) }}>
                    <AddStudent />
                </Modal>
            }


        </div>
    )
}

export default Home
