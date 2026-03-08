export const getPaginationData = (items, currentPage, itemsPerPage = 12) => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return {
        totalPages,
        startIndex,
        endIndex,
        currentItems
    };
};
