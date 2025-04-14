const Agendamento = require("../Models/agendamento");
const Horario = require("../Models/horario");

exports.criarAgendamento = async (req, res) => {
  try {
    const { nome, email, service, data, horario } = req.body;

    const horariosDisponiveis = await Horario.findOne({ data });

    if (
      !horariosDisponiveis ||
      !horariosDisponiveis.horarios.includes(horario)
    ) {
      return res.status(400).json({ message: "Horário não disponível" });
    }

    const novoAgendamento = new Agendamento({
      nome,
      email,
      service,
      data,
      horario,
    });
    await novoAgendamento.save();

    horariosDisponiveis.horarios = horariosDisponiveis.horarios.filter(
      (h) => h !== horario
    );
    await horariosDisponiveis.save();

    res.status(201).json({
      message: "Agendamento realizado com sucesso!",
      agendamento: novoAgendamento,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar agendamento", error });
  }
};

exports.listarHorariosDisponiveis = async (req, res) => {
  try {
    const { date } = req.query;
    const horariosDisponiveis = await Horario.findOne({ data: date });

    if (!horariosDisponiveis) {
      return res
        .status(404)
        .json({ message: "Nenhum horário disponível para essa data." });
    }

    res.status(200).json(horariosDisponiveis.horarios);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar horários disponíveis", error });
  }
};
