import React, { useContext } from 'react';
import { AllProductContext } from '../../../../../context/ProductContext';

const AfterSalesInstruction = () => {
    const {Product}=useContext(AllProductContext);
    return (
        <div className="mx-20 text-start  mt-10 mb-20">
             <div>
                <h2 className="text-center text-xl font-semibold my-8 text-amber-400">
                After-sales Instructions
                </h2>
                <p>
{Product?.afterSalesInstruction}

                {/* After-sales instruction is a critical component of ensuring that your customers are fully satisfied with their purchase. It provides them with the knowledge and tools they need to get the most out of their product, and it helps build long-term loyalty and repeat business.
Our after-sales instruction program is designed to provide your customers with clear and concise instructions on how to use and maintain their product. Our team of experts is trained to deliver comprehensive and engaging instruction, ensuring that your customers have the knowledge and confidence they need to use their product to its full potential.
We offer a range of after-sales instruction options, including in-person instruction, online videos, and printed materials. We can work with you to develop a customized instruction program that meets your specific needs and the needs of your customers.
Our after-sales instruction program is not only beneficial for your customers but also for your business. By providing comprehensive instruction, you can reduce the number of support requests and returns, resulting in a more efficient and cost-effective operation.
At our after-sales instruction service, we are committed to providing the highest quality service to ensure that your customers are fully satisfied with their purchase. We believe that by providing clear and concise instruction, we can help you build long-term loyalty and repeat business, ensuring your continued success.
Contact us today to learn more about our after-sales instruction program and how we can help you improve customer satisfaction and drive business growth. */}
                </p>
            </div>
        </div>
    );
};

export default AfterSalesInstruction;