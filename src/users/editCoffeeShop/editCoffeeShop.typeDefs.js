import { gql } from "apollo-server";

export default gql`
  type EditCoffeeShopResult {
    ok: Boolean!
    error: String
    shop: CoffeeShop
    photos: [CoffeeShopPhoto]
  }
  type Mutation {
    editCoffeeShop(
      id: Int!
      name: String
      latitude: String
      longitude: String
      categories: [String]
      photos: [Upload]
    ): EditCoffeeShopResult!
  }
`;
