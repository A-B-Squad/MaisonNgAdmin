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
export const CREATE_SIDE_ADVERTISEMENT_MUTATIONS = gql`
mutation CreateSideAdvertisement($input: [advertisementInput]) {
  createSideAdvertisement(input: $input)
}
`;
