export default {
  Query: {
    seeCategory: (_, { categoryName, page }, { client }) =>
      client.coffeeShop.findMany({
        where: {
          categories: {
            some: {
              name: {
                contains: categoryName,
              },
            },
          },
        },
        take: 5,
        skip: (page - 1) * 5,
      }),
  },
};
