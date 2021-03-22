import React, { useState, useEffect, useContext } from 'react';
import AuthButton from './AuthButton';
import Table from './Table';
import Modal from './Modal';
import AddStudent from './AddStudent';
import { BASEURI } from '../utils';
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
    const [renderState, setRenderState] = useState(false);
    const [page, setPage] = useState(1);
    const [pagenation, setPagenation] = useState(false);

    const fetchData = async (searchText = '') => {
        let headers = new Headers({
            'Content-Type': 'application/json',
            "username": authData.user,
            "token": authData.get_token()
        });
        let response = await fetch(BASEURI + '/api/students/', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                q: searchText ? searchText : false,
                page: page
            })
        })
        response = await response.json();
        console.log(response)
        if (response.fetch) {
            response = JSON.parse(response.data);
            console.log(response)
            setData({ ...data, students: response })
            // setPagenation(r)
            return;
        }

        setData({
            ...data,
            error: response.message
        })

    }

    useEffect(()=>{
        authData.validateFetchRequest(fetchData)
        console.log('render from page state')
    },[page])

    useEffect(() => {
        authData.validateFetchRequest(fetchData)
        console.log('render')
    }, [ addStudentModalState, renderState])

    return (
        <div className="bg-blue">
            <AuthButton />
            <button className="bg-green-400 p-4 text-white" onClick={() => setAddStudentState(true)} >
                Add student
            </button>
            <p className="text-red-400 text-xl" >{data.error}</p>
            <div>
                <Table data={data} renderDependency={setRenderState} />
            </div>

            {
                addStudentModalState &&
                <Modal closeModal={() => { setAddStudentState(false) }}>
                    <AddStudent close={setAddStudentState} />
                </Modal>
            }


        </div>
    )
}

export default Home
