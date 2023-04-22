const {Schema, model} = require("mongoose")

const messageSchema = new Schema({
    from: {type: String, required: true},
    to: {type: String, required: true},
    time: {type: Number, default: Date.now},
    text: {type: String, required: true},
  });

module.exports = model("Message", messageSchema);