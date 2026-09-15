export const getShopFields = (shop, platform) => {
    switch (platform) {
        case "tiktok":
            return {
                email: shop.TikTokUserEmail,
                key: shop.TikTokAPPKey,
                country: shop.ShopCountry,
            };
        case "shopee":
            return {
                email: shop.ShopeeUserEmail,
                key: shop.ShopeeAPPKey,
                country: shop.ShopCountry,
            };
        case "lazada":
            return {
                email: shop.LazadaUserEmail,
                key: shop.LazadaAPPKey,
                country: shop.ShopCountry,
            };
        default:
            return {};
    }
};

export const filterShopsByDateRange = (shops, startDate, endDate) => {
    const startDateObj = new Date(startDate + "T00:00:00");
    const endDateObj = new Date(endDate + "T23:59:59.999");

    return shops.filter((shop) => {
        const shopDate = new Date(shop.createdAt);
        return shopDate >= startDateObj && shopDate <= endDateObj;
    });
};

export const normalizeShopKey = (shop, platform) => {
    const { key } = getShopFields(shop, platform);
    return key === undefined || key === null ? "" : String(key).trim();
};

export const NEW_SHOPS_COMPARISON_START_DATE = "2026-02-01";
const newShopsComparisonStartDate = new Date(`${NEW_SHOPS_COMPARISON_START_DATE}T00:00:00`);

const isAfterNewShopsComparisonStart = (createdAt) =>
    createdAt >= newShopsComparisonStartDate;

export const filterShopsBySearchTerm = (shops, platform, searchTerm) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return shops;

    return shops.filter((shop) => {
        const { email, key } = getShopFields(shop, platform);
        return [email, key].some((value) =>
            String(value ?? "").toLowerCase().includes(normalizedSearch)
        );
    });
};

export const getNewShopsByFirstCreatedDate = (shops, platform, startDate, endDate) => {
    const startDateObj = new Date(startDate + "T00:00:00");
    const endDateObj = new Date(endDate + "T23:59:59.999");
    const firstShopByKey = new Map();

    shops.forEach((shop, index) => {
        const shopKey = normalizeShopKey(shop, platform);
        const createdAt = new Date(shop.createdAt);

        if (
            !shopKey ||
            Number.isNaN(createdAt.getTime()) ||
            !isAfterNewShopsComparisonStart(createdAt)
        ) {
            return;
        }

        const existing = firstShopByKey.get(shopKey);
        if (!existing || createdAt < existing.createdAt) {
            firstShopByKey.set(shopKey, { shop, createdAt, index });
        }
    });

    return Array.from(firstShopByKey.values())
        .filter(({ createdAt }) => createdAt >= startDateObj && createdAt <= endDateObj)
        .sort((a, b) => a.createdAt - b.createdAt || a.index - b.index)
        .map(({ shop }) => shop);
};

export const getNewAndRepeatedShopsByDateRange = (shops, platform, startDate, endDate) => {
    const startDateObj = new Date(startDate + "T00:00:00");
    const endDateObj = new Date(endDate + "T23:59:59.999");
    const validShopRecords = [];
    const firstShopByKey = new Map();

    shops.forEach((shop, index) => {
        const shopKey = normalizeShopKey(shop, platform);
        const createdAt = new Date(shop.createdAt);

        if (
            !shopKey ||
            Number.isNaN(createdAt.getTime()) ||
            !isAfterNewShopsComparisonStart(createdAt)
        ) {
            return;
        }

        const record = { shop, shopKey, createdAt, index };
        validShopRecords.push(record);

        const existing = firstShopByKey.get(shopKey);
        if (!existing || createdAt < existing.createdAt) {
            firstShopByKey.set(shopKey, record);
        }
    });

    const uniqueNewShops = Array.from(firstShopByKey.values())
        .filter(({ createdAt }) => createdAt >= startDateObj && createdAt <= endDateObj)
        .sort((a, b) => a.createdAt - b.createdAt || a.index - b.index)
        .map(({ shop }) => shop);

    const repeatedShops = validShopRecords
        .filter(({ createdAt }) => createdAt >= startDateObj && createdAt <= endDateObj)
        .filter((record) => firstShopByKey.get(record.shopKey)?.index !== record.index)
        .sort((a, b) => a.createdAt - b.createdAt || a.index - b.index)
        .map((record) => ({
            shop: record.shop,
            firstShop: firstShopByKey.get(record.shopKey)?.shop,
        }));

    return { uniqueNewShops, repeatedShops };
};

export const groupShopsByDate = (shops) => {
    const shopsByDate = {};

    shops.forEach((shop) => {
        const shopDate = new Date(shop.createdAt);
        const dateKey = shopDate.toLocaleDateString("en-CA"); // YYYY-MM-DD format
        if (!shopsByDate[dateKey]) shopsByDate[dateKey] = 0;
        shopsByDate[dateKey]++;
    });

    return shopsByDate;
};
