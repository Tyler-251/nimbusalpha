/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateDateEvent = /* GraphQL */ `
  subscription OnCreateDateEvent(
    $filter: ModelSubscriptionDateEventFilterInput
  ) {
    onCreateDateEvent(filter: $filter) {
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
export const onUpdateDateEvent = /* GraphQL */ `
  subscription OnUpdateDateEvent(
    $filter: ModelSubscriptionDateEventFilterInput
  ) {
    onUpdateDateEvent(filter: $filter) {
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
export const onDeleteDateEvent = /* GraphQL */ `
  subscription OnDeleteDateEvent(
    $filter: ModelSubscriptionDateEventFilterInput
  ) {
    onDeleteDateEvent(filter: $filter) {
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
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onCreateTodo(filter: $filter) {
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
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onUpdateTodo(filter: $filter) {
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
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
    onDeleteTodo(filter: $filter) {
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
