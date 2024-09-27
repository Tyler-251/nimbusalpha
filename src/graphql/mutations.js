/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDateAndTimeEvent = /* GraphQL */ `
  mutation CreateDateAndTimeEvent(
    $input: CreateDateAndTimeEventInput!
    $condition: ModelDateAndTimeEventConditionInput
  ) {
    createDateAndTimeEvent(input: $input, condition: $condition) {
      id
      startDate
      endDate
      startTime
      endTime
      name
      desc
      username
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateDateAndTimeEvent = /* GraphQL */ `
  mutation UpdateDateAndTimeEvent(
    $input: UpdateDateAndTimeEventInput!
    $condition: ModelDateAndTimeEventConditionInput
  ) {
    updateDateAndTimeEvent(input: $input, condition: $condition) {
      id
      startDate
      endDate
      startTime
      endTime
      name
      desc
      username
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteDateAndTimeEvent = /* GraphQL */ `
  mutation DeleteDateAndTimeEvent(
    $input: DeleteDateAndTimeEventInput!
    $condition: ModelDateAndTimeEventConditionInput
  ) {
    deleteDateAndTimeEvent(input: $input, condition: $condition) {
      id
      startDate
      endDate
      startTime
      endTime
      name
      desc
      username
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createDateEvent = /* GraphQL */ `
  mutation CreateDateEvent(
    $input: CreateDateEventInput!
    $condition: ModelDateEventConditionInput
  ) {
    createDateEvent(input: $input, condition: $condition) {
      id
      startDate
      endDate
      name
      desc
      username
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateDateEvent = /* GraphQL */ `
  mutation UpdateDateEvent(
    $input: UpdateDateEventInput!
    $condition: ModelDateEventConditionInput
  ) {
    updateDateEvent(input: $input, condition: $condition) {
      id
      startDate
      endDate
      name
      desc
      username
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteDateEvent = /* GraphQL */ `
  mutation DeleteDateEvent(
    $input: DeleteDateEventInput!
    $condition: ModelDateEventConditionInput
  ) {
    deleteDateEvent(input: $input, condition: $condition) {
      id
      startDate
      endDate
      name
      desc
      username
      createdAt
      updatedAt
      __typename
    }
  }
`;
