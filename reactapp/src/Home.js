import React, { useState, useEffect } from 'react';
import AuthButton from './AuthButton';
import Table from './Table';
import Modal from './Modal';
import AddStudent from './AddStudent';

function Home() {
    const [data, setData] = useState({
        students: null,
    });

    const [addStudentModalState, setAddStudentState] = useState(false);

    const fetchData = async (query = 'all') => {
        let data = await fetch('/api/students?query=all')
        data = await data.json();
        data = JSON.parse(data.data);
        console.log(data)
        setData({ students: data })
    }


    useEffect(() => {
        fetchData()
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
            <div>
                <Table data={data} />
            </div>

            {
                addStudentModalState &&
                <Modal closeModal={() => { setAddStudentState(false) }}>
                    <AddStudent/>
                </Modal>
            }


        </div>
    )
}

export default Home
