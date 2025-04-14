const mongoose = require("mongoose");

const agendamentoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  horario: {
    type: String,
    required: true,
  },
  atendido: {
    type: Boolean,
    default: false,
  },
});

const Agendamento = mongoose.model("Agendamento", agendamentoSchema);

module.exports = Agendamento;
