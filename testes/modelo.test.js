const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando get_pergunta para uma pergunta que existe', () => {
  // Arrange: Cadastra uma pergunta para garantir que ela exista
  const id_pergunta = modelo.cadastrar_pergunta('Qual a capital do Brasil?');
  
  // Act: Busca a pergunta pelo ID cadastrado
  const pergunta = modelo.get_pergunta(id_pergunta);

  // Assert: Verifica se a pergunta retornada é a correta
  expect(pergunta.id_pergunta).toBe(id_pergunta);
  expect(pergunta.texto).toBe('Qual a capital do Brasil?');
});

test('Testando get_pergunta para uma pergunta que NÃO existe', () => {
  // Act: Tenta buscar uma pergunta com um ID que não existe no BD limpo
  const pergunta = modelo.get_pergunta(999);

  // Assert: Verifica se o resultado é undefined (ou null, dependendo da implementação do bd.query)
  expect(pergunta).toBeUndefined();
});

test('Testando cadastro e listagem de respostas', () => {
  // Arrange: Cadastra uma pergunta e duas respostas para ela
  const id_pergunta = modelo.cadastrar_pergunta('Qual a cor do céu?');
  const id_resposta1 = modelo.cadastrar_resposta(id_pergunta, 'Azul');
  const id_resposta2 = modelo.cadastrar_resposta(id_pergunta, 'Depende do dia');

  // Act: Busca as respostas daquela pergunta
  const respostas = modelo.get_respostas(id_pergunta);

  // Assert: Verifica se as duas respostas foram retornadas corretamente
  expect(respostas.length).toBe(2);
  expect(respostas[0].id_resposta).toBe(id_resposta1);
  expect(respostas[0].texto).toBe('Azul');
  expect(respostas[1].id_resposta).toBe(id_resposta2);
  expect(respostas[1].texto).toBe('Depende do dia');
});

test('Testando get_respostas para uma pergunta sem respostas', () => {
    // Arrange: Cadastra uma pergunta mas não cadastra respostas para ela
    const id_pergunta = modelo.cadastrar_pergunta('Existe vida em Marte?');

    // Act: Busca as respostas da pergunta
    const respostas = modelo.get_respostas(id_pergunta);

    // Assert: Espera-se um array vazio
    expect(respostas.length).toBe(0);
});