// apiService.js

/**
 * fetchData - Fetches data from the given endpoint, sets the result in state, and manages loading states.
 * @param {string} endpoint - The API endpoint URL to fetch data from.
 * @param {function} setState - The state setter function to update the data.
 * @param {string} loadingKey - The key for managing the loading state in a parent component.
 * @param {function} setLoading - The state setter function to update loading status.
 */
export const fetchData = async (endpoint, setState, loadingKey, setLoading) => {
    // Set loading to true for the specific loading key
    setLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        setState(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        // Set loading to false for the specific loading key
        setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
};
