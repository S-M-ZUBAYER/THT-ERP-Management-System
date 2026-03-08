export const API_BASE_URL = "https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter";

export const API_ENDPOINTS = {
    tiktok: `${API_BASE_URL}/tiktok/shop`,
    shopee: `${API_BASE_URL}/shopee/shop`,
    lazada: `${API_BASE_URL}/lazada/shop`,
};

export const ITEMS_PER_PAGE = 12;

export const PLATFORM_STYLES = {
    header: {
        tiktok: { bg: "FFDFF5EA", fontColor: "FF000000", fontSize: 14 },
        lazada: { bg: "FFFFF3E0", fontColor: "FF000000", fontSize: 14 },
        shopee: { bg: "FFFEE2E2", fontColor: "FF000000", fontSize: 14 },
    },
    summary: {
        tiktok: { bg: "FFECFDF5", fontColor: "FF000000", fontSize: 12 },
        lazada: { bg: "FFFFF7ED", fontColor: "FF000000", fontSize: 12 },
        shopee: { bg: "FFFEF2F2", fontColor: "FF000000", fontSize: 12 },
    },
};