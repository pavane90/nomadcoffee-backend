import { gql } from "apollo-server";

export default gql`
  type createCoffeeShopResult {
    ok: Boolean!
    error: String
    shop: CoffeeShop
    photos: [CoffeeShopPhoto]
  }
  type Mutation {
    createCoffeeShop(
      name: String!
      latitude: String!
      longitude: String!
      categories: [String]!
      photos: [Upload]
    ): createCoffeeShopResult!
  }
`;
