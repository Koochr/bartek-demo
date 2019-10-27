import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
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

export type SendInvitationsMutationVariables = {
  emails: Array<Scalars['String']>
};


export type SendInvitationsMutation = (
  { __typename?: 'Mutation' }
  & { sendInvitations: (
    { __typename?: 'Invitation' }
    & Pick<Invitation, 'emails'>
  ) }
);


export const SendInvitationsDocument = gql`
    mutation sendInvitations($emails: [String!]!) {
  sendInvitations(emails: $emails) {
    emails
  }
}
    `;
export type SendInvitationsMutationFn = ApolloReactCommon.MutationFunction<SendInvitationsMutation, SendInvitationsMutationVariables>;

/**
 * __useSendInvitationsMutation__
 *
 * To run a mutation, you first call `useSendInvitationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendInvitationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendInvitationsMutation, { data, loading, error }] = useSendInvitationsMutation({
 *   variables: {
 *      emails: // value for 'emails'
 *   },
 * });
 */
export function useSendInvitationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendInvitationsMutation, SendInvitationsMutationVariables>) {
        return ApolloReactHooks.useMutation<SendInvitationsMutation, SendInvitationsMutationVariables>(SendInvitationsDocument, baseOptions);
      }
export type SendInvitationsMutationHookResult = ReturnType<typeof useSendInvitationsMutation>;
export type SendInvitationsMutationResult = ApolloReactCommon.MutationResult<SendInvitationsMutation>;
export type SendInvitationsMutationOptions = ApolloReactCommon.BaseMutationOptions<SendInvitationsMutation, SendInvitationsMutationVariables>;