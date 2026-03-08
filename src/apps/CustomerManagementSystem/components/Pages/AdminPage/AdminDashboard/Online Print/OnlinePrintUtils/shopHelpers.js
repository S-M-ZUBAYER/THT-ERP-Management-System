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
