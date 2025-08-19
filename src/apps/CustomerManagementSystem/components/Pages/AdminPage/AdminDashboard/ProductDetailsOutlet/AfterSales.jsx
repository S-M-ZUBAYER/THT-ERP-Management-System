import React, { useContext } from 'react';
import { AllProductContext } from '../../../../../context/ProductContext';
import { toast } from 'react-hot-toast';

const AfterSales = () => {

    const { Product } = useContext(AllProductContext);
    if (!Product) {
        toast.error("Don't get the product information");
        return;
    }

    return (
        <div className="mx-20 text-start mt-10 mb-20">
            <div>
                <h2 className="text-center text-xl font-semibold my-8 text-amber-400">
                    After Sales
                </h2>
                <p>
                    {Product?.afterSalesText
                    }
                </p>
            </div>

        </div>
    );
};

export default AfterSales;