const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    rota: {
      type: String,
      required: true,
    },
    metodo: {
      type: String,
      required: true,
    },
  },
  {
    // timestamps: true cria os campos createdAt e updatedAt automaticamente.
    // Vamos usar o createdAt como a "data" do log — sem precisar salvar manualmente.
    timestamps: true,
  },
);

module.exports = mongoose.model("Log", logSchema);