import React, { useContext, useState } from 'react';
import { AiFillFileText } from 'react-icons/ai';
import { AllProductContext } from '../../../../../context/ProductContext';


const Invoice = () => {

    const { Product } = useContext(AllProductContext);

    const handleToDownload = (product) => {
        const fileUrl = `https://grozziieget.zjweiting.com:8033/tht/mallProductImages/${product}`;

        fetch(fileUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${product}`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold text-amber-400 mb-4">Available Invoice Documents</h1>
            <div className="mb-20">
                {Product?.invoiceFile && ((Product?.invoiceFile).split(",")).map((element, index) => {
                    return <div key={index} className="mx-2 mt-5 grid grid-cols-8  text-start bg-slate-200 hover:bg-yellow-100 cursor-pointer rounded-lg px-2 py-2">
                        <div className=" col-span-8 grid grid-cols-3 md:grid-cols-4" onClick={() => handleToDownload(element)} >
                            {/* <img className="h-6 w-6" src={pdfLogo}></img> */}
                            <AiFillFileText className=" text-amber-400 h-6 w-6" ></AiFillFileText>
                            <p>
                                {element}
                            </p>
                            <p className="hidden md:block">
                                {(Product?.date).split("T")[0]}
                            </p>
                            <p className="hidden md:block">
                                {Product?.time}
                            </p>
                        </div>
                    </div>
                })}
            </div>
        </div>
    );
};

export default Invoice;