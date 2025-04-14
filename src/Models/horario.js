const mongoose = require("mongoose");

const HorarioSchema = new mongoose.Schema({
  data: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  horarios: {
    type: [String], // Lista de horários disponíveis
    required: true,
  },
});

const Horario = mongoose.model("Horario", HorarioSchema);

module.exports = Horario;
