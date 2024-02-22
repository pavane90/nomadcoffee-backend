import client from "../../client";

export default {
  Query: {
    seeProfile: async (_, { username }) => {
      const profile = await client.user.findUnique({
        where: { username },
        include: {
          following: true,
          followers: true,
        },
      });
      return profile;
    },
  },
};
