const mongoose = require('mongoose');
const { Schema } = mongoose;
const { DB_USERNAME, DB_PASSWORD, CLUSTER_NAME } = process.env;

mongoose
  .connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${CLUSTER_NAME}/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => console.error(e));

mongoose.connection.on('error', (err) => {
  console.error(err);
});

const schema = new Schema(
  {
    name: String,
    location: {
      latitude: Number,
      longitude: Number,
    },
  },
  {
    capped: { size: 1024 },
    bufferCommands: false,
    autoCreate: false, // disable `autoCreate` since `bufferCommands` is false
  },
);

const UserModel = mongoose.model('User', schema);
// Explicitly create the collection before using it
// so the collection is capped.
UserModel.createCollection();

function saveUser(data) {
  const user = new UserModel({
    ...data,
  });
  user.save(function (err) {
    if (err) return console.error(err);
    console.log('Saved!');
  });
}

module.exports = {
  saveUser,
};
