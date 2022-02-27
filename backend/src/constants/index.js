const MONGO_CODES = {
  DUPLICATE: 11000
};

const MONGO_TO_JSON_OPTIONS = {
  versionKey: false,
  transform: (_, { _id, ...obj }) => ({ id: _id, ...obj })
}

module.exports = {
  MONGO_CODES,
  MONGO_TO_JSON_OPTIONS
};
