const Horario = require("../Models/horario");

// Função para listar horários disponíveis para um dia
exports.listarHorariosDisponiveis = async (req, res) => {
  const { data } = req.params;

  try {
    const horarios = await Horario.findOne({ data: new Date(data) });
    if (!horarios) {
      return res
        .status(404)
        .json({ message: "Nenhum horário disponível para essa data." });
    }
    res.status(200).json(horarios.horariosDisponiveis);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar horários disponíveis.", error });
  }
};

// Função para listar horários não agendados para um dia específico
exports.listarHorariosDisponiveisNaoAgendados = async (req, res) => {
  const { data } = req.params;

  try {
    const horarios = await Horario.findOne({ data: new Date(data) });
    if (!horarios) {
      return res
        .status(404)
        .json({ message: "Nenhum horário disponível para essa data." });
    }

    // Verifica os horários que não foram agendados
    const agendamentos = await Agendamento.find({ data: new Date(data) });
    const horariosAgendados = agendamentos.map(
      (agendamento) => agendamento.horario
    );

    const horariosNaoAgendados = horarios.horariosDisponiveis.filter(
      (horario) => !horariosAgendados.includes(horario)
    );

    res.status(200).json(horariosNaoAgendados);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar horários disponíveis.", error });
  }
};
