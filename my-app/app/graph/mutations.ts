import { gql } from "@apollo/client";

export const CREATE_CAROUSEL_ADVERTISEMENT_MUTATIONS = gql`
  mutation CreateAdvertisement($input: [advertisementInput]) {
    createAdvertisement(input: $input)
  }
`;
export const CREATE_BANNER_ADVERTISEMENT_MUTATIONS = gql`
  mutation CreateBannerAdvertisement($input: [advertisementInput]) {
    createBannerAdvertisement(input: $input)
  }
`;
export const CREATE_NEXT_TO_CAROUSEL_ADVERTISEMENT_MUTATIONS = gql`
  mutation CreateLeftNextToCarouselAds($input: [advertisementInput]) {
    createLeftNextToCarouselAds(input: $input)
  }
`;
export const CREATE_BIG_ADVERTISEMENT_MUTATIONS = gql`
  mutation CreateBigAds($input: advertisementInput) {
    createBigAds(input: $input)
  }
`;
export const CREATE_SIDE_ADVERTISEMENT_MUTATIONS = gql`
  mutation CreateSideAdvertisement($input: [advertisementInput]) {
    createSideAdvertisement(input: $input)
  }
`;
export const CREATE_COMPANY_INFO_MUTATIONS = gql`
  mutation CreateOrUpdateCompanyInfo($input: CompanyInfoInput!) {
    createOrUpdateCompanyInfo(input: $input) {
      phone
      deliveringPrice
      logo
      instagram
      facebook
      location
      email
    }
  }
`;
export const DELETE_PRODUCT_MUTATIONS = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId)
  }
`;
export const DELETE_COUPONS_MUTATIONS = gql`
mutation DeleteCoupons($couponsId: ID!) {
  deleteCoupons(couponsId: $couponsId)
}
`;
export const CREATE_COUPONS_MUTATIONS = gql`
mutation CreateCoupons($input: CreateCouponInput!) {
  createCoupons(input: $input)
}
`;
export const CREATE_PRODUCT_MUTATIONS = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input)
  }
`;
export const UPDATE_PRODUCT_MUTATIONS = gql`
  mutation UpdateProduct($productId: ID!, $input: ProductInput!) {
    updateProduct(productId: $productId, input: $input)
  }
`;
export const UPDATE_PRODUCT_INVENTORY_MUTATION = gql`
mutation AddProductInventory($productId: ID!, $inventory: Int!) {
  addProductInventory(productId: $productId, inventory: $inventory)
}
`;

export const CREATE_CATEGORY_MUTATIONS = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input)
  }
`;
export const UPDATE_CATEGORY_MUTATIONS = gql`
mutation UpdateCategory($updateCategoryId: ID!, $input: UpdateCategoryInput!) {
  updateCategory(id: $updateCategoryId, input: $input)
}
`;
export const DELETE_CATEGORIES_MUTATIONS = gql`
  mutation DeleteCategory($deleteCategoryId: ID!) {
    deleteCategory(id: $deleteCategoryId)
  }
`;

