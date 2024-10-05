import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Category: a
    .model({
      name: a.string().required().minLength(1).maxLength(100),
      description: a.string().maxLength(500),
    })
    .authorization((allow) => [allow.owner()])
    .search(),

  Bin: a
    .model({
      name: a.string().required().minLength(1).maxLength(100),
      location: a.string().maxLength(200),
      category: a.belongsTo('Category'),
      parent: a.belongsTo('Bin'),
      items: a.hasMany('Item'),
    })
    .authorization((allow) => [allow.owner()])
    .search(),

  Item: a
    .model({
      name: a.string().required().minLength(1).maxLength(100),
      description: a.string().maxLength(500),
      condition: a.string().maxLength(50),
      photoUrl: a.string().maxLength(2000),
      notes: a.string().maxLength(1000),
      bin: a.belongsTo('Bin'),
      tags: a.string().array(),
    })
    .authorization((allow) => [allow.owner()])
    .search({
      searchableFields: ['name', 'description', 'tags'],
    }),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});