/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDateEvent = /* GraphQL */ `
  query GetDateEvent($id: ID!) {
    getDateEvent(id: $id) {
      id
      startDateTime
      endDateTime
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
        startDateTime
        endDateTime
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
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      priority
      name
      desc
      username
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        priority
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
