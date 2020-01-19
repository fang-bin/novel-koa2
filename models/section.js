const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
  book_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Book',
  },
  section_name: {
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
  section_content: {
    type: String,
    required: true,
  },
});


const Section = mongoose.model('Section', SectionSchema);

module.exports = Section;