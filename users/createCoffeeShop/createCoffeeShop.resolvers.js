import { protectedResolver } from "../users.utils";
import { createWriteStream } from "fs";
import { processCategories, getOrCreate } from "../coffeeShop/coffeeShop.utils";
import client from "../../client";
export default {
  Mutation: {
    createCoffeeShop: protectedResolver(
      async (
        _,
        { name, latitude, longitude, categories, photos },
        { loggedInUser }
      ) => {
        const newCoffeeShopName = name.trim().toLowerCase();
        const newCoffeeShopSlug = newCoffeeShopName.replace(/ +/g, "-");
        const exist = await client.coffeeShop.findUnique({
          where: {
            slug: newCoffeeShopSlug,
          },
          select: { id: true },
        });
        if (exist) {
          return {
            ok: false,
            error: "coffeeshop already exists.",
          };
        }

        let categoryObj = [];
        if (categories) {
          categoryObj = await Promise.all(await getOrCreate(categories));
        }

        const newCoffeeShop = await client.coffeeShop.create({
          data: {
            name,
            latitude,
            longitude,
            slug: newCoffeeShopSlug,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(categoryObj.length > 0 && {
              categories: { connectOrCreate: processCategories(categoryObj) },
            }),
          },
        });

        let coffeeShopPhotos = [];
        let photoURL = null;
        if (photos) {
          //Azure나 AWS업로드는 추후 대응 일단은 editProfile식으로 uploads에 보존
          for (let i = 0; i < photos.length; i++) {
            const { filename, createReadStream } = await photos[i];
            const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
            const readStream = createReadStream();
            const writeStream = createWriteStream(
              process.cwd() + "/uploads/" + newFilename
            );
            readStream.pipe(writeStream);
            photoURL = `http://localhost:4000/static/${newFilename}`;
            const coffeeShopPhoto = await client.coffeeShopPhoto.create({
              data: {
                url: photoURL,
                shop: {
                  connect: {
                    id: newCoffeeShop.id,
                  },
                },
              },
            });
            coffeeShopPhotos.push(coffeeShopPhoto);
          }
        }
        return {
          ok: true,
          shop: newCoffeeShop,
          photos: coffeeShopPhotos,
        };
      }
    ),
  },
};
