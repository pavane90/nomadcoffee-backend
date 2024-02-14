import bcrypt from "bcrypt";
import client from "../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { username, email, name, location, password, avatarURL, githubUsername }
    ) => {
      const existingUser = await client.user.findFirst({
        where: {
          OR: [
            {
              username,
            },
            {
              email,
            },
          ],
        },
      });
      if (existingUser != null) {
        return {
          ok: false,
          error: "This username/email is already taken.",
        };
      } else {
        const uglyPassword = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            username,
            email,
            name,
            location,
            password: uglyPassword,
            avatarURL,
            githubUsername,
          },
        });
        return {
          ok: true,
        };
      }
    },
  },
};
