export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type Invitation = {
   __typename?: 'Invitation',
  emails: Array<Scalars['String']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  sendInvitations: Invitation,
};


export type MutationSendInvitationsArgs = {
  emails: Array<Scalars['String']>
};

export type Query = {
   __typename?: 'Query',
  hello: Scalars['String'],
};
