const express = require("express");
const router = express.Router();
const agendamentoController = require("./controllers/agendamentoController");
const adminController = require("./controllers/adminController");
const { verificarAdmin } = require("./middleware/authMiddleware");

router.post("/agendamentos", agendamentoController.criarAgendamento);
router.get(
  "/horario-disponivel",
  agendamentoController.listarHorariosDisponiveis
);

router.post("/cadastro", adminController.cadastrarAdmin);
router.post("/login", adminController.loginAdmin);
router.post("/horarios", verificarAdmin, adminController.criarHorarios);
router.get("/agendamentos", verificarAdmin, adminController.listarAgendamentos);
router.delete(
  "/deletar-horario",
  verificarAdmin,
  adminController.deletarHorario
);
router.patch(
  "/agendamento/:id/atendido",
  verificarAdmin,
  adminController.marcarAgendamentoComoAtendido
);
router.get(
  "/agendamentos-atendidos",
  verificarAdmin,
  adminController.listarAgendamentosAtendidos
);

//rota de teste
app.get("/ping", (req, res) => {
  res.send("✅ API da BarberX está rodando!");
});

module.exports = router;
