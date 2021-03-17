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
        validateFetchRequest: auth.validateFetchRequest,
        user: auth.user,
        get_token: auth.get_token
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
                token: authData.get_token()
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



    useEffect(() => {
        authData.validateFetchRequest(fetchData)
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
