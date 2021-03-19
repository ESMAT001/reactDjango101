import React from 'react'

function Table({data}) {
    return (
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
                            <tr key='1'>
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
                                    <button>
                                        delete
                                            </button>
                                </td>
                                <td>
                                    <button>
                                        update
                                            </button>
                                </td>
                            </tr>
                        )
                    )

                }
            </tbody>
        </table>
    )
}

export default Table
