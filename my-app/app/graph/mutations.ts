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
`
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
export const CREATE_CATEGORY_MUTATIONS = gql`
mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    id
    name
    bigImage
    smallImage
  }
}
`;
