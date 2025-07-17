import React, { useState } from 'react';
import Modal from 'react-modal';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from 'html2canvas';
import ChineseFormate from './ChineseFormate';
import MalaysiaFormate from './MalaysiaFormate';
import EnglishFormate from './EnglishFormate';

Modal.setAppElement('#root'); // Set the root element for accessibility

const PrintFunctionForInitialData = ({ finalData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [productList, setProductList] = useState("");


    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);



    const handlePrint = () => {
        console.log(finalData, "log");
        const input = document.getElementById('pdf-content');

        // Capture the content with specific dimensions
        html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210; // A4 width in mm
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Calculate X offset to center horizontally
            const xOffset = (imgWidth - (canvas.width * imgWidth) / canvas.width) / 2;

            // Add the first image, centered horizontally and vertically
            const yOffset = (pageHeight - imgHeight) / 2;
            pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Position and draw a custom underline below the title
            if (finalData?.language === "CN") {
                const underlineYPosition = yOffset + 33; // Adjust as needed based on title position and font size
                const underlineWidth = imgWidth * 0.25; // Set the underline width to 40% of the image width
                const underlineXStart = (imgWidth - underlineWidth) / 2; // Calculate the starting X position to center the underline

                pdf.setDrawColor(0, 0, 0); // Black color for underline
                pdf.setLineWidth(2); // Thickness of the underline
                pdf.line(underlineXStart, underlineYPosition, underlineXStart + underlineWidth, underlineYPosition);
            }
            // Position and draw a custom underline below the title
            if (finalData?.language === "MS") {
                // Increase thickness
                pdf.setLineWidth(1.5);  // Thicker line, adjust as needed

                // Underline for "MARKS & NOTES"
                const underlineWidth = imgWidth * 0.43;  // Adjust percentage for desired width
                const underlineXStart = (imgWidth - underlineWidth) / 2;  // Center horizontally
                const marksTitleY = yOffset + 22;  // Adjust position as needed
                pdf.line(underlineXStart, marksTitleY, underlineXStart + underlineWidth, marksTitleY);

                // Underline for "唛头"
                const underlineWidth2 = imgWidth * 0.12;  // Adjust percentage for desired width
                const underlineXStart2 = (imgWidth - underlineWidth2) / 2;  // Center horizontally
                const notesTitleY = yOffset + 43;  // Adjust position as needed
                pdf.line(underlineXStart2, notesTitleY, underlineXStart2 + underlineWidth2, notesTitleY);
            }





            // Add new pages if needed, keeping the content centered
            while (heightLeft >= 0) {
                pdf.addPage();
                position = heightLeft - imgHeight;
                pdf.addImage(imgData, 'PNG', xOffset, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Save the PDF with the desired filename
            // pdf.save(`product_details_${finalData?.printData?.map(p => p.productName).join('_')}.pdf`);
            pdf.save(`product_details_${productList}.pdf`);
        });
    };


    return (
        <div>
            <div className="flex justify-end my-5">
                <button
                    className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-green-500 text-white font-bold hover:text-black "
                    onClick={openModal}>
                    Print
                </button>
            </div>
            <Modal isOpen={isOpen} onRequestClose={closeModal} className="fixed inset-0 flex items-center justify-center z-50 overflow-scroll">
                {
                    finalData?.language === "EN" ?
                        <EnglishFormate
                            finalData={finalData}
                            setProductList={setProductList}
                            handlePrint={handlePrint}
                            closeModal={closeModal}
                        ></EnglishFormate> :
                        finalData?.language === "CN" ?
                            <ChineseFormate
                                finalData={finalData}
                                setProductList={setProductList}
                                handlePrint={handlePrint}
                                closeModal={closeModal}
                            ></ChineseFormate> :
                            <MalaysiaFormate
                                finalData={finalData}
                                setProductList={setProductList}
                                handlePrint={handlePrint}
                                closeModal={closeModal}
                            ></MalaysiaFormate>
                }
            </Modal>
        </div>
    );
};

export default PrintFunctionForInitialData;
