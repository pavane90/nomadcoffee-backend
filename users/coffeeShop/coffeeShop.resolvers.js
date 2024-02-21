import client from "../../client";

export default {
  CoffeeShop: {
    photos: async ({ id }, _) =>
      await client.coffeeShopPhoto.findMany({
        where: {
          shop: {
            id,
          },
        },
      }),
    user: async ({ id }, _) =>
      await client.user.findFirst({
        where: {
          shops: {
            some: {
              id,
            },
          },
        },
      }),
    categories: async ({ id }, _) =>
      await client.category.findMany({
        where: {
          shops: {
            some: {
              id,
            },
          },
        },
      }),
  },
  Category: {
    totalShops: async ({ id }, _) =>
      await client.coffeeShop.count({
        where: {
          categories: {
            some: {
              id,
            },
          },
        },
      }),
  },
};
