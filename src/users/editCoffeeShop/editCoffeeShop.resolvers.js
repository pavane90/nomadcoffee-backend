import { protectedResolver } from "../users.utils";
import { createWriteStream } from "fs";
import { processCategories, getOrCreate } from "../coffeeShop/coffeeShop.utils";
import client from "../../client";

export default {
  Mutation: {
    editCoffeeShop: protectedResolver(
      async (
        _,
        { id, name, latitude, longitude, categories, photos },
        { loggedInUser }
      ) => {
        const coffeeShop = await client.coffeeShop.findFirst({
          where: { id, userId: loggedInUser.id },
          include: { categories: { select: { slug: true } } },
        });
        if (!coffeeShop) {
          return {
            ok: false,
            error: "CoffeeShop is not found",
          };
        }

        let editedCoffeeShopSlug = undefined;
        if (name) {
          const editedCoffeeShopName = name.trim().toLowerCase();
          editedCoffeeShopSlug = editedCoffeeShopName.replace(/ +/g, "-");
        }

        let categoryObj = [];
        if (categories) {
          categoryObj = await Promise.all(await getOrCreate(categories));
        }

        const editedCoffeeShop = await client.coffeeShop.update({
          where: { id },
          data: {
            name,
            latitude,
            longitude,
            slug: editedCoffeeShopSlug,
            categories: {
              disconnect: coffeeShop.categories,
              connectOrCreate: processCategories(categoryObj),
            },
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
                    id: editedCoffeeShop.id,
                  },
                },
              },
            });
            coffeeShopPhotos.push(coffeeShopPhoto);
          }
        }
        return {
          ok: true,
          shop: editedCoffeeShop,
          photos: coffeeShopPhotos,
        };
      }
    ),
  },
};
