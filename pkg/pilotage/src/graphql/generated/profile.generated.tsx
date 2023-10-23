/* eslint-disable */
/**
 * WARNING: THIS FILE IS AUTO-GENERATED, DO NOT EDIT IT DIRECTLY!
 */

import type * as Types from './types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Profile_MeQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Profile_MeQuery = { __typename?: 'Query', Profile_me: { __typename?: 'Profile_User', _id: string, email: string, firstName?: string | null, lastName?: string | null, roles?: Array<Types.RoleEnum> | null, username: string } };


export const Profile_MeDocument = gql`
    query Profile_me {
  Profile_me {
    _id
    email
    firstName
    lastName
    roles
    username
  }
}
    `;

/**
 * __useProfile_MeQuery__
 *
 * To run a query within a React component, call `useProfile_MeQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfile_MeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfile_MeQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfile_MeQuery(baseOptions?: Apollo.QueryHookOptions<Profile_MeQuery, Profile_MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Profile_MeQuery, Profile_MeQueryVariables>(Profile_MeDocument, options);
      }
export function useProfile_MeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Profile_MeQuery, Profile_MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Profile_MeQuery, Profile_MeQueryVariables>(Profile_MeDocument, options);
        }
export type Profile_MeQueryHookResult = ReturnType<typeof useProfile_MeQuery>;
export type Profile_MeLazyQueryHookResult = ReturnType<typeof useProfile_MeLazyQuery>;
export type Profile_MeQueryResult = Apollo.QueryResult<Profile_MeQuery, Profile_MeQueryVariables>;