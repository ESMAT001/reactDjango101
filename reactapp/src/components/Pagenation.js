import React from 'react'

function Pagenation({ pagenation_data, setPage }) {


    return (
        <div className="flex justify-center items-center my-5">
            {
                pagenation_data.has_previous && <div>
                    <button
                        className="bg-blue-400 py-2 px-3 text-white font-semibold shadow hover:bg-blue-500 hover:shadow-lg transition duration-300 " onClick={() => setPage(1)} >&laquo;
                                first</button>
                    <button
                        className="bg-blue-400 py-2 px-3 text-white font-semibold shadow hover:bg-blue-500 hover:shadow-lg transition duration-300" onClick={() => setPage(pagenation_data.previous_page_number)}>
                        previous
                    </button>

                </div>
            }
            <span className="bg-blue-400 py-2 px-3 text-white font-semibold" >
                Page {pagenation_data.number} of {pagenation_data.num_pages}
            </span>
            {
                pagenation_data.has_next && <div>
                    <button
                        className="bg-blue-400 py-2 px-3 text-white font-semibold shadow hover:bg-blue-500 hover:shadow-lg transition duration-300" onClick={() => setPage(pagenation_data.next_page_number)}>
                        next
                    </button>
                    <button
                        className="bg-blue-400 py-2 px-3 text-white font-semibold shadow hover:bg-blue-500 hover:shadow-lg transition duration-300" onClick={() => {
                            console.log('pagenation')
                            setPage(pagenation_data.num_pages)
                        }}>
                        last
                        &raquo;
                    </button>
                </div>
            }
        </div>
    )
}

export default Pagenation
