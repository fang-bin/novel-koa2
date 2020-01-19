const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  book_name: {
    type: String,
    required: true,
    trim: true,
  },
  author_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  create_time: {
    type: Date,
    default: Date.now(),
  },
  last_modify_time: {
    type: Date,
    default: Date.now(),
  },
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;