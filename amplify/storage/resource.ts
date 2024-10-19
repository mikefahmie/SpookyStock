import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'spookystockbucket',
  access: (allow) => ({
    'items/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  })
});