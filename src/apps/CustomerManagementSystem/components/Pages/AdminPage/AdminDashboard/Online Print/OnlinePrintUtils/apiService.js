
import axios from "axios";
import { API_ENDPOINTS } from "./constants";

export const fetchShopsByPlatform = async (platform) => {
    try {
        const response = await axios.get(API_ENDPOINTS[platform]);
        if (response.data.code === 200) {
            const shops = response.data.data || [];

            // Only fetch additional info for Shopee platform
            if (platform === 'shopee') {
                const shopsWithRegion = await Promise.all(
                    shops.map(async (shop) => {
                        try {
                            const shopInfoResponse = await axios.get(
                                `https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/shop/shop-info?shopId=${shop.ShopeeAPPKey}`
                            );

                            // If successful, add region to shop data
                            if (shopInfoResponse.data && shopInfoResponse.data.region) {
                                return {
                                    ...shop,
                                    ShopCountry: shopInfoResponse.data.region
                                };
                            }
                        } catch (error) {
                            console.error(`Error fetching shop info for shopId ${shop.ShopeeAPPKey}:`, error);
                            // If error, return shop as-is (keep same as before)
                        }

                        // Return original shop data if API call fails or no region found
                        return shop;
                    })
                );

                console.log(platform, shopsWithRegion);
                return shopsWithRegion;
            }

            // For non-Shopee platforms, return data as-is
            console.log(platform, shops);
            return shops;
        }
        return [];
    } catch (error) {
        console.error(`Error fetching ${platform} shops:`, error);
        throw error;
    }
};