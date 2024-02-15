import client from "../client";

export default {
  Query: {
    seeProfile: async (_, { id }) => {
      const profile = await client.user.findUnique({ where: { id } });
      return profile;
    },
  },
};
