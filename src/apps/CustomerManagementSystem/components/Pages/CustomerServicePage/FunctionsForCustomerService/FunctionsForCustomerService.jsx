
import React, { useContext } from 'react';
import { AuthContext } from '../../../../context/UserContext';
//create function to copy the answer



export const handleToCopy = (e, element, index) => {

    const containerId = `allAnswer${index}`;
    const containerClass = document.getElementsByClassName("allColor");
    const container = document.getElementById(containerId);
    if (container) {
        // Loop through the elements with class "allColor"
        for (let i = 0; i < containerClass.length; i++) {
            containerClass[i].classList.remove("bg-yellow-100");
        }

        container.classList.add("bg-yellow-100");
        container.classList.remove("bg-lime-200");
    }

    // Copy the text to the clipboard
    navigator.clipboard.writeText(element);
};



const FunctionsForCustomerService = () => {
    const { user, totalQuestions, setTotalQuestions, setTotalQuestionLan, unknownQuestions, totalQuestionsLan, unknownQuestionsLan, setUnknownQuestions, setUnknownQuestionsLan, translationQuestions, setTranslationQuestions, setTranslationQuestionsLan, handleToStoreAllData, handleToDeleteAllData, setTranslationPercent, translateCalculatePercentage, unknownCalculatePercentage, setUnknownPercent } = useContext(AuthContext)
    return (
        <div>
        </div>
    );
};

export default FunctionsForCustomerService;


