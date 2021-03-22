import React, { useState, useEffect, useContext } from 'react';
import AuthButton from './AuthButton';
import Table from './Table';
import Modal from './Modal';
import AddStudent from './AddStudent';
import Pagenation from './Pagenation';
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
    const [text, setText] = useState('')

    const fetchData = async () => {
        let searchText = text;
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
            setPagenation(response.pagenation)
            response = JSON.parse(response.data);
            if (!response.length)
                response = false

            setData({ ...data, students: response })
            // setPagenation(r)
            return;
        }

        setData({
            ...data,
            error: response.message
        })

    }

    useEffect(() => {
        authData.validateFetchRequest(fetchData)
        console.log('render from page state')
    }, [page])

    useEffect(() => {
        authData.validateFetchRequest(fetchData)
        console.log('render')
    }, [addStudentModalState, renderState])

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        await authData.validateFetchRequest(fetchData)
    }

    console.log(data.students == [])
    return (
        <div className="p-6">
            <AuthButton />
            <div className="w-3/5 mx-auto flex justify-between items-center">
                <form onSubmit={handleSearchSubmit} className="">
                    <input type="text" value={text} onChange={(e) => setText(e.target.value)}
                        placeholder="Enter student name"
                        className=" bg-blue-400 text-white placeholder-white focus:outline-none px-3 py-2 font-bold shadow hover:shadow-lg focus:bg-white border-4 border-transparent focus:border-blue-400 focus:text-blue-400 focus:placeholder-blue-400 transition duration-300"
                    />
                    <button type="submit" className="px-4 py-3 bg-blue-400 text-white font-bold shadow ml-3 focus:outline-none hover:shadow-lg hover:bg-blue-300 transition duration-300 ">Search</button>
                </form>
                <button className="capitalize px-4 py-3 bg-green-400 text-white font-bold shadow ml-3 focus:outline-none hover:shadow-lg hover:bg-green-300 transition duration-300 " onClick={() => setAddStudentState(true)} >
                    Add student
            </button>
            </div>
            <p className="text-red-400 text-xl" >{data.error}</p>
            <div className="flex flex-col ">
                {!data.students && <p>student_found</p>}
                {data.students && <Table data={data} renderDependency={setRenderState} />}
                {pagenation && data.students && <Pagenation pagenation_data={pagenation} setPage={setPage} />}
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
