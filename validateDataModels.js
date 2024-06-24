import Joi from 'joi';

// Define Joi schemas for each type
const SectionSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  itemIds: Joi.array().items(Joi.string()).required(),
  magicCopyKey: Joi.string(),
  imageUrl: Joi.string()
}).unknown(true);

const ItemSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  modGroupIds: Joi.array().items(Joi.string()).required(),
  magicCopyKey: Joi.string(),
  imageUrl: Joi.string()
}).unknown(true);

const ModGroupSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  modIds: Joi.array().items(Joi.string()).required(),
  maxMods: Joi.number().optional().allow(null),
  minMods: Joi.number().optional().allow(null)
}).unknown(true);

const ModSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  modGroupIds: Joi.array().items(Joi.string()).required(),
  price: Joi.number().required()
}).unknown(true);

const DiscountSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  amount: Joi.number().optional().allow(null),
  rate: Joi.number().optional().allow(null),
  couponCode: Joi.string().optional().allow(null)
}).or('amount', 'rate')
  .unknown(true);

const OrderTypeSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required()
}).unknown(true);

// Combine into a MenuResponse schema
const MenuResponseSchema = Joi.object({
  sections: Joi.array().items(SectionSchema).required(),
  items: Joi.array().items(ItemSchema).required(),
  modGroups: Joi.array().items(ModGroupSchema).required(),
  mods: Joi.array().items(ModSchema).required(),
  discounts: Joi.array().items(DiscountSchema).required(),
  orderTypes: Joi.array().items(OrderTypeSchema).required()
}).unknown(true);

// .options({ stripUnknown: true });

export const validateMenuData = (menuData) => {
  const { error } = MenuResponseSchema.validate(menuData);

  return error ? {error: true, msg: error.details[0].message} : {error: false};
}