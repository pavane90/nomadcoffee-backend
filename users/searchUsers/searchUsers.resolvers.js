export default {
  Query: {
    searchUsers: async (_, { keyword, page }, { client }) => {
      const users = await client.user.findMany({
        where: {
          username: {
            startsWith: keyword,
          },
        },
        take: 5,
        skip: (page - 1) * 5,
      });
      const totalResults = await client.user.count({
        where: { username: { startsWith: keyword } },
      });
      return {
        users,
        totalPages: Math.ceil(totalResults / 5),
      };
    },
  },
};
