import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Category: a.model({
    name: a.string().required(),
    description: a.string(),
    bins: a.hasMany('Bin', 'category'),
  }).authorization(allow => [allow.owner()]),

  Bin: a.model({
    name: a.string().required(),
    location: a.string(),
    photo_url: a.string(),
    parentBinId: a.string(),
    categoryId: a.string().required(),
    category: a.belongsTo('Category', 'categoryId'),
    parentBin: a.belongsTo('Bin', 'parentBinId'),
    childBins: a.hasMany('Bin', 'parentBinId'),
    items: a.hasMany('Item', 'binId'),
  }).authorization(allow => [allow.owner()]),

  Item: a.model({
    name: a.string().required(),
    photo_url: a.string(),
    condition: a.string(),
    binId: a.string().required(),
    bin: a.belongsTo('Bin', 'binId'),
    itemTags: a.hasMany('ItemTag', 'itemId'),
  }).authorization(allow => [allow.owner()]),

  Tag: a.model({
    name: a.string().required(),
    itemTags: a.hasMany('ItemTag', 'tagId'),
  }).authorization(allow => [allow.owner()]),

  ItemTag: a.model({
    itemId: a.string().required(),
    tagId: a.string().required(),
    item: a.belongsTo('Item', 'itemId'),
    tag: a.belongsTo('Tag', 'tagId'),
  }).authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});