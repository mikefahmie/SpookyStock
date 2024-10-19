import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'spookystockbucket',
  access: (allow) => ({
    '*': [ // This allows access to all paths in the bucket
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  })
});