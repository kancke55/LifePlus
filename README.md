# LifePlus
Projeto feito para um trabalho acadêmico.
O projeto está na branch master.
Para executar o projeto deve criar um banco de dados com a query disponivel nos arquivo do projeto e colocar a senha do banco no arquivo .env dentro dos aquivos do projeto e tambem mudar o nome do banco se necessario no db.
Para poder registrar um Usuario Admin caso pelo banco de dados não seja possivel voce tera que remover a autenticação do usuarioRoutes.js para poder criar o usuario admin aki um exemplo:
router.post('/register',  controller.register);
depois só desfazer essa modificação.
