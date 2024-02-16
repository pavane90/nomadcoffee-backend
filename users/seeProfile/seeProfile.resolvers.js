import client from "../../client";

export default {
  Query: {
    seeProfile: async (_, { username }) => {
      const profile = await client.user.findUnique({ where: { username } });
      return profile;
    },
  },
};
