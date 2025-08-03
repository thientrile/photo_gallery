const _ = require("lodash");
const { Types } = require("mongoose");
const Joi = require("joi");
/**
 * Retrieves specified fields from an object.
 *
 * @param {Object} options - The options object.
 * @param {Array} options.fields - The fields to retrieve from the object.
 * @param {Object} options.object - The object to retrieve fields from.
 * @returns {Object} - An object containing only the specified fields from the original object.
 */
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
/**
 * Omit specified fields from an object.
 *
 * @param {Object} options - The options object.
 * @param {Array} options.fields - The fields to omit from the object.
 * @param {Object} options.object - The object to omit fields from.
 * @returns {Object} - The object with specified fields omitted.
 */
const omitInfoData = ({ fields = [], object = {} }) => {
  return _.omit(object, fields);
};


/**
 * Converts a string ID to a Mongoose ObjectId.
 *
 * @param {string} id - The string ID to convert.
 * @returns {ObjectId} The converted Mongoose ObjectId.
 */
const convertToObjectIdMongoose = (id) => new Types.ObjectId(id);
/**
 * Converts a string ID to a Mongoose UUID object.
 *
 * @param {string} id - The string ID to convert.
 * @returns {Types.UUID} - The converted Mongoose UUID object.
 */
const converToUUIDMongoose = (id) => new Types.UUID(id);


const isValidation = {
  /**
   * Checks if the input is a valid email address.
   * @memberof isValidation
   * @param {string} input - The input to be validated.
   * @returns {boolean} - Returns true if the input is a valid email address, otherwise false.
   */
  isEmail: (input) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(input);
  },
  /**
   * Checks if the input is a valid phone number.
   * @memberof isValidation
   * @param {string} input - The input to be validated.
   * @returns {boolean} - Returns true if the input is a valid phone number, otherwise false.
   */
  isPhoneNumber: (input) => {
    var phonePattern =
      /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return phonePattern.test(input);
  },
  /**
   * Checks if the input is a valid username.
   * @memberof isValidation
   * @param {string} input - The input to be validated.
   * @returns {boolean} - Returns true if the input is a valid username, otherwise false.
   */
  isUserName: (input) => {
    var usernamePattern = /^\w{4,16}$/;
    return usernamePattern.test(input);
  },
};

function addPrefixToKeys(obj, prefix, excludedKeys = []) {
  const newObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Kiểm tra xem key có nằm trong danh sách excludedKeys không
      if (excludedKeys.includes(key)) {
        newObj[key] = obj[key]; // Giữ nguyên key nếu có trong danh sách loại trừ
      } else {
        newObj[prefix + key] = obj[key]; // Thêm tiền tố nếu không có trong danh sách loại trừ
      }
    }
  }
  return newObj;
}

/**
 * Removes a prefix from the keys of an object.
 *
 * @param {Object} obj - The object from which to remove the prefix.
 * @param {string} prefix - The prefix to remove from the keys.
 * @returns {Object} - A new object with the prefix removed from the keys.
 */
const removePrefixFromKeys = (obj, prefix) => {
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key.startsWith(prefix)) {
      newObj[key.slice(prefix.length)] = obj[key];
    } else {
      newObj[key] = obj[key]; // Giữ nguyên các key không có tiền tố
    }
  }
  return newObj;
};

const randomId = () => {
  return `${Date.now()}${Math.floor(Math.random() * 999)}`;
};

module.exports ={

    getInfoData,
    omitInfoData,
    convertToObjectIdMongoose,
    converToUUIDMongoose,
    isValidation,
    addPrefixToKeys,
    removePrefixFromKeys,
    randomId
}
