import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Category: a.model({
    id: a.id(),
    name: a.string().required(),
    description: a.string(),
    bins: a.hasMany('Bin', 'categoryID'),
  }).authorization(allow => [allow.owner()]),

  Bin: a.model({
    id: a.id(),
    name: a.string().required(),
    location: a.string(),
    photo_url: a.string(),
    categoryID: a.string(),
    category: a.belongsTo('Category', 'categoryID'),
    parentBinID: a.string(),
    parentBin: a.belongsTo('Bin', 'parentBinID'),
    childBins: a.hasMany('Bin', 'parentBinID'),
    items: a.hasMany('Item', 'binID'),
  }).authorization(allow => [allow.owner()]),

  Item: a.model({
    id: a.id(),
    name: a.string().required(),
    photo_url: a.string(),
    condition: a.string(),
    binID: a.string().required(),
    bin: a.belongsTo('Bin', 'binID'),
    itemTags: a.hasMany('ItemTag', 'itemID'),
  }).authorization(allow => [allow.owner()]),

  Tag: a.model({
    id: a.id(),
    name: a.string().required(),
    itemTags: a.hasMany('ItemTag', 'tagID'),
  }).authorization(allow => [allow.owner()]),

  ItemTag: a.model({
    id: a.id(),
    itemID: a.string().required(),
    tagID: a.string().required(),
    item: a.belongsTo('Item', 'itemID'),
    tag: a.belongsTo('Tag', 'tagID'),
  }).authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});