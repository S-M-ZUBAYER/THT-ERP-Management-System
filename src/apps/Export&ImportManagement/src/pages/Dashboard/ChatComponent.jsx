import React, { useEffect } from "react";

const ChatComponent = () => {
    useEffect(() => {
        // Tawk.to Script
        const TawkTo = () => {
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = "https://embed.tawk.to/67527d454304e3196aed246d/1ied3imme"; // Replace with your Tawk.to widget URL
            s1.charset = "UTF-8";
            s1.setAttribute("crossorigin", "*");
            s0.parentNode.insertBefore(s1, s0);
        };

        TawkTo();
    }, []); // Run only once when the component mounts

    return (
        <div className="fixed bottom-4 right-4">
            {/* This div acts as a container for Tailwind styling */}
            {/* <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
                <p>Chat with us!</p>
            </div> */}
        </div>
    );
};

export default ChatComponent;
