/**
* Seeds database with 100 users, 100 items and 100 comments.
 */
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);
mongoose.set("debug", true);

require("./User");
require("./Item");
require("./Comment");
require("../config/passport");

const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

async function createEntry(index) {
  const user = new User({
    username: `user${index}`,
    email: `user${index}@email.com`
  });
  user.setPassword('@12345678');
  await user.save();
  console.log('saved user:', user.username);

  const item = new Item({
    title: `title${index}`,
    description: `description${index}`,
    image: 'https://www.ubuy.vn/productimg/?image=aHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9JLzYxcUZkVjV2eGtMLl9TUzQwMF8uanBn.jpg',
    seller: user,
  });
  await item.save();
  console.log('saved item:', item.slug);

  const comment = new Comment({
    body: `comment body`,
    seller: user,
    item: item
  });
  await comment.save();
  console.log('saved comment');
  item.comments = [comment];
  await item.save();
}

(async function seeds() {
  const promises = [...Array(100).keys()].map(idx => createEntry(idx));
  await Promise.all(promises);
  mongoose.connection.close();
})();