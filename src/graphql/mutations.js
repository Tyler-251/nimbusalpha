/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDateEvent = /* GraphQL */ `
  mutation CreateDateEvent(
    $input: CreateDateEventInput!
    $condition: ModelDateEventConditionInput
  ) {
    createDateEvent(input: $input, condition: $condition) {
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
export const updateDateEvent = /* GraphQL */ `
  mutation UpdateDateEvent(
    $input: UpdateDateEventInput!
    $condition: ModelDateEventConditionInput
  ) {
    updateDateEvent(input: $input, condition: $condition) {
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
export const deleteDateEvent = /* GraphQL */ `
  mutation DeleteDateEvent(
    $input: DeleteDateEventInput!
    $condition: ModelDateEventConditionInput
  ) {
    deleteDateEvent(input: $input, condition: $condition) {
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
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
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
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
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
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
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
