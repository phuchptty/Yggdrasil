/* eslint-disable */
/**
 * WARNING: THIS FILE IS AUTO-GENERATED, DO NOT EDIT IT DIRECTLY!
 */

import type * as Types from './types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Playground_LanguagesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Playground_LanguagesQuery = { __typename?: 'Query', playground_languages: Array<{ __typename?: 'Playground_Language', _id: string, name: string, key: string, editorKey: string, createdAt: any, updatedAt: any }> };

export type Playground_GetWorkspaceBySlugQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
}>;


export type Playground_GetWorkspaceBySlugQuery = { __typename?: 'Query', playground_getWorkspaceBySlug: { __typename?: 'Playground_Workspace', _id: string, beaconHost: string, createdAt: any, description?: string | null, permission: Types.Playground_WorkspacePermission, slug?: string | null, title: string, updatedAt: any, workspaceLanguage: { __typename?: 'Playground_Language', _id: string, createdAt: any, editorKey: string, key: string, name: string, updatedAt: any }, owner: { __typename?: 'Profile_User', _id: string } } };

export type Playground_GetAllUserWorkspacesQueryVariables = Types.Exact<{
  option?: Types.InputMaybe<Types.Playground_ProfilePaginateInput>;
}>;


export type Playground_GetAllUserWorkspacesQuery = { __typename?: 'Query', playground_getAllUserWorkspaces: { __typename?: 'Playgrounds_UserWorkspaces', node?: Array<{ __typename?: 'Playground_Workspace', _id: string, beaconHost: string, createdAt: any, description?: string | null, permission: Types.Playground_WorkspacePermission, slug?: string | null, title: string, updatedAt: any, owner: { __typename?: 'Profile_User', _id: string }, workspaceLanguage: { __typename?: 'Playground_Language', _id: string, createdAt: any, editorKey: string, key: string, name: string, updatedAt: any } }> | null, pageInfo?: { __typename?: 'Playground_PaginateInfo', currentPage?: number | null, hasNextPage?: boolean | null, hasPrevPage?: boolean | null, totalCount: number, totalPage: number } | null } };

export type Playground_GetAllPublicWorkspacesQueryVariables = Types.Exact<{
  option?: Types.InputMaybe<Types.Playground_ProfilePaginateInput>;
}>;


export type Playground_GetAllPublicWorkspacesQuery = { __typename?: 'Query', playground_getAllPublicWorkspaces: { __typename?: 'Playgrounds_UserWorkspaces', node?: Array<{ __typename?: 'Playground_Workspace', _id: string, title: string, slug?: string | null, description?: string | null, permission: Types.Playground_WorkspacePermission, createdAt: any, updatedAt: any, workspaceLanguage: { __typename?: 'Playground_Language', _id: string, name: string, key: string, editorKey: string, createdAt: any, updatedAt: any }, owner: { __typename?: 'Profile_User', _id: string, firstName?: string | null, lastName?: string | null } }> | null, pageInfo?: { __typename?: 'Playground_PaginateInfo', totalCount: number, currentPage?: number | null, totalPage: number, hasPrevPage?: boolean | null, hasNextPage?: boolean | null } | null } };

export type Playground_CountPublicWorkspaceByLanguagesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Playground_CountPublicWorkspaceByLanguagesQuery = { __typename?: 'Query', playground_countPublicWorkspaceByLanguages: Array<{ __typename?: 'Playgrounds_CountWorkspaceByLanguages', languageId: string, count: number }> };

export type Playground_CreateWorkspaceMutationVariables = Types.Exact<{
  input: Types.Playground_WorkspaceInput;
}>;


export type Playground_CreateWorkspaceMutation = { __typename?: 'Mutation', playground_createWorkspace: { __typename?: 'Playground_Workspace', _id: string, beaconHost: string, createdAt: any, description?: string | null, permission: Types.Playground_WorkspacePermission, slug?: string | null, title: string, updatedAt: any, workspaceLanguage: { __typename?: 'Playground_Language', _id: string, createdAt: any, editorKey: string, key: string, name: string, updatedAt: any } } };

export type Playground_UpdateWorkspaceMutationVariables = Types.Exact<{
  playgroundUpdateWorkspaceId: Types.Scalars['String']['input'];
  input: Types.Playground_WorkspaceUpdateInput;
}>;


export type Playground_UpdateWorkspaceMutation = { __typename?: 'Mutation', playground_updateWorkspace: { __typename?: 'Playground_Workspace', _id: string, description?: string | null, permission: Types.Playground_WorkspacePermission, slug?: string | null, title: string, updatedAt: any, createdAt: any, owner: { __typename?: 'Profile_User', _id: string, firstName?: string | null, lastName?: string | null }, workspaceLanguage: { __typename?: 'Playground_Language', _id: string, name: string, key: string, editorKey: string, createdAt: any, updatedAt: any } } };

export type Playground_DeleteWorkspaceMutationVariables = Types.Exact<{
  playgroundDeleteWorkspaceId: Types.Scalars['String']['input'];
}>;


export type Playground_DeleteWorkspaceMutation = { __typename?: 'Mutation', playground_deleteWorkspace: { __typename?: 'Playground_Workspace', _id: string } };


export const Playground_LanguagesDocument = gql`
    query Playground_languages {
  playground_languages {
    _id
    name
    key
    editorKey
    createdAt
    updatedAt
  }
}
    `;

/**
 * __usePlayground_LanguagesQuery__
 *
 * To run a query within a React component, call `usePlayground_LanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayground_LanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayground_LanguagesQuery({
 *   variables: {
 *   },
 * });
 */
export function usePlayground_LanguagesQuery(baseOptions?: Apollo.QueryHookOptions<Playground_LanguagesQuery, Playground_LanguagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Playground_LanguagesQuery, Playground_LanguagesQueryVariables>(Playground_LanguagesDocument, options);
      }
export function usePlayground_LanguagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Playground_LanguagesQuery, Playground_LanguagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Playground_LanguagesQuery, Playground_LanguagesQueryVariables>(Playground_LanguagesDocument, options);
        }
export type Playground_LanguagesQueryHookResult = ReturnType<typeof usePlayground_LanguagesQuery>;
export type Playground_LanguagesLazyQueryHookResult = ReturnType<typeof usePlayground_LanguagesLazyQuery>;
export type Playground_LanguagesQueryResult = Apollo.QueryResult<Playground_LanguagesQuery, Playground_LanguagesQueryVariables>;
export const Playground_GetWorkspaceBySlugDocument = gql`
    query Playground_getWorkspaceBySlug($slug: String!) {
  playground_getWorkspaceBySlug(slug: $slug) {
    _id
    beaconHost
    createdAt
    description
    permission
    slug
    title
    updatedAt
    workspaceLanguage {
      _id
      createdAt
      editorKey
      key
      name
      updatedAt
    }
    owner {
      _id
    }
  }
}
    `;

/**
 * __usePlayground_GetWorkspaceBySlugQuery__
 *
 * To run a query within a React component, call `usePlayground_GetWorkspaceBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayground_GetWorkspaceBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayground_GetWorkspaceBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function usePlayground_GetWorkspaceBySlugQuery(baseOptions: Apollo.QueryHookOptions<Playground_GetWorkspaceBySlugQuery, Playground_GetWorkspaceBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Playground_GetWorkspaceBySlugQuery, Playground_GetWorkspaceBySlugQueryVariables>(Playground_GetWorkspaceBySlugDocument, options);
      }
export function usePlayground_GetWorkspaceBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Playground_GetWorkspaceBySlugQuery, Playground_GetWorkspaceBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Playground_GetWorkspaceBySlugQuery, Playground_GetWorkspaceBySlugQueryVariables>(Playground_GetWorkspaceBySlugDocument, options);
        }
export type Playground_GetWorkspaceBySlugQueryHookResult = ReturnType<typeof usePlayground_GetWorkspaceBySlugQuery>;
export type Playground_GetWorkspaceBySlugLazyQueryHookResult = ReturnType<typeof usePlayground_GetWorkspaceBySlugLazyQuery>;
export type Playground_GetWorkspaceBySlugQueryResult = Apollo.QueryResult<Playground_GetWorkspaceBySlugQuery, Playground_GetWorkspaceBySlugQueryVariables>;
export const Playground_GetAllUserWorkspacesDocument = gql`
    query Playground_getAllUserWorkspaces($option: Playground_ProfilePaginateInput) {
  playground_getAllUserWorkspaces(option: $option) {
    node {
      _id
      beaconHost
      createdAt
      description
      owner {
        _id
      }
      permission
      slug
      title
      updatedAt
      workspaceLanguage {
        _id
        createdAt
        editorKey
        key
        name
        updatedAt
      }
    }
    pageInfo {
      currentPage
      hasNextPage
      hasPrevPage
      totalCount
      totalPage
    }
  }
}
    `;

/**
 * __usePlayground_GetAllUserWorkspacesQuery__
 *
 * To run a query within a React component, call `usePlayground_GetAllUserWorkspacesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayground_GetAllUserWorkspacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayground_GetAllUserWorkspacesQuery({
 *   variables: {
 *      option: // value for 'option'
 *   },
 * });
 */
export function usePlayground_GetAllUserWorkspacesQuery(baseOptions?: Apollo.QueryHookOptions<Playground_GetAllUserWorkspacesQuery, Playground_GetAllUserWorkspacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Playground_GetAllUserWorkspacesQuery, Playground_GetAllUserWorkspacesQueryVariables>(Playground_GetAllUserWorkspacesDocument, options);
      }
export function usePlayground_GetAllUserWorkspacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Playground_GetAllUserWorkspacesQuery, Playground_GetAllUserWorkspacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Playground_GetAllUserWorkspacesQuery, Playground_GetAllUserWorkspacesQueryVariables>(Playground_GetAllUserWorkspacesDocument, options);
        }
export type Playground_GetAllUserWorkspacesQueryHookResult = ReturnType<typeof usePlayground_GetAllUserWorkspacesQuery>;
export type Playground_GetAllUserWorkspacesLazyQueryHookResult = ReturnType<typeof usePlayground_GetAllUserWorkspacesLazyQuery>;
export type Playground_GetAllUserWorkspacesQueryResult = Apollo.QueryResult<Playground_GetAllUserWorkspacesQuery, Playground_GetAllUserWorkspacesQueryVariables>;
export const Playground_GetAllPublicWorkspacesDocument = gql`
    query Playground_getAllPublicWorkspaces($option: Playground_ProfilePaginateInput) {
  playground_getAllPublicWorkspaces(option: $option) {
    node {
      _id
      title
      slug
      description
      permission
      createdAt
      updatedAt
      workspaceLanguage {
        _id
        name
        key
        editorKey
        createdAt
        updatedAt
      }
      owner {
        _id
        firstName
        lastName
      }
    }
    pageInfo {
      totalCount
      currentPage
      totalPage
      hasPrevPage
      hasNextPage
    }
  }
}
    `;

/**
 * __usePlayground_GetAllPublicWorkspacesQuery__
 *
 * To run a query within a React component, call `usePlayground_GetAllPublicWorkspacesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayground_GetAllPublicWorkspacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayground_GetAllPublicWorkspacesQuery({
 *   variables: {
 *      option: // value for 'option'
 *   },
 * });
 */
export function usePlayground_GetAllPublicWorkspacesQuery(baseOptions?: Apollo.QueryHookOptions<Playground_GetAllPublicWorkspacesQuery, Playground_GetAllPublicWorkspacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Playground_GetAllPublicWorkspacesQuery, Playground_GetAllPublicWorkspacesQueryVariables>(Playground_GetAllPublicWorkspacesDocument, options);
      }
export function usePlayground_GetAllPublicWorkspacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Playground_GetAllPublicWorkspacesQuery, Playground_GetAllPublicWorkspacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Playground_GetAllPublicWorkspacesQuery, Playground_GetAllPublicWorkspacesQueryVariables>(Playground_GetAllPublicWorkspacesDocument, options);
        }
export type Playground_GetAllPublicWorkspacesQueryHookResult = ReturnType<typeof usePlayground_GetAllPublicWorkspacesQuery>;
export type Playground_GetAllPublicWorkspacesLazyQueryHookResult = ReturnType<typeof usePlayground_GetAllPublicWorkspacesLazyQuery>;
export type Playground_GetAllPublicWorkspacesQueryResult = Apollo.QueryResult<Playground_GetAllPublicWorkspacesQuery, Playground_GetAllPublicWorkspacesQueryVariables>;
export const Playground_CountPublicWorkspaceByLanguagesDocument = gql`
    query playground_countPublicWorkspaceByLanguages {
  playground_countPublicWorkspaceByLanguages {
    languageId
    count
  }
}
    `;

/**
 * __usePlayground_CountPublicWorkspaceByLanguagesQuery__
 *
 * To run a query within a React component, call `usePlayground_CountPublicWorkspaceByLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayground_CountPublicWorkspaceByLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayground_CountPublicWorkspaceByLanguagesQuery({
 *   variables: {
 *   },
 * });
 */
export function usePlayground_CountPublicWorkspaceByLanguagesQuery(baseOptions?: Apollo.QueryHookOptions<Playground_CountPublicWorkspaceByLanguagesQuery, Playground_CountPublicWorkspaceByLanguagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Playground_CountPublicWorkspaceByLanguagesQuery, Playground_CountPublicWorkspaceByLanguagesQueryVariables>(Playground_CountPublicWorkspaceByLanguagesDocument, options);
      }
export function usePlayground_CountPublicWorkspaceByLanguagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Playground_CountPublicWorkspaceByLanguagesQuery, Playground_CountPublicWorkspaceByLanguagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Playground_CountPublicWorkspaceByLanguagesQuery, Playground_CountPublicWorkspaceByLanguagesQueryVariables>(Playground_CountPublicWorkspaceByLanguagesDocument, options);
        }
export type Playground_CountPublicWorkspaceByLanguagesQueryHookResult = ReturnType<typeof usePlayground_CountPublicWorkspaceByLanguagesQuery>;
export type Playground_CountPublicWorkspaceByLanguagesLazyQueryHookResult = ReturnType<typeof usePlayground_CountPublicWorkspaceByLanguagesLazyQuery>;
export type Playground_CountPublicWorkspaceByLanguagesQueryResult = Apollo.QueryResult<Playground_CountPublicWorkspaceByLanguagesQuery, Playground_CountPublicWorkspaceByLanguagesQueryVariables>;
export const Playground_CreateWorkspaceDocument = gql`
    mutation Playground_createWorkspace($input: Playground_WorkspaceInput!) {
  playground_createWorkspace(input: $input) {
    _id
    beaconHost
    createdAt
    description
    permission
    slug
    title
    updatedAt
    workspaceLanguage {
      _id
      createdAt
      editorKey
      key
      name
      updatedAt
    }
  }
}
    `;
export type Playground_CreateWorkspaceMutationFn = Apollo.MutationFunction<Playground_CreateWorkspaceMutation, Playground_CreateWorkspaceMutationVariables>;

/**
 * __usePlayground_CreateWorkspaceMutation__
 *
 * To run a mutation, you first call `usePlayground_CreateWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayground_CreateWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playgroundCreateWorkspaceMutation, { data, loading, error }] = usePlayground_CreateWorkspaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePlayground_CreateWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<Playground_CreateWorkspaceMutation, Playground_CreateWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Playground_CreateWorkspaceMutation, Playground_CreateWorkspaceMutationVariables>(Playground_CreateWorkspaceDocument, options);
      }
export type Playground_CreateWorkspaceMutationHookResult = ReturnType<typeof usePlayground_CreateWorkspaceMutation>;
export type Playground_CreateWorkspaceMutationResult = Apollo.MutationResult<Playground_CreateWorkspaceMutation>;
export type Playground_CreateWorkspaceMutationOptions = Apollo.BaseMutationOptions<Playground_CreateWorkspaceMutation, Playground_CreateWorkspaceMutationVariables>;
export const Playground_UpdateWorkspaceDocument = gql`
    mutation Playground_updateWorkspace($playgroundUpdateWorkspaceId: String!, $input: Playground_WorkspaceUpdateInput!) {
  playground_updateWorkspace(id: $playgroundUpdateWorkspaceId, input: $input) {
    _id
    description
    permission
    slug
    title
    updatedAt
    owner {
      _id
      firstName
      lastName
    }
    workspaceLanguage {
      _id
      name
      key
      editorKey
      createdAt
      updatedAt
    }
    createdAt
  }
}
    `;
export type Playground_UpdateWorkspaceMutationFn = Apollo.MutationFunction<Playground_UpdateWorkspaceMutation, Playground_UpdateWorkspaceMutationVariables>;

/**
 * __usePlayground_UpdateWorkspaceMutation__
 *
 * To run a mutation, you first call `usePlayground_UpdateWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayground_UpdateWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playgroundUpdateWorkspaceMutation, { data, loading, error }] = usePlayground_UpdateWorkspaceMutation({
 *   variables: {
 *      playgroundUpdateWorkspaceId: // value for 'playgroundUpdateWorkspaceId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePlayground_UpdateWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<Playground_UpdateWorkspaceMutation, Playground_UpdateWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Playground_UpdateWorkspaceMutation, Playground_UpdateWorkspaceMutationVariables>(Playground_UpdateWorkspaceDocument, options);
      }
export type Playground_UpdateWorkspaceMutationHookResult = ReturnType<typeof usePlayground_UpdateWorkspaceMutation>;
export type Playground_UpdateWorkspaceMutationResult = Apollo.MutationResult<Playground_UpdateWorkspaceMutation>;
export type Playground_UpdateWorkspaceMutationOptions = Apollo.BaseMutationOptions<Playground_UpdateWorkspaceMutation, Playground_UpdateWorkspaceMutationVariables>;
export const Playground_DeleteWorkspaceDocument = gql`
    mutation Playground_deleteWorkspace($playgroundDeleteWorkspaceId: String!) {
  playground_deleteWorkspace(id: $playgroundDeleteWorkspaceId) {
    _id
  }
}
    `;
export type Playground_DeleteWorkspaceMutationFn = Apollo.MutationFunction<Playground_DeleteWorkspaceMutation, Playground_DeleteWorkspaceMutationVariables>;

/**
 * __usePlayground_DeleteWorkspaceMutation__
 *
 * To run a mutation, you first call `usePlayground_DeleteWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayground_DeleteWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playgroundDeleteWorkspaceMutation, { data, loading, error }] = usePlayground_DeleteWorkspaceMutation({
 *   variables: {
 *      playgroundDeleteWorkspaceId: // value for 'playgroundDeleteWorkspaceId'
 *   },
 * });
 */
export function usePlayground_DeleteWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<Playground_DeleteWorkspaceMutation, Playground_DeleteWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Playground_DeleteWorkspaceMutation, Playground_DeleteWorkspaceMutationVariables>(Playground_DeleteWorkspaceDocument, options);
      }
export type Playground_DeleteWorkspaceMutationHookResult = ReturnType<typeof usePlayground_DeleteWorkspaceMutation>;
export type Playground_DeleteWorkspaceMutationResult = Apollo.MutationResult<Playground_DeleteWorkspaceMutation>;
export type Playground_DeleteWorkspaceMutationOptions = Apollo.BaseMutationOptions<Playground_DeleteWorkspaceMutation, Playground_DeleteWorkspaceMutationVariables>;