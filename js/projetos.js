/* =====================================================
   SEUS PROJETOS
   Para adicionar um projeto novo: copie um bloco { ... },
   cole no começo da lista, troque os dados e salve.

   status:   "concluido" ou "andamento"
   imagens:  lista de capturas de tela (a 1ª vira a capa do card).
             Coloque os arquivos em img/projetos/ e escreva
             o caminho, ex.: "img/projetos/meu-site-1.png"
   detalhes: texto maior, aparece ao clicar em "Ver detalhes"
   imagens, detalhes, repo e demo são opcionais
   ===================================================== */
const projetos = [
  {
    titulo: "Histórias para Angelica",
    descricao: "Site institucional da GS Interactive com identidade de contos de Histórias para Crianças de 10 a 13 anos.",
    detalhes: "projeto feito com a posibilidade de adcionar imagens e histórias empolgantes com cada história com sua pagina individual, dificuldade de deitar todas as paginas interligadas e todo sistema com a CSS Global, respeitando toda semântica  de HTML e logica do Java Script.",
    tecnologias: ["HTML", "CSS", "JS"],
    status: "concluido",
    imagens: ["img/projetos/projeto-historia-angelica.jpg"],
    repo: "https://ger7525.github.io/historias-de-angelica/",
    demo: ""
  },
  {
    titulo: "Sistema Operacional da Portaria — Condomínio Edifício Laguna Hall",
    descricao: "Aplicação web responsiva desenvolvida sob medida para a gestão e automação de rotinas condominiais. O sistema centraliza o controle de acesso de portaria, o gerenciamento de turnos e a comunicação integrada entre diferentes perfis (colaboradores, moradores, síndico e administradora), substituindo fluxos manuais por uma plataforma digital segura e estruturada.",
    detalhes: "Módulo de Portaria e Passagem de Plantão: Registro estruturado de ocorrências e turnos, com facilidade de envio e espelhamento automático para o histórico analítico da gestão.",
    tecnologias: ["HTML", "CSS", "JavaScript"],
    status: "concluido",
    imagens: ["img/projetos/laguna.jpg"],
    repo: "https://github.com/Ger7525/Laguna-Hall",
    demo: ""
  },
  {
    titulo: "Projeto exemplo 3",
    descricao: "Outro projeto da faculdade ou pessoal. Pode ser um sistema, um jogo ou um site.",
    detalhes: "",
    tecnologias: ["JavaScript"],
    status: "andamento",
    imagens: [],
    repo: "",
    demo: ""
  }
];
