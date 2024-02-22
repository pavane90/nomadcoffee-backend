//이부분 분석 필요, 우선은 helious23님 커밋 참고
import client from "../../client";

export const getOrCreate = async (categories) => {
  return categories.map(async (category) => {
    const trimCategory = category.trim().toLowerCase();
    const categorySlug = trimCategory.replace(/ +/g, "-");
    let existCategory = await client.category.findUnique({
      where: {
        slug: categorySlug,
      },
    });
    if (!existCategory) {
      existCategory = await client.category.create({
        data: {
          name: category,
          slug: categorySlug,
        },
      });
    }
    return existCategory;
  });
};

export const processCategories = (categories) => {
  return categories.map((category) => ({
    where: { slug: category.slug },
    create: { slug: category.slug, name: category.name },
  }));
};
