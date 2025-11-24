import React, { useContext } from 'react';
import { AllProductContext } from '../../../../../context/ProductContext';

const Inventory = () => {
    const {Product}=useContext(AllProductContext);
    return (
        <div className="mx-20 text-start  mt-10 mb-20">
        <div>
           <h2 className="text-center text-xl font-semibold my-8 text-amber-400">
           Inventory
           </h2>
           <p>
            {Product?.inventoryText}

            
           {/* Inventory refers to the goods and materials that a business holds in stock for sale or use in its operations. Effective inventory management is critical for businesses of all sizes and types, as it helps ensure that the right products are available at the right time to meet customer demand and avoid stockouts.
Managing inventory requires careful planning and monitoring, including tracking inventory levels, forecasting demand, and analyzing sales trends. This information can help businesses make informed decisions about when to order more inventory, how much to order, and when to discount or liquidate excess inventory.
There are various inventory management techniques that businesses can use, including first-in-first-out (FIFO) and last-in-first-out (LIFO) methods, as well as just-in-time (JIT) inventory management. Each approach has its advantages and disadvantages, and businesses may choose to use a combination of techniques to best meet their needs.
In addition to managing inventory levels, businesses must also ensure that their inventory is properly stored and maintained. This includes implementing appropriate storage and handling procedures, conducting regular inspections and audits, and addressing any issues or discrepancies as they arise. */}
           </p>
       </div>
   </div>
    );
};

export default Inventory;



