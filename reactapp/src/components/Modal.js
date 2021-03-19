import React from 'react';
function Modal(props) {
    const modalCls = "fixed  top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 w-screen h-screen overflow-hidden bg-black bg-opacity-50 z-10 flex items-center justify-center z-10";
    return (
        <div className={modalCls} onClick={props.closeModal}>
            <div className="w-9/12 mx-auto " onClick={e => { e.stopPropagation() }} >
                {props.children}
            </div>
        </div>
    )
}

export default Modal