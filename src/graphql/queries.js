/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDateAndTimeEvent = /* GraphQL */ `
  query GetDateAndTimeEvent($id: ID!) {
    getDateAndTimeEvent(id: $id) {
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
export const listDateAndTimeEvents = /* GraphQL */ `
  query ListDateAndTimeEvents(
    $filter: ModelDateAndTimeEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDateAndTimeEvents(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getDateEvent = /* GraphQL */ `
  query GetDateEvent($id: ID!) {
    getDateEvent(id: $id) {
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
export const listDateEvents = /* GraphQL */ `
  query ListDateEvents(
    $filter: ModelDateEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDateEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
