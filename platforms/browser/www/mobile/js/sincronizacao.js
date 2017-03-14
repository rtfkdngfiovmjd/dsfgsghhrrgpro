
var url;
var urlEscrita;
//console.log(JSON.stringify(LOGIN));

function enviarDados(){
	if(historico_agendamento.length >0){

		$.ajax({
			url: urlEscrita+"agendamentosModifica.php",
			data: {data: historico_agendamento, semestre: LOGIN.periodo_letivo, login: LOGIN.professor, sid:LOGIN.sid},
			dataType: "json",
			async:false,
			method: "post",
		}).done(function(dados){
			/* em caso da seção expirar */
			if(dados == "sessao expirada"){
				console.log("Problemas de Autenticação");
				reConectar();
			}else{
			
				if(historico_notas.length >0){
					 for(var i in dados["Insere"]){
					 	
					 	for(var j=0; j<historico_notas.length;j++){
						 	if(historico_notas[j]["codigo"] == dados["Insere"][i][0]){
						 		historico_notas[j]["codigo"] = dados["Insere"][i][1];
						 	}else{
						 		console.log("nao encontrado agendamento offline");
						 	}
						 };
						$.ajax({
							url: urlEscrita+"notasModificar.php",
							data: {data:historico_notas, semestre: LOGIN.periodo_letivo, sid:LOGIN.sid},
							dataType: "text",
							async:false,
							method: "post",
						}).done(function(dados){
							/* em caso da seção expirar */
							if(dados == "sessao expirada"){
								console.log("Problemas de Autenticação");
								reConectar();
							}else{
								historico_notas = [];
								localStorage.setItem("historico_notas",'[]');
							}
						}).fail(function(a,b,c){
							console.log(a);
							console.log(b);
							console.log(c);
						});
				  	};

				}
				historico_agendamento = [];
				localStorage.setItem("historico_agendamento",'[]' );
			}
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});
	}
	else if(historico_notas.length >0){

		$.ajax({
			url: urlEscrita+"notasModificar.php",
			data: {data:historico_notas, semestre: LOGIN.periodo_letivo, sid:LOGIN.sid},
			dataType: "text",
			async:false,
			method: "post",
		}).done(function(dados){
			/* em caso da seção expirar */
			if(dados == "sessao expirada"){
				console.log("Problemas de Autenticação");
				reConectar();
			}else{
				historico_notas = [];
				localStorage.setItem("historico_notas",'[]');
			}
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});
	}
	if(historico_frequencia.length >0){

		$.ajax({
			url: urlEscrita+"frequenciaModifica.php",
			data: {data:historico_frequencia, semestre: LOGIN.periodo_letivo, sid:LOGIN.sid},
			dataType: "text",
			async:false,
			method: "post",
		}).done(function(dados){
			/* em caso da seção expirar */
			if(dados == "sessao expirada"){
				console.log("Problemas de Autenticação");
				reConectar();
			}else{
				historico_frequencia = [];
				localStorage.setItem("historico_frequencia",'[]');			
			}
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});
	}
}


function reConectar(){
	//var page = "http://192.168.10.240/user/joaovitor/adx/mobile/professor/leitura/testeConecao.php";
	var page = prefix+unidade+"/mobile/professor/leitura/testeConecao.php";
	//var page = prefix+"/mobile/professor/leitura/testeConecao.php";
	$.ajax({
			url: page,
			data: { 
				codUsuario: LOGIN.professor,
				id: LOGIN.id,
				versao: VERSAO
			}, 
			dataType: "json",
			method: "post",
		}).done(function(data){
			LOGIN.sid = data["sid"];
			localStorage.setItem("login", JSON.stringify(LOGIN));
			console.log("RE-conectado");
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});

}


// FUNCAO SINCRONIZACAO PARA SINCRONIZAR (BUSCAR, ATUALIZAR E ENVIAR) As informacoes do professor (LOGIN)
function sincronizacao(inicializacao){

	// url = prefix+"adx/mobile/professor/leitura/";
	// urlEscrita = prefix+"adx/mobile/professor/escrita/";
	url = prefix+unidade+"/mobile/professor/leitura/";
	//url = "http://192.168.10.240/user/joaovitor/adx/mobile/professor/leitura/";
	//urlEscrita = "http://192.168.10.240/user/joaovitor/adx/mobile/professor/escrita/";
	//url = "52.32.236.139/adx/unidades/caratinga/mobile/professor/leitura/";
	urlEscrita = prefix+unidade+"/mobile/professor/escrita/";
	// url = prefix+"/mobile/professor/leitura/testeConecao.php";
	// urlEscrita = prefix+"/mobile/professor/leitura/testeConecao.php";

	enviarDados();

	//AGENDAMENTOS
	function sincroniza_agendamentos (){
		$.ajax({
			url: url+"agendamentos.php",
			data: {semestre: LOGIN.periodo_letivo, login: LOGIN.professor, sid:LOGIN.sid}, 
			dataType: "json",
			method: "post",
		}).done(function(data){
			/* em caso da seção expirar */
			if(data == "sessao expirada"){
				console.log("Problemas de Autenticação");
				reConectar();
			}
			else{
				AGENDAMENTOS=data;
				localStorage.setItem('agendamentos',JSON.stringify(data));
			}
			/* --------------------------- */
			if( $('#modalAgendamentos').css("display") !== undefined && $('#modalAgendamentos').css("display") == "block"){
				$('#modalAgendamentos').closeModal();
			}
		}).fail(function(a,b,c){
			console.log(JSON.stringify(a))
			console.log(b);
			console.log(c);
		});
	}

	//função realizada para pegar os valores cadastrados pela secretaria das etapa(1ªEtapa,1 Etapa ....)
	function sincroniza_valor_etapas (){
		$.ajax({
			url: url+"etapas.php",
			data: {semestre: LOGIN.periodo_letivo, sid:LOGIN.sid}, 
			dataType: "json",
			method: "post",
		}).done(function(data){
			/* em caso da seção expirar */
			if(data == "sessao expirada"){
				console.log("Problemas de Autenticação");
				reConectar();
			}else{
				ETAPA=data;
				localStorage.setItem('etapas',JSON.stringify(data));
			}
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});
	}
	//função que retorna um vetor de alunos de uma disciplina
	function sincroniza_turma (){
		$.ajax({
			url: url+"turma.php",
			data: {semestre: LOGIN.periodo_letivo, login: LOGIN.professor, sid:LOGIN.sid}, 
			dataType: "json",
			method: "post",
		}).done(function(data){
			/* em caso da seção expirar */
			if(data == "sessao expirada"){
				console.log("Problemas de Autenticação");
				reConectar();
			}
			else{
				TURMA=data;
				localStorage.setItem('turma',JSON.stringify(data));
			}

			if(inicializacao === true){
				sincroniza_datas(TURMA);
			}
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});
	}

	//ALUNOS
	function sincroniza_alunos (){
		$.ajax({
			url: url+"alunos.php",
			data: {semestre: LOGIN.periodo_letivo, login: LOGIN.professor, sid:LOGIN.sid}, 
			dataType: "json",
			method: "post",
		}).done(function(data){
			/* em caso da seção expirar */
			if(data == "sessao expirada"){
				console.log("Problemas de Autenticação");
				reConectar();
			}else{
				ALUNOS=data;
				localStorage.setItem('alunos',JSON.stringify(data));
			}
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});
	}

	//NOTAS
	function sincroniza_notas (){
		$.ajax({
			url: url+"notas.php",
			data: {semestre: LOGIN.periodo_letivo, login: LOGIN.professor, sid:LOGIN.sid}, 
			dataType: "json",
			method: "post",
		}).done(function(data){
			/* em caso da seção expirar */
			if(data == "sessao expirada"){
				console.log("Problemas de Autenticação");
				reConectar();
			}else{
				NOTAS=data;
				localStorage.setItem('notas',JSON.stringify(data));
			}
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});
	}

	//FREQUENCIA
	function sincroniza_frequencia (){
		$.ajax({
			url: url+"frequencia.php",
			data: {semestre: LOGIN.periodo_letivo, login: LOGIN.professor, sid:LOGIN.sid}, 
			dataType: "json",
			async:false,
			method: "post",
		}).done(function(data){
			/* em caso da seção expirar */
			if(data == "sessao expirada"){
				console.log("Problemas de Autenticação");
				reConectar();
			}else{
				FREQUENCIA=data;
				localStorage.setItem('frequencia',JSON.stringify(data));
			}
			if(inicializacao === false){
				if( $('#modalDatas').css("display") !== undefined && $('#modalDatas').css("display") == "block"){
					$('#modalDatas').closeModal();
				}
			}
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});
	}


//DATAS
	function sincroniza_datas(TURMAS){
		$.ajax({
			url: url+"datas.php",
			data: {turmas: TURMAS, semestre: LOGIN.periodo_letivo, sid:LOGIN.sid}, 
			dataType: "json",
			method: "post",
		}).done(function(data){
			/* em caso da seção expirar */
			if(data == "sessao expirada"){
				console.log("Problemas de Autenticação");
				reConectar();
			}else{
				DATAS=data;
				localStorage.setItem('datas',JSON.stringify(data));
			}
			if( $('#modalDatas').css("display") !== undefined && $('#modalDatas').css("display") == "block"){
				$('#modalDatas').closeModal();
			}
			modificarFrequencia(TURMAS);
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});
	}



	sincroniza_notas();
	sincroniza_agendamentos();
	sincroniza_valor_etapas();
	sincroniza_turma();
	sincroniza_alunos();
	sincroniza_frequencia();
	



} // FIM DA FUNCAO QUE SINCRONIZA OS DADOS QUANDO POSSUI INTERNET

/* funcao para acrescentar todas as datas que o professor possui na disciplina mantendo as faltas existentes*/
function modificarFrequencia(TURMAS){
	for(codDisciplina in TURMAS){
		var vetorDeDatas = new Array();
		
		// VERIFICA SE O VETOR FREQUENCIAS POSSUI TODOS OS COD. DAS DISCIPLINAS DO PROFESSOR
		if(FREQUENCIA[codDisciplina] === undefined){
			FREQUENCIA[codDisciplina] = {};
		}
		
		for(dat in FREQUENCIA[codDisciplina].datas){
			vetorDeDatas.push(dat);
		}
		var data;
		for(data in DATAS[codDisciplina]){
			var controle = 0;

			
			if(vetorDeDatas.length > 0){
				for(var j = 0; j < vetorDeDatas.length; j++ ){
					if(vetorDeDatas[j] == data){
						controle = 0;
						break;
					}else{
						controle = 1;
					}
				}
				if(controle == 1){
					FREQUENCIA[codDisciplina].datas[data] = {}
					for (var i = 0; i < DATAS[codDisciplina][data].qtd; i++) {
						FREQUENCIA[codDisciplina].datas[data]["0"+i] = new Array();
					};
				}
			}
			else{
				FREQUENCIA[codDisciplina].datas[data] = {}
				for (var i = 0; i < DATAS[codDisciplina][data].qtd; i++) {
						FREQUENCIA[codDisciplina].datas[data]["0"+i] = new Array();
				};
			}
		}
	}
}



/*
	FUNCAO: alteraAgendamento()
	Obj: Função para alterar os valores de um agendamento existente no banco de dados.
	Parametros: disciplina, etapa e codigo são extraidos do sistema a partir da seleção do usuário
				na interface do sistema.
				descricao,tipo,nota,aps,online e data são dados do formulário do agendamento selecionado.

*/

function alteraAgendamento (disciplina,etapa,codigo, online,descricao,tipo,nota,aps,data,hora){
	
	var antigo = $.extend(true, {},AGENDAMENTOS);
	
	if(nota == ""){
		nota = 0;
	}
	if(aps == ""){
		aps = 0;
	}

	AGENDAMENTOS[disciplina].etapas[etapa][codigo].descricao = descricao;
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].tipo = tipo;
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].nota = nota;
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].aps = aps;
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].online = online;
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].data = data;
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].hora = hora;
	

	
	var novo = $.extend(true, {},AGENDAMENTOS);
	

	historico_agendamento.push({"codigo":codigo,"antigoAltera":antigo[disciplina].etapas[etapa][codigo],"novoAltera":novo[disciplina].etapas[etapa][codigo]});
	localStorage.setItem('agendamentos',JSON.stringify(AGENDAMENTOS));
	localStorage.setItem('historico_agendamento',JSON.stringify(historico_agendamento));

}

/*
	FUNCAO: excluiAgendamento()
	Obj: Função para excluir os valores de um agendamento existente no banco de dados. Essa função inclui a 
		palavra "DELETE" em todos os campos do agendamento que deverá ser tratado ao ser enviado para o servidor
		e sua futura exclusão.
	Parametros: disciplina, etapa e codigo são extraidos do sistema a partir da seleção do usuário
				na interface do sistema.
				
*/

function excluiAgendamento (disciplina,etapa,codigo){
	// var antigo = array();
	// var antigo2 = array();
	// antigo[disciplina].etapas[etapa][codigo] = $.extend(true, {}, AGENDAMENTOS[disciplina].etapas[etapa][codigo]);
	// antigo2[disciplina].notas[etapa][codigo][codAlunos] = $.extend(true, {}, NOTAS[disciplina].notas[etapa][codigo][codAlunos]);
	
	var antigoAgendamento = $.extend(true, {},AGENDAMENTOS);
	var antigoNotas = $.extend(true, {},NOTAS);

	AGENDAMENTOS[disciplina].etapas[etapa][codigo].descricao = "DELETE";
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].tipo = "DELETE";
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].nota = "DELETE";
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].aps = "DELETE";
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].online = "DELETE";
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].data = "DELETE";
	AGENDAMENTOS[disciplina].etapas[etapa][codigo].hora = "DELETE";

	NOTAS[disciplina].notas[etapa][codigo] = "DELETE";
	NOTAS[disciplina].notas[etapa][codigo] = "DELETE";


	//var historico_agendamento = Array();
	historico_agendamento.push({"codigo":codigo,"antigoAgendamentoExclui":antigoAgendamento, "antigoNotasExclui":antigoNotas});		

	localStorage.setItem('agendamentos',JSON.stringify(AGENDAMENTOS));
	localStorage.setItem('notas',JSON.stringify(NOTAS));
	localStorage.setItem('historico_agendamento',JSON.stringify(historico_agendamento));

}

/*
	FUNCAO: insereAgendamento()
	Obj: Função para inserir um novo agendamento.
	Parametros: disciplina, é extraido do sistema a partir da seleção do usuário
				na interface do sistema.
				etapa, descricao,tipo,nota,aps,online e data são dados do formulário do agendamento selecionado.
				codigo é feito de forma randomica até a real inserção no banco de dados.

*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function insereAgendamento (disciplina, etapa,online,descricao,tipo,nota,aps,data,hora){
	// var antigo = array();
	// antigo[disciplina].etapas[etapa][codigo] = $.extend(true, {}, AGENDAMENTOS[disciplina].etapas[etapa][codigo]); // A variavel antigo armazena o vetor anterior

	
	var etapaComZero = "0".concat(etapa);

	
	var codigoAleatorio = getRandomInt(0,99999999);
	for(codd in AGENDAMENTOS[disciplina].etapas[etapaComZero]){
		if(codd == codigoAleatorio){
			codigoAleatorio = getRandomInt(0,99999999);
		}
	};
	codigoAleatorio = String(codigoAleatorio);
	
	if(nota == ""){
		nota = 0;
	}
	if(aps == ""){
		aps = 0;
	}
	// tratamento quando nao tiver a disciplina em AGENDAMENTOS OU NOTAS
	if(AGENDAMENTOS[disciplina] === undefined){
		AGENDAMENTOS[disciplina] = {};
	}
	if(NOTAS[disciplina] === undefined){
		NOTAS[disciplina] = {};
		NOTAS[disciplina].nome = TURMA[disciplina].nome;
		NOTAS[disciplina].notas = {};
	}
	//tratamento quando a disciplina nao tiver etapa selecionada pelo usuario
	if(AGENDAMENTOS[disciplina].etapas[etapaComZero] === undefined){
		AGENDAMENTOS[disciplina].etapas[etapaComZero] = {};
	}
	
	AGENDAMENTOS[disciplina].etapas[etapaComZero][codigoAleatorio] = {descricao: "",tipo: "",nota: "",aps: "",online: "",data: "",hora: ""};

	AGENDAMENTOS[disciplina].etapas[etapaComZero][codigoAleatorio].descricao = descricao;
	AGENDAMENTOS[disciplina].etapas[etapaComZero][codigoAleatorio].tipo = tipo;
	AGENDAMENTOS[disciplina].etapas[etapaComZero][codigoAleatorio].nota = nota;
	AGENDAMENTOS[disciplina].etapas[etapaComZero][codigoAleatorio].aps = aps;
	AGENDAMENTOS[disciplina].etapas[etapaComZero][codigoAleatorio].online = online;
	AGENDAMENTOS[disciplina].etapas[etapaComZero][codigoAleatorio].data = data;
	AGENDAMENTOS[disciplina].etapas[etapaComZero][codigoAleatorio].hora = hora;

	if(NOTAS[disciplina].notas[etapaComZero] === undefined){
		NOTAS[disciplina].notas[etapaComZero] = {};
		NOTAS[disciplina].notas[etapaComZero][codigoAleatorio] = $.extend(true, {},TURMA[disciplina]);
	}
	else{
		NOTAS[disciplina].notas[etapaComZero][codigoAleatorio] = $.extend(true, {},TURMA[disciplina]);
	}

	var novo = $.extend(true, {},AGENDAMENTOS);

	if(etapa[0] == ETAPA[0].etapas[0]){
		var codigoEtapa = ETAPA[0].codigos;
	}
	else if(etapa[0] == ETAPA[1].etapas[0]){
		var codigoEtapa = ETAPA[1].codigos;
	}
	else if(etapa[0] == ETAPA[2].etapas[0]){
		var codigoEtapa = ETAPA[2].codigos;
	}
	
	historico_agendamento.push({"disciplina":disciplina,"etapa":codigoEtapa, "codigoAleatorio": codigoAleatorio, "novoInsere":novo[disciplina].etapas[etapaComZero]});

	localStorage.setItem('agendamentos',JSON.stringify(AGENDAMENTOS));
	localStorage.setItem('historico_agendamento',JSON.stringify(historico_agendamento));
	
}










/*
	FUNCAO: alteraNota()
	Obj: Considerando que todas as notas são uma alteração pois na criação de um agendamento, todos os 
		alunos já começam com nota e/ou APS null. Sendo assim essa função permite que os dados dos 
		agendamentos de cada aluno seja alocada.
	Parametros: disciplina, etapa e codigo são extraidos do sistema a partir da seleção do usuário
				na interface do sistema.
				nota e aps são dados de preenchimento do formulário do agendamento selecionado.

*/


function alteraNota (disciplina,etapa,codigo, codAlunos,valorNotas,controle, input){
	// var antigo = array();
	// antigo[disciplina].notas[etapa][codigo][codAlunos] = $.extend(true, {}, AGENDAMENTOS[disciplina].notas[etapa][codigo][codAlunos]); // A variavel antigo armazena o vetor anterior
	


	
	var antigo = $.extend(true, {},NOTAS);
	var valida = 0;

	if(controle == 1 || controle == 3 ){
		if(controle == 3){
			for (var i = 0; i < valorNotas.length; i++) {


					if(eval(valorNotas[i].Notas) > eval(AGENDAMENTOS[disciplina].etapas[etapa][codigo].nota)){

						$(input[i].inputs).css("-webkit-appearance","none");
						$(input[i].inputs).css("box-shadow","0px 0px 4px #FF0000");
						$(input[i].inputs).css("border-radius","5px");
						valida = 1;
					}
					else{
						$(input[i].inputs).css("-webkit-appearance","none");
						$(input[i].inputs).css("box-shadow","#fff");
					}

				if(valorNotas[i].APS == false){
					valorNotas[i].APS = "NULL";
				}
				else if(valorNotas[i].APS == true){
					valorNotas[i].APS = "sim";
				}
				NOTAS[disciplina].notas[etapa][codigo][ valorNotas[i].codAluno ].nota = valorNotas[i].Notas;
				NOTAS[disciplina].notas[etapa][codigo][ valorNotas[i].codAluno ].aps = valorNotas[i].APS;
			
			};
		}
		else if(controle == 1){
			for (var i = 0; i < valorNotas.length; i++) {


					if(eval(valorNotas[i].Notas) > eval(AGENDAMENTOS[disciplina].etapas[etapa][codigo].nota)){

						$(input[i].inputs).css("-webkit-appearance","none");
						$(input[i].inputs).css("box-shadow","0px 0px 4px #FF0000");
						$(input[i].inputs).css("border-radius","5px");
						valida = 1;
					}
					else{
						$(input[i].inputs).css("-webkit-appearance","none");
						$(input[i].inputs).css("box-shadow","#fff");
					}

				if(valorNotas[i].APS == false){
					valorNotas[i].APS = "NULL";
				}
				else if(valorNotas[i].APS == true){
					valorNotas[i].APS = "sim";
				}
				NOTAS[disciplina].notas[etapa][codigo][ valorNotas[i].codAluno ].nota = valorNotas[i].Notas;
				NOTAS[disciplina].notas[etapa][codigo][ valorNotas[i].codAluno ].aps = valorNotas[i].APS;
			
			};
		}
		if(valida){
			toast('Erro - Nota(s) do aluno(s) inválida(s)', 3000);
			return false;
		}
	}
	if(controle == 2){ // so APS
		for (var i = 0; i < valorNotas.length; i++) {

			NOTAS[disciplina].notas[etapa][codigo][ valorNotas[i].codAluno ].nota = valorNotas[i].Notas;
			NOTAS[disciplina].notas[etapa][codigo][ valorNotas[i].codAluno ].aps = valorNotas[i].APS;
		}
	}
	var novo = $.extend(true, {},NOTAS);
	console.log(novo);
	

	historico_notas.push({"disciplina":disciplina,"codigo":codigo,"controle":controle,"antigo":antigo[disciplina].notas[etapa][codigo],"novo":novo[disciplina].notas[etapa][codigo]});

	localStorage.setItem('notas',JSON.stringify(NOTAS));
	localStorage.setItem('historico_notas',JSON.stringify(historico_notas));


}






/*
	FUNCAO: alteraFrequencia()
	Obj: Sempre que o professor abra uma frequencia na sua data de aula, ao salvar os dados dos estados dos
		alunos serão atualizados.
	Parametros: disciplina, etapa e codigo são extraidos do sistema a partir da seleção do usuário
				na interface do sistema.
				vetorAlunos00 e vetorAlunos01 são vetores de faltas nas aulas 1 e 2.

*/

function alteraFrequencia (disciplina,dataSelecionada, vetorAlunos00,vetorAlunos01, vetorAlunos02,vetorAlunos03){
	
	var antigo = $.extend(true, {},FREQUENCIA);

	FREQUENCIA[disciplina].datas[dataSelecionada]["00"] = [];
	FREQUENCIA[disciplina].datas[dataSelecionada]["01"] = [];
	FREQUENCIA[disciplina].datas[dataSelecionada]["02"] = [];
	FREQUENCIA[disciplina].datas[dataSelecionada]["03"] = [];
	
// o vetor ira receber as informações das alterações

	if(vetorAlunos00.length != 0){
		//FREQUENCIA[disciplina].datas[dataSelecionada]["00"] = [];

		for(var i = 0;i < vetorAlunos00.length; i++){
			FREQUENCIA[disciplina].datas[dataSelecionada]["00"][i] = vetorAlunos00[i].aluno;
		}
	}
	if(vetorAlunos01.length != 0){
		//FREQUENCIA[disciplina].datas[dataSelecionada]["01"] = [];
		
		for(var i = 0;i < vetorAlunos01.length; i++){
			FREQUENCIA[disciplina].datas[dataSelecionada]["01"][i] = vetorAlunos01[i].aluno;
		}
	}
	if(vetorAlunos02.length != 0){
		//FREQUENCIA[disciplina].datas[dataSelecionada]["02"] = [];
		
		for(var i = 0;i < vetorAlunos02.length; i++){
			FREQUENCIA[disciplina].datas[dataSelecionada]["02"][i] = vetorAlunos02[i].aluno;
		}
	}
	if(vetorAlunos03.length != 0){
		//FREQUENCIA[disciplina].datas[dataSelecionada]["03"] = [];

		for(var i = 0;i < vetorAlunos03.length; i++){
			FREQUENCIA[disciplina].datas[dataSelecionada]["03"][i] = vetorAlunos03[i].aluno;
		}
	}



	var novo = $.extend(true, {},FREQUENCIA);

	
	historico_frequencia.push({"disciplina": disciplina, "data": dataSelecionada,"antigo":antigo[disciplina].datas[dataSelecionada],"novo":novo[disciplina].datas[dataSelecionada]});

	localStorage.setItem('frequencia',JSON.stringify(FREQUENCIA));
	localStorage.setItem('historico_frequencia',JSON.stringify(historico_frequencia));

}





/*
	FUNCAO: enviaAviso()
	Obj: Enviar um aviso

*/
function enviaAviso (codDisciplinaMensagem,assuntoDaMensagem,textoDaMensagem,dataDoInicioMensagem,dataDoFimMensagem,listaAlunosMensagem){
	

	$.ajax({
			url: urlEscrita+"aviso.php",
			data: {
				codDisciplina: codDisciplinaMensagem,
				assunto: assuntoDaMensagem,
				texto: textoDaMensagem,
				inicio: dataDoInicioMensagem,
				fim: dataDoFimMensagem,
				alunos: listaAlunosMensagem,
				semestre: LOGIN.periodo_letivo, 
				login: LOGIN.professor
			},
			dataType: "text",
			method: "post",
		}).done(function(dados){
			toast('Mensagem Enviada!', 6000);
		}).fail(function(a,b,c){
			console.log(a);
			console.log(b);
			console.log(c);
		});
}