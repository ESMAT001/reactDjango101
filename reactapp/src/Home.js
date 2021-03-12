import React, { useState, useEffect } from 'react';
import AuthButton from './AuthButton';




function Home() {
    const [data, setData] = useState({
        data: null,
    });


    const fetchData = async (query = 'all') => {
        let data = await fetch('/api/students?query=all')
        data = await data.json();
        data = JSON.parse(data.data);
        console.log(data)
        setData({ data })
    }


    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <AuthButton />
            <div>
                <table>
                    <thead>
                        <tr>
                            <td>i</td>
                            <td>i</td>
                            <td>i</td>
                            <td>i</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                1
                            </td>
                            <td>
                                2
                            </td>
                            <td>
                                3
                            </td>
                            <td>
                                4
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Home
