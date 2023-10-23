/* eslint-disable */
/**
 * WARNING: THIS FILE IS AUTO-GENERATED, DO NOT EDIT IT DIRECTLY!
 */

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Mutation = {
  __typename?: 'Mutation';
  Playground_requestReCreateVM: Playground_RequestForVmResponse;
  Playground_requestVmForWorkspace: Playground_RequestForVmResponse;
  playground_createLanguage: Playground_Language;
  playground_createWorkspace: Playground_Workspace;
  playground_deleteLanguage: Scalars['Boolean']['output'];
  playground_deleteWorkspace: Playground_Workspace;
  playground_updateLanguage: Playground_Language;
  playground_updateWorkspace: Playground_Workspace;
};


export type MutationPlayground_RequestReCreateVmArgs = {
  workspaceSlug: Scalars['String']['input'];
};


export type MutationPlayground_RequestVmForWorkspaceArgs = {
  workspaceSlug: Scalars['String']['input'];
};


export type MutationPlayground_CreateLanguageArgs = {
  input: Playground_CreateLanguageInput;
};


export type MutationPlayground_CreateWorkspaceArgs = {
  input: Playground_WorkspaceInput;
};


export type MutationPlayground_DeleteLanguageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPlayground_DeleteWorkspaceArgs = {
  id: Scalars['String']['input'];
};


export type MutationPlayground_UpdateLanguageArgs = {
  id: Scalars['ID']['input'];
  input: Playground_UpdateLanguageInput;
};


export type MutationPlayground_UpdateWorkspaceArgs = {
  id: Scalars['String']['input'];
  input: Playground_WorkspaceUpdateInput;
};

export type Playground_CreateLanguageInput = {
  editorKey: Scalars['String']['input'];
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type Playground_Language = {
  __typename?: 'Playground_Language';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  editorKey: Scalars['String']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Playground_OptionInput = {
  id?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Playground_PaginateInfo = {
  __typename?: 'Playground_PaginateInfo';
  currentPage?: Maybe<Scalars['Float']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  hasPrevPage?: Maybe<Scalars['Boolean']['output']>;
  totalCount: Scalars['Float']['output'];
  totalPage: Scalars['Float']['output'];
};

export type Playground_ProfilePaginateInput = {
  fields?: InputMaybe<Playground_OptionInput>;
  filter?: InputMaybe<Scalars['JSON']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  perPage?: InputMaybe<Scalars['Float']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['JSON']['input']>;
};

export type Playground_RequestForVmBaseResponse = {
  __typename?: 'Playground_RequestForVmBaseResponse';
  beaconHost: Scalars['String']['output'];
  execHost: Scalars['String']['output'];
  ownerId: Scalars['String']['output'];
  podName: Scalars['String']['output'];
  workspaceId: Scalars['String']['output'];
};

export type Playground_RequestForVmResponse = {
  __typename?: 'Playground_RequestForVmResponse';
  message?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Playground_RequestForVmBaseResponse>;
};

export type Playground_UpdateLanguageInput = {
  editorKey?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Playground_Workspace = {
  __typename?: 'Playground_Workspace';
  _id: Scalars['ID']['output'];
  beaconHost: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  owner: Profile_User;
  permission: Playground_WorkspacePermission;
  slug?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  workspaceLanguage: Playground_Language;
};

export type Playground_WorkspaceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  permission?: InputMaybe<Playground_WorkspacePermission>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  workspaceLanguage: Scalars['ID']['input'];
};

export enum Playground_WorkspacePermission {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Playground_WorkspaceUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  permission?: InputMaybe<Playground_WorkspacePermission>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  workspaceLanguage?: InputMaybe<Scalars['ID']['input']>;
};

export type Playgrounds_CountWorkspaceByLanguages = {
  __typename?: 'Playgrounds_CountWorkspaceByLanguages';
  count: Scalars['Float']['output'];
  languageId: Scalars['String']['output'];
};

export type Playgrounds_UserWorkspaces = {
  __typename?: 'Playgrounds_UserWorkspaces';
  node?: Maybe<Array<Playground_Workspace>>;
  pageInfo?: Maybe<Playground_PaginateInfo>;
};

/** The user model */
export type Profile_User = {
  __typename?: 'Profile_User';
  _id: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<RoleEnum>>;
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  Profile_me: Profile_User;
  playground_countPublicWorkspaceByLanguages: Array<Playgrounds_CountWorkspaceByLanguages>;
  playground_getAllPublicWorkspaces: Playgrounds_UserWorkspaces;
  playground_getAllUserWorkspaces: Playgrounds_UserWorkspaces;
  playground_getWorkspaceBySlug: Playground_Workspace;
  playground_language: Playground_Language;
  playground_languages: Array<Playground_Language>;
};


export type QueryPlayground_GetAllPublicWorkspacesArgs = {
  option?: InputMaybe<Playground_ProfilePaginateInput>;
};


export type QueryPlayground_GetAllUserWorkspacesArgs = {
  option?: InputMaybe<Playground_ProfilePaginateInput>;
};


export type QueryPlayground_GetWorkspaceBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryPlayground_LanguageArgs = {
  id: Scalars['ID']['input'];
};

export enum RoleEnum {
  Admin = 'ADMIN',
  Member = 'MEMBER'
}
