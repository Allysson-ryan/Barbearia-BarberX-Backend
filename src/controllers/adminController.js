const dotenv = require("dotenv");
const Admin = require("../Models/admin");
const Horario = require("../Models/horario");
const Agendamento = require("../Models/agendamento");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

// Criar um administrador
exports.cadastrarAdmin = async (req, res) => {
  try {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ error: "Nome e senha são obrigatórios." });
    }

    const adminExistente = await Admin.findOne({ nome });
    if (adminExistente) {
      return res.status(400).json({ error: "Administrador já cadastrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const novoAdmin = new Admin({
      nome,
      senha: senhaCriptografada,
    });

    await novoAdmin.save();
    res.status(201).json({ message: "Administrador cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna a mensagem de erro exata
  }
};

// Login do admin
exports.loginAdmin = async (req, res) => {
  try {
    const { nome, senha } = req.body;

    const admin = await Admin.findOne({ nome });
    if (!admin) {
      return res.status(404).json({ error: "Administrador não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(senha, admin.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Login ou senha incorreta." });
    }

    // Gerando o token JWT
    const token = jwt.sign(
      { id: admin._id, nome: admin.nome, isAdmin: true }, // Agora inclui isAdmin
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      id: admin._id,
      nome: admin.nome,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};

// Criar horários disponíveis
exports.criarHorarios = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Token não encontrado, faça login novamente" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ error: "Token inválido, faça login novamente" });
    }

    const { data, horarios } = req.body;

    // Verifica se já existem horários cadastrados para a data
    let horarioExistente = await Horario.findOne({ data });

    if (horarioExistente) {
      // Se a data já existir, adiciona os novos horários ao array de horários, evitando duplicações
      const novosHorarios = horarios.filter(
        (horario) => !horarioExistente.horarios.includes(horario)
      );

      if (novosHorarios.length > 0) {
        // Atualiza o array de horários com os novos horários
        horarioExistente.horarios = [
          ...horarioExistente.horarios,
          ...novosHorarios,
        ];
        await horarioExistente.save(); // Salva as modificações no banco
        return res.status(200).json({
          message: "Horários atualizados com sucesso!",
          horarios: horarioExistente,
        });
      } else {
        return res.status(400).json({
          message: "Esse horário já foi cadastrado.",
        });
      }
    }

    // Se não existir a data, cria um novo registro
    const novoHorario = new Horario({ data, horarios });
    await novoHorario.save();

    res.status(201).json({
      message: "Horários criados com sucesso!",
      horarios: novoHorario,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar horários", error });
  }
};

exports.deletarHorario = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Token não encontrado, faça login novamente" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ error: "Token inválido, faça login novamente" });
    }

    const { data, horario } = req.body; // Agora pegando da URL corretamente

    if (!data || !horario) {
      return res
        .status(400)
        .json({ message: "Data e horário são obrigatórios." });
    }

    // Buscando a entrada correspondente no banco de dados
    let agendamento = await Horario.findOne({ data });

    if (!agendamento) {
      return res
        .status(404)
        .json({ message: "Nenhum horário encontrado para esta data" });
    }

    // Removendo o horário específico da lista
    agendamento.horarios = agendamento.horarios.filter((h) => h !== horario);

    // Se não houver mais horários, remover a entrada inteira
    if (agendamento.horarios.length === 0) {
      await Horario.deleteOne({ data });
    } else {
      await agendamento.save();
    }

    res.status(200).json({ message: "Horário removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar horário:", error);
    res.status(500).json({ message: "Erro ao remover horário", error });
  }
};

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

exports.listarAgendamentos = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Token não encontrado, faça login novamente" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ error: "Token inválido, faça login novamente" });
    }

    // Busca TODOS os agendamentos, garantindo que todos os campos venham
    const agendamentos = await Agendamento.find().lean(); // Use `.lean()` para retornar objetos JS puros

    res.status(200).json(agendamentos);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao listar agendamentos", message: error.message });
  }
};

exports.marcarAgendamentoComoAtendido = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = req.params;

    const agendamento = await Agendamento.findById(id);
    if (!agendamento) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    agendamento.atendido = true;
    await agendamento.save();

    res.status(200).json({ message: "Agendamento marcado como atendido" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rota para listar agendamentos atendidos
exports.listarAgendamentosAtendidos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find({ atendido: true });
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar agendamentos atendidos." });
  }
};
