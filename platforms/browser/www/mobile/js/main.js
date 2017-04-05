
var LOGIN = JSON.parse( localStorage.getItem('login') );

var historico_agendamento = [];
var historico_notas = [];
var historico_frequencia = [];
var AGENDAMENTOS = {};
var NOTAS = {};
var ETAPA = {};
var ALUNOS = {};
var FREQUENCIA = {};
var TURMA = {};
var DATAS = {};

function destroi_secao(){
	//var page = prefix+"adx/mobile/professor/destroi_sessao.php";
	var page = prefix+unidade+"/mobile/professor/destroi_sessao.php"; //OFICIAL
	//var page = prefix+"/mobile/professor/destroi_sessao.php";
	$.ajax({
		url: page,
		data: {sid:LOGIN.sid}, 
		dataType: "text",
		method: "post",
	}).done(function(data){
		console.log(JSON.stringify(data));
	}).fail(function(a,b,c){
		console.log(a);
		console.log(b);
		console.log(c);
	});
}

	

	
	//verifica a conexao do usuario para mostrar o icone de desconectado.
	setInterval(function(){
		

		var estadoRede = estadoConexao();
		if( estadoRede !== 'No network connection' && unidade !== undefined){
			var imgConexao= "";
			$("#semConexao").html(imgConexao);
			$(".toast").remove();
			$(".msgErroAviso").html("");
			
		}
		else{
			
			// setInterval(function(){
			// 	$(".msgErroAviso").html("");
			// }, 10000);

			var imgConexao= "<div class='mdi-device-signal-wifi-off right-align' style='font-size: 20px;'></div>";
			$("#semConexao").html(imgConexao);
			if( $('#conteudoInicial').css("display") != "block" && $('#imgLogin').css("display") != "block"){
				$(".toast").remove();
			}
			if( $('.toast').length != 1 && $('#conteudoInicial').css("display") == "block"){
				toast("Modo Offline");
			}
		}
	}, 3000);

	// // verifica de tempos em tempos se existe alguma modificação do aplicativo
	setInterval(function(){
		if((historico_agendamento.length >0 || historico_notas.length >0 || historico_frequencia.length >0) && unidade !== undefined){
			
			var estadoRede = estadoConexao();
			if( estadoRede !== 'No network connection'){

				//var page = "http://192.168.10.240/user/joaovitor/adx/mobile/professor/leitura/testeConecao.php";
				//var page = prefix+"adx/mobile/professor/leitura/testeConecao.php";
				var page = prefix+unidade+"/mobile/professor/leitura/testeConecao.php";
				//var page = prefix+"/mobile/professor/leitura/testeConecao.php";
				//var page = "http://54.71.93.101/adx/unidades/caratinga/mobile/professor/leitura/testeConecao.php";
				var resultado = 0;
				$.ajax({
					url: page,
					data: {},
					timeout: 9000,
					dataType: "text",
					method: "post",
					async: false,
				}).done(function(dados){
					enviarDados();
				}).fail(function(a,b,c){
					console.log(a);
					console.log(b);
					console.log(c);
					if( $('#modalDatas').css("display") !== undefined && $('#modalDatas').css("display") == "block"){
						$('#modalDatas').closeModal();
					}
					if( $('.toast').length != 1 ){
						toast("Servidor com problemas conexão.");
					}
				});

			}else{
				if( $('#modalDatas').css("display") !== undefined && $('#modalDatas').css("display") == "block"){
					$('#modalDatas').closeModal();
				}
				if( $('#conteudoInicial').css("display") != "block" && $('#imgLogin').css("display") != "block"){
					$(".toast").remove();
				}
				if( $('.toast').length != 1 && $('#conteudoInicial').css("display") == "block"){
					toast("Modo Offline");
				}
				colocarNomeProfessor("html");
			}

		}
	}, 3000);


	
	// FUNCAO PARA APRESENTAR UMA TELA DE ERRO CASO A VERSAO DO SISTEMA SEJA MODIFICADA
	function erroDeVersao(){

		$("#lean-overlay").remove();
		$(".modal").remove();
		//localStorage.clear();

		if( device.platform == "iOS" ){
			var icone="<a href='itms-appss://itunes.apple.com/br/app/apple-store/id1031558723?mt=8'><img style='height:100px;' src='images/app-store.png'></a>";
		}
		else if( device.platform == "Android" ){
			var icone="<a href='market://details?id=com.fluxsoftwares.adxpro'><img style='height:100px;' src='images/google-play-logo.jpg'></a>";
		}
		else{
			var icone="\
			<a href='market://details?id=com.fluxsoftwares.adxpro'><img style='height:100px;' src='images/google-play-logo.jpg'></a>\
			<a href='itms-appss://itunes.apple.com/br/app/apple-store/id1031558723?mt=8'><img style='height:100px;' src='images/app-store.png'></a>\
			";
		}
		var msgErroVersao="\
		<h3 class='center-align'>Versão do App</h3>\
		<div style='padding-left:20px;padding-right:20px;'>\
			<p>Prezado Professor;</p>\
			<p align='justify'>Com a finalidade de melhorar o sistema, realizamos uma nova atualização do aplicativo para corrigir erros nas funcionalidades do aplicativo.</p>\
			<p align='justify'>A versão mais atualizada já está disponível para download nas seguintes plataformas:</p>\
			<div>"+icone+"</div>\
		</div>\
		";
		$("main").html(msgErroVersao);
		$(".button-collapse").html("");
		$("#nomeSecao").html("Atualizar");
	
	}


	// FUNCAO PARA SABER SE EXISTE E QUAL E A CONEXAO DO DEVICE
	function estadoConexao(){

		if(navigator.connection === undefined){
			return "No connection";
		}

        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        return states[networkState];
	}

	// FUNCAO QUE VERIFICA SE O USUARIO POSSUI CONEXAO E QUE CONSEGUE CONECTAR NO SERVIDOR
	function isOnline(inicializacao){

		// verifica a hora do sistema com a hora do dispositivo do professor
		
		var diaDeHoje = new Date();


		if(LOGIN.dia !== undefined){
			var diaDoServidor = new Date( LOGIN.dia.split("-")[0], (LOGIN.dia.split("-")[1])-1, LOGIN.dia.split("-")[2], 0, 0, 0, 0 );				
			var erroData = "\
			<div id='msgErroData' style='padding: 30px;border: black solid 2px;margin-top: 25%;'>\
				<p style='font-size:20px;'>\
				<i style='font-size:25px;' class='mdi-alert-warning'></i>\
					Para a sua segurança. Atualize o Dia e a Hora do seu celular.\
				</p>\
				<button class='btn' onclick='isOnline()'>Atualizar</button>\
			</div>\
			";

			if(diaDeHoje < diaDoServidor){
				$("#conteudo").hide();
				if( $('#modalDatas').css("display") !== undefined && $('#modalDatas').css("display") == "block"){
					$('#modalDatas').closeModal();
				}
				if($("#msgErroData").length == 0 ||$("#msgErroData").length === undefined){
					$("main").append(erroData);
				}
			}
			else{
				$("#msgErroData").hide();
				$("#conteudo").show();
			}
		}

		var estadoRede = estadoConexao();
		if( estadoRede !== 'No network connection' ){
			//var page = "http://192.168.10.240/user/joaovitor/adx/mobile/professor/leitura/testeConecao.php";
			//var page = prefix+"adx/mobile/professor/leitura/testeConecao.php";
			var page = prefix+unidade+"/mobile/professor/leitura/testeConecao.php";
			//var page = prefix+"/mobile/professor/leitura/testeConecao.php";
			//var page = "http://35.163.117.74/adx/unidades/caratinga/mobile/professor/leitura/testeConecao.php";
			var resultado = 0;
			//console.log(JSON.stringify(LOGIN));
			$.ajax({
				url: page,
				data: {
					codUsuario: LOGIN["professor"],
					id: LOGIN["id"],
					sid: LOGIN["sid"],
					versao: VERSAO
				},
				timeout: 9000,
				dataType: "json",
				method: "post",
				async: false,
			}).done(function(dados){
				/*sistema de segurança de versão do aplicativo*/
				if(dados == "Erro de Versao"){
					erroDeVersao();
					resultado = "erro versao";
					return false;
				}
				/* sistema de segurança dos dados */
				if(dados == "Erro de autenticação"){
					toast("Erro de autenticação");
					LOGIN = [];
					localStorage.setItem("login",'[]');
					$('body').load("login.html", function(){
						$('select').material_select();
						$("body").removeClass("semImg").addClass("comImg");
					});
				}
				/* ------------------------------------------------------- */
				if(LOGIN.periodo_letivo != dados["periodo_letivo"]) {
					LOGIN.periodo_letivo = dados["periodo_letivo"];
				}
				LOGIN.dia = dados["data"];
				LOGIN.sid = dados["sid"];
				localStorage.setItem("login", JSON.stringify(LOGIN));
				console.log(JSON.stringify(LOGIN));
				console.log("conectado");
				colocarNomeProfessor("html"); //atualizar os valores de data e hora.
				resultado = 1;
				sincronizacao(inicializacao);
			}).fail(function(a,b,c){
				console.log(JSON.stringify(a));
				console.log(b);
				console.log(c);
				if( $('#modalDatas').css("display") !== undefined && $('#modalDatas').css("display") == "block"){
					$('#modalDatas').closeModal();
				}
				if( $('.toast').length != 1 ){
					toast("Servidor com problemas conexão.");
				}
				resultado = 0;
			});

		}else{
			if( $('#modalDatas').css("display") !== undefined && $('#modalDatas').css("display") == "block"){
				$('#modalDatas').closeModal();
			}
			if( $('.toast').length != 1 && $('#conteudoInicial').css("display") == "block"){
				toast("Modo Offline");
			}
			colocarNomeProfessor("html"); //atualizar os valores de data e hora.
			// sincronizacao(inicializacao);
			return 0;
		}

		return resultado;
	}

	// FUNCAO PARA MODIFICAR AS TELAS DO 
	function modifica_tela (proximaTela, envia, form){
		if(envia === true){
			$("#conteudoInicial").hide("scale",700);
			$("#conteudoNotas").hide("scale",700);
			$("#disciplinasNotas").hide("scale",700);
			$("#formNotas").hide("scale",700);
			$("#conteudoAgendamentos").hide("scale",700);
			$("#conteudoInterno").hide("scale",700);
			$("#conteudoEditarAgendamentos").hide("scale",700);
			$("#conteudoAddAgendamento").hide("scale",700);
			$("#conteudoFrequencia").hide("scale",700);
			$("#selecionaData").hide("scale",700);
			$("#chamada").hide("scale",700);
			$("#conteudoAvisos").hide("scale",700);
			$("#conteudoConfig").hide("scale",700);
			$("#conteudoPin").hide("scale",700);
			$("#conteudoPinConfirma").hide("scale",700);
			$("#VerificaPin").hide("scale",700);
			
			setTimeout(function() {
				if(proximaTela == "conteudoInicial"){$("#nomeSecao").html("Início");};
				$("#"+proximaTela).show("fade", 700); 

				toast('Enviado com Sucesso!', 5500)
				$('.tooltipped').tooltip({delay: 1000});
			},700);
			return false;
		}
		
		$("#conteudoInicial").hide("drop", { direction: "right" },300);
		$("#conteudoNotas").hide("drop", { direction: "right" },300);
		$("#disciplinasNotas").hide("drop", { direction: "right" },300);
		$("#formNotas").hide("drop", { direction: "right" },300);
		$("#conteudoAgendamentos").hide("drop", { direction: "right" },300);
		$("#conteudoInterno").hide("drop", { direction: "right" },300);
		$("#conteudoEditarAgendamentos").hide("drop", { direction: "right" },300);
		$("#conteudoAddAgendamento").hide("drop", { direction: "right" },300);
		$("#conteudoFrequencia").hide("drop", { direction: "right" },300);
		$("#selecionaData").hide("drop", { direction: "right" },300);
		$("#chamada").hide("drop", { direction: "right" },300);
		$("#conteudoAvisos").hide("drop", { direction: "right" },300);
		$("#conteudoConfig").hide("drop", { direction: "right" },300);
		$("#conteudoPin").hide("drop", { direction: "right" },300);
		$("#conteudoPinConfirma").hide("drop", { direction: "right" },300);
		$("#VerificaPin").hide("drop", { direction: "right" },300);


		setTimeout(function() {
			if(proximaTela == "conteudoInicial"){$("#nomeSecao").html("Início");};
			$("#"+proximaTela).show("drop", 300); 
		},300);
	}


	function esperaDisciplinas(){
		if( AGENDAMENTOS === null){
			var load = "\
			<div id='modalAgendamentos' class='modal' style='color:rgba(84, 150, 252, 0.97); background: transparent; box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0); height: 100%;'>\
	    	<div class='modal-content'>\
				<div class='preloader-wrapper big active' style='margin-left: 40%;'>\
				    <div class='spinner-layer spinner-blue-only'>\
				      <div class='circle-clipper left'>\
				        <div class='circle'></div>\
				      </div><div class='gap-patch'>\
				        <div class='circle'></div>\
				      </div><div class='circle-clipper right'>\
				        <div class='circle'></div>\
				      </div>\
				    </div>\
				</div>\
			</div>\
			</div>\
	  		";
	  		$("main").append(load);

	  		$('#modalAgendamentos').openModal({
	  			dismissible: false,
	  			opacity: .5,
	  		});
		}
	}

	//FUNCAO PARA FORCAR O USUARIO AGUARDAR O CARREGAMENTO DE DADAS NA FUNCAO FREQUENCIA
	function esperaDados(clicou){
		var load = "\
		<div id='modalDatas' class='modal' style='color:rgba(84, 150, 252, 0.97); background: transparent; box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0); height: 30%;'>\
		<div class='modal-content'>\
			<div class='preloader-wrapper big active' style='margin-left: 40%;'>\
			    <div class='spinner-layer spinner-blue-only'>\
			      <div class='circle-clipper left'>\
			        <div class='circle'></div>\
			      </div><div class='gap-patch'>\
			        <div class='circle'></div>\
			      </div><div class='circle-clipper right'>\
			        <div class='circle'></div>\
			      </div>\
			    </div>\
			</div>\
		</div>\
		</div>\
			";
			$("main").append(load);

			$('#modalDatas').openModal({
				dismissible: false,
				opacity: .5,
			});

		if( DATAS !== null ){
			isOnline(clicou);
		}
	}

	// FUNCAO PARA LISTAR AS DISCIPLINAS DO PROFESSOR.
	function carrega_disciplinas(AGENDAMENTOS, ALUNOS, NOTAS, opcao) {

		$("#nomeSecao").html(opcao);

		var string = "\
		<div class='row center-align'>\
			<div class='col s6'>\
				<a class='voltaMenuInicial waves-effect waves btn-flat'><i class='mdi-navigation-arrow-back left'></i>VOLTAR</a>\
			</div>\
			<div class='col s6'>\
				<a class='voltaMenuInicial waves-effect waves btn-flat'><i class='mdi-action-home left'></i>INÍCIO</a>\
			</div>\
		</div>\
		<div class='collection' id='listaDisciplinas"+opcao+"'> <h5 class='collection-item'>Disciplinas</h5></div>\
		";
		$("#conteudo"+opcao).html(string);

		$(".voltaMenuInicial").click(function(){
			modifica_tela("conteudoInicial");
		});


			modifica_tela("conteudo"+opcao);

		if(Object.keys(TURMA).length == 0){
			var semDisciplina = "\
			<div>\
				<p class='center-align'>ATENÇÃO</p>\
				<p class='center-align'>Professor(a) sem disciplinas associadas.</p>\
			</div>\
			";
			$("#listaDisciplinas"+opcao).append(semDisciplina);
		}

		var interacoes = 0;
		for(codigoDisciplina in TURMA){
			var cod = TURMA[codigoDisciplina];
			
			var valor = interacoes%2;
			if(valor == 0){
				var cores = "active";	
			}
			else{
				var cores = "";
			}


			var stringListaDisciplinas = "\
				<a href='#!' class='collection-item "+cores+"' id='"+opcao+"_"+codigoDisciplina+"'>"+cod['nome']+"\
				</a>\
			";

			$("#listaDisciplinas"+opcao).append(stringListaDisciplinas);



			$("#"+opcao+"_"+codigoDisciplina).click(function() {
				switch(opcao){
					case 'Agendamentos':
						carrega_agendamentos(this);
						break;
					case 'Frequencia':
						carrega_frequencia(this);
						break;
					case 'Notas':
						carrega_notas(this);
						break;
					default:
						break;
				}
			});
			interacoes++;
		};
		
	}

	/* funcao para colocar o nome do professor na tela principal */
	function colocarNomeProfessor(adicionar){
		var today = new Date();
		var dia = today.getDate();
		var mes = today.getMonth();
		var ano = today.getFullYear();
		// var horas = today.getHours();
		// var minutos = today.getMinutes();

		if((dia.toString()).length == 1){dia = "0"+dia;}
		if((mes.toString()).length == 1){mes = "0"+mes;}
		// if((horas.toString()).length == 1){horas = "0"+horas;}
		// if((minutos.toString()).length == 1){minutos = "0"+minutos;}

		var nomeProfessor = (LOGIN.nome).split(" ");
		var ultimoNome = nomeProfessor[(nomeProfessor.length)-1];
		if(ultimoNome == ""){ultimoNome = nomeProfessor[(nomeProfessor.length)-2];}

		var stringNomeDoProfessor = "\
			<p>Prof. "+nomeProfessor[0]+" "+ultimoNome+" </p>\
		";		
	    // var stringNomeDoProfessor = "\
	    // 	Prof. "+nomeProfessor[0]+" "+ultimoNome+" - "+dia+"/"+mes+"/"+ano+" ás "+horas+":"+minutos+"\
	    // ";
	    if(adicionar == "append"){$("#nomeDoProfessor").append(stringNomeDoProfessor);}
	    if(adicionar == "html"){$("#nomeDoProfessor").html(stringNomeDoProfessor);}
	}
	/* -------------------------------------------------- */


function INICIO(){


	if(LOGIN === null){
		localStorage.clear();
		$('body').load("index.html");
		
	}else{

		if (typeof localStorage.historico_agendamento !== 'undefined') {
			historico_agendamento = JSON.parse(localStorage.getItem('historico_agendamento'));
		}else{
			historico_agendamento=Array();
		}

		if (typeof localStorage.historico_notas !== 'undefined') {
			historico_notas = JSON.parse( localStorage.getItem('historico_notas') );
		}else{
			historico_notas=Array();
		}

		if (typeof localStorage.historico_frequencia !== 'undefined') {
			historico_frequencia = JSON.parse( localStorage.getItem('historico_frequencia') );
		}else{
			historico_frequencia=Array();
		}


		AGENDAMENTOS = JSON.parse(localStorage.getItem('agendamentos'));
		NOTAS = JSON.parse(localStorage.getItem('notas'));
		ETAPA = JSON.parse(localStorage.getItem('etapas'));
		ALUNOS = JSON.parse(localStorage.getItem('alunos'));
		FREQUENCIA = JSON.parse(localStorage.getItem('frequencia'));
		TURMA = JSON.parse(localStorage.getItem('turma'));
		DATAS = JSON.parse(localStorage.getItem('datas'));



	    $('.tooltipped').tooltip({delay: 50});
	    $('.materialboxed').materialbox();
	    $('.modal-trigger').leanModal();
	    $('.slider').slider({height:'auto',indicators:false});
	    $(".button-collapse").sideNav();
	    $("#nomeSecao").html("Início");

	}	

}// fim da funcao INICIO()

		$(document).on('tap','.secaoInicio',function() {
			$("#nomeSecao").html("Início");
			modifica_tela("conteudoInicial");
			$('.button-collapse').sideNav('hide');
		});

		$(document).on('tap','.secaoNotas',function() {
			esperaDados(false);
			carrega_disciplinas(AGENDAMENTOS, ALUNOS, NOTAS,'Notas');
			$('.button-collapse').sideNav('hide');
		});

		$(document).on('tap','.secaoAgendamento',function() {
			esperaDados(false);
			carrega_disciplinas(AGENDAMENTOS, ALUNOS, NOTAS,'Agendamentos');
			$('.button-collapse').sideNav('hide');
		});

		$(document).on('tap','.secaoFrequencias',function() {
			esperaDados(true);
			carrega_disciplinas(AGENDAMENTOS, ALUNOS, NOTAS,'Frequencia');
			$('.button-collapse').sideNav('hide');
		});

		$(document).on('tap','.sair',function() {

			if(historico_agendamento.length == 0 && historico_notas.length == 0 && historico_frequencia.length == 0){
				$('.modal-trigger').leanModal();
				$('.button-collapse').sideNav('hide');
				var msgSair = "\
				<div id='modalSair' class='modal mudarConteudo'>\
				    <div class='modal-content'>\
				      <h4><i class='mdi-alert-warning'></i>Sair</h4>\
				      <p>Tem certeza que deseja sair?</p>\
				    </div>\
				    <div class='modal-footer'>\
				   <a href='#' class='modal-action modal-close waves-effect btn' style='margin:6px;'>Não</a>\
				      <a href='#' id='sairSim' class='waves-effect btn'>Sim</a>\
				    </div>\
				</div>\
				";
				$("body").append(msgSair);
				$('#modalSair').openModal();
				return false;

			}
			else{
				$('.modal-trigger').leanModal();
				$('.button-collapse').sideNav('hide');

				var msgSair = "\
				<div id='DadosModalSair' class='modal mudarConteudo'>\
				    <div class='modal-content'>\
				      <h4><i class='mdi-alert-warning'></i>Sair</h4>\
				      <p>Tem certeza que deseja sair?</p>\
				      <p>Você possui DADOS pendentes à serem enviados!</p>\
				    </div>\
				    <div class='modal-footer'>\
				      <a href='#' class='modal-action modal-close waves-effect btn' style='margin:6px;'>Não</a>\
				      <a href='#' id='DadosSairSim' class='waves-effect btn'>Sim</a>\
				    </div>\
				</div>\
				";
				$("body").append(msgSair);
				$('#DadosModalSair').openModal();
				return false;

			}

		});// fim do SAIR
		
		$(document).on('tap', '#sairSim', function(){
			destroi_secao();
			LOGIN = [];
			localStorage.setItem("login",'[]');
			AGENDAMENTOS = [];
			localStorage.setItem("agendamentos",'[]');
			FREQUENCIA = [];
			localStorage.setItem("frequencia",'[]');
			NOTAS = [];
			localStorage.setItem("notas",'[]');
			TURMA = [];
			localStorage.setItem("turma",'[]');
			ETAPA = [];
			localStorage.setItem("etapa",'[]');
			DATAS = [];
			localStorage.setItem("datas",'[]');

			localStorage.clear();
			$('body').load("login.html", function(){
				$('select').material_select();
				$("body").removeClass("semImg").addClass("comImg");
			});
		});

		$(document).on('tap', '#DadosSairSim', function(){
			var certeza = "\
			<div class='modal-content'>\
		      <h4><i class='mdi-alert-warning'></i>Sair</h4>\
		      <p>Você tem certeza que deseja DELETAR todos os dados que não foram enviados?</p>\
		    </div>\
		    <div class='modal-footer'>\
		      <a href='#' id='certezaNao' class='waves-effect btn' style='margin:6px;'>Não</a>\
		      <a href='#' id='certezaSim' class='waves-effect btn'>Sim</a>\
		    </div>\
			";
			$(".mudarConteudo").html(certeza);

		});

		$(document).on('tap', '#certezaSim', function(){
			$('#DadosModalSair').closeModal();
			destroi_secao();
			LOGIN = [];
			localStorage.setItem("login",'[]');
			AGENDAMENTOS = [];
			localStorage.setItem("agendamentos",'[]');
			FREQUENCIA = [];
			localStorage.setItem("frequencia",'[]');
			NOTAS = [];
			localStorage.setItem("notas",'[]');
			TURMA = [];
			localStorage.setItem("turma",'[]');
			ETAPA = [];
			localStorage.setItem("etapa",'[]');
			DATAS = [];
			localStorage.setItem("datas",'[]');

			localStorage.clear();
			$('body').load("login.html", function(){
				$('select').material_select();
				$("body").removeClass("semImg").addClass("comImg");
			});
		});
		$(document).on('tap', '#certezaNao', function(){
			var certezaNao = "\
				<div class='modal-content'>\
				      <h4><i class='mdi-alert-warning'></i>Sair</h4>\
				      <p>Tem certeza que deseja sair?</p>\
				      <p>Você possui DADOS pendentes à serem enviados!</p>\
				    </div>\
				    <div class='modal-footer'>\
				      <a href='#' class='modal-action modal-close waves-effect btn'>Não</a>\
				      <a href='#' id='DadosSairSim' class='waves-effect btn'>Sim</a>\
				    </div>\
			";
			$(".mudarConteudo").html(certezaNao);
			$('#DadosModalSair').closeModal();
		});
				

		/* evento quando o usuario clicar em avisos*/
		$(document).on('tap','.secaoAvisos',function() {


			if(Object.keys(AGENDAMENTOS).length == 0){
				toast("Sem disciplinas vinculadas",4000);
				return false;
			}
			if(isOnline() == 1){
				$("#nomeSecao").html("Mural");

				carrega_avisos(AGENDAMENTOS, ALUNOS);
				modifica_tela("conteudoAvisos");

				$('.button-collapse').sideNav('hide');
			}
			else{
				var msgErroAviso = "\
				<div style='margin:50px;'>\
					<h5>Para acessar o mural é necessário uma conexão com a Internet.</h5>\
				</div>\
				";
				$(".msgErroAviso").html(msgErroAviso);
				
			}
			return false;
		});		

		/*Evento para o usuario abrir a configuracao do aplicativo*/
		$(document).on('tap','.config',function() {
			if(isOnline() == 1){
				$("#nomeSecao").html("Configuração");

				modifica_tela("conteudoConfig");
				carrega_configuracao();

				$('.button-collapse').sideNav('hide');
			}else{
				if( $('.toast').length != 1){
					toast("Sem conexão com Internet.", 4000);
				}
			}
			return false;
		});


		/*Evento para voltar o dropdown menu lateral quando selecionado uma opção*/
		$(document).on('touchstart','.dropdown-button',function() {
			var clicou = this;
			$('.dropdown-content').each(function() {
				if (this.id!=$(clicou).attr('data-activates')) {
					$(this).hide();
				} 
			});
		});
		/* Evento para funcionar a seta de todos os select */
		$(document).on('tap','.select-wrapper > i',function(e){
			$($(this).context.previousSibling).click();
			e.stopPropagation();
			e.stopImmediatePropagation();
		});


		/*Evento para melhorar a usabilidade do switch da opção 'Entrega Online' do Agendamento e caso ON mostre as horas*/
		$(document).on('touchstart','.switch',function(e){
			$(this.children[0]).click();
			e.stopPropagation();
			e.stopImmediatePropagation();
			return false;
		});

		/*Evento para realizar o scroll automatico da tela na postagem de notas */
		$(document).on('focus','.NotaDeAlunos',function(){
			scrollTo(0,this.offsetTop-150);
		});

		/*Evento para deletar qualquer agendamento selecionado pelo usuário*/
		$(document).on('tap','.deletarSim',function(){
			carrega_deleta_agendamento($(this).attr('data-disciplina'), $(this).attr('data-idDaEtapa'), $(this).attr('data-idDoAgendamento'));

		});
		
		/*Evento para modificar as opções do formulário de inserir agendamento*/
		$(document).on("change", ".inserirSelecionarTipo", function(){

			$("#camposDasDescricoes").css("-webkit-appearance","none");
			$("#camposDasDescricoes").css("box-shadow","#fff");
			$("#camposDasNotas").css("-webkit-appearance","none");
			$("#camposDasNotas").css("box-shadow","#fff");
			$("#camposDasAps").css("-webkit-appearance","none");
			$("#camposDasAps").css("box-shadow","#fff");
			$("#camposDasDatas").css("-webkit-appearance","none");
			$("#camposDasDatas").css("box-shadow","#fff");

			
			var opcao = this.value;

			if ($(".SelecionarHoras").is(":checked") === true){}
			else{
				$(".SelecionarHoras").prop("checked", true);
			}

			if(opcao == 0){
				$(".lugarDoCampoNota").show();
				$(".aps").hide();
				$(".entrega").hide();
				$(".apsEntrega").hide();
				$(".horasAPS").hide();
				$(".SelecionarHoras").prop("checked", false);
			}
			else if(opcao >= 1 && opcao <= 5){
				$(".lugarDoCampoNota").show();
				$(".entrega").show();
				$(".aps").hide();
				$(".apsEntrega").hide();
				$(".horasAPS").show();
				$(".SelecionarHoras").prop("checked", true);
			}
			else if(opcao == 7){
				var valeNota = "\
				<div class='apsEntrega'>\
					<div class='col s6'>\
						Vale nota:\
					</div>\
					<div class='col s6' style='margin-bottom: 10px;'>\
						<div class='switch '>\
							<label>\
								Não\
								<input type='checkbox' class='valeNota'>\
								<span class='lever'></span>\
								Sim\
							</label>\
						</div>\
					</div>\
				</div>\
				";
				$(".aps").show();
				$(".apsEntrega").show();
				$(".horasAPS").show();
				$(".entrega").hide();
				$(".entregaNotass").html(valeNota);
				$(".SelecionarHoras").prop("checked", true);
				$(".valeNota").prop("checked", true);
			}
		});

		/*Evento para modificar as opções do formulário de modificar agendamento*/
		$(document).on("change", ".modificarSelecionarTipo", function(){

			$("#camposDasDescricoes").css("-webkit-appearance","none");
			$("#camposDasDescricoes").css("box-shadow","#fff");
			$("#camposDasNotas").css("-webkit-appearance","none");
			$("#camposDasNotas").css("box-shadow","#fff");
			$("#camposDasAps").css("-webkit-appearance","none");
			$("#camposDasAps").css("box-shadow","#fff");
			$("#camposDasDatas").css("-webkit-appearance","none");
			$("#camposDasDatas").css("box-shadow","#fff");


			var opcao = this.value;

			if ($(".SelecionarHoras").is(":checked") === true){}
			else{
				$(".SelecionarHoras").prop("checked", true);
			}


			if(opcao == 0){
				$(".lugarDoCampoNota").show();
				$(".aps").hide();
				$(".entregaModifica").hide();
				$(".apsEntrega").hide();
				$(".horasAPS").hide();
				$(".SelecionarHoras").prop("checked", false);
				
			}
			else if(opcao >= 1 && opcao <= 5){
				$(".lugarDoCampoNota").show();
				$(".entregaModifica").show();
				$(".aps").hide();
				$(".apsEntrega").hide();
				$(".horasAPS").show();
				$(".SelecionarHoras").prop("checked", true);
			}
			else if(opcao == 7){
				var valeNotaModifica = "\
				<div class='apsEntrega'>\
					<div class='col s6'>\
						Vale nota:\
					</div>\
					<div class='col s6' style='margin-bottom: 10px;'>\
						<div class='switch '>\
							<label>\
								Não\
								<input type='checkbox' class='valeNota'>\
								<span class='lever'></span>\
								Sim\
							</label>\
						</div>\
					</div>\
				</div>\
				";
				$(".aps").show();
				$(".apsEntrega").show();
				$(".horasAPS").show();
				$(".entregaModifica").hide();
				$(".entregaNotasModifica").html(valeNotaModifica);
				$(".SelecionarHoras").prop("checked", true);
				$(".valeNota").click();
			}
		});

		/*Evento para modificar o campo de nota caso for selecionado a opcao APS na criação/modificacao de agendamento*/
		$(document).on("change", ".valeNota", function(){
			if ($(".valeNota").is(":checked") === true){
				$(".lugarDoCampoNota").show();
			}
			if($(".valeNota").is(":checked") === false){
				$(".lugarDoCampoNota").hide();
				$("#editaCamposDasNotas > input").attr("value",0);
			}

		});
		/*Evento para modificar o campo de nota caso for selecionado a opcao APS na criação/modificacao de agendamento*/
		$(document).on("change", ".valeNotaModifica", function(){
			if ($(".valeNota").is(":checked") === true){
				$(".lugarDoCampoNota").show();
			}
			if($(".valeNota").is(":checked") === false){
				$(".lugarDoCampoNota").hide();
				$("#editaCamposDasNotas > input").attr("value",0);
			}

		});

		/*Evento para tratamento de numero digitados em notas*/
		$(document).on("keypress", "input[type=number]", function(key){
			var a = key.charCode;
			if( (a >= 48 && a <= 57) || (a>=96 && a<=105) || (a == 46) || (a==8) 
				|| (a== 188) || (a== 190)){
				
			}
			else{

				return false;
			}
		});

		/*funcao para inserir a interface da tela de pin*/
		function telaDePin(){

			var pin = "\
			<div style='text-align:center;' class='tituloDoComando'></div>\
			<div style='margin-top:50px;'>\
			<div class='row'>\
					<div class='col s3 teclado'>\
						<i class='mdi-image-panorama-fisheye primeiraBola'></i>\
					</div>\
					<div class='col s3 teclado'>\
						<i class='mdi-image-panorama-fisheye segundaBola'></i>\
					</div>\
					<div class='col s3 teclado'>\
						<i class='mdi-image-panorama-fisheye terceiraBola'></i>\
					</div>\
					<div class='col s3 teclado'>\
						<i class='mdi-image-panorama-fisheye quartaBola'></i>\
					</div>\
				</div>\
				<div style='margin-top:100px;'></div>\
				<form>\
					<div class='row'>\
						<div class='col s4'>\
							<div data-number='1' class='circle-number '>\
								1\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='2' class='circle-number '>\
								2\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='3' class='circle-number '>\
								3\
							</div>\
						</div>\
				    </div>\
				    <div class='row'>\
						<div class='col s4'>\
							<div data-number='4' class='circle-number '>\
								4\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='5' class='circle-number '>\
								5\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='6' class='circle-number '>\
								6\
							</div>\
						</div>\
				    </div>\
				    <div class='row'>\
						<div class='col s4'>\
							<div data-number='7' class='circle-number '>\
								7\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='8' class='circle-number '>\
								8\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='9' class='circle-number '>\
								9\
							</div>\
						</div>\
				    </div>\
				    <div class='row'>\
						<div class='col s4 offset-s4'>\
							<div data-number='0' class='circle-number '>\
								0\
							</div>\
						</div>\
				    </div>\
				</form>\
				<div class='row'>\
					<div class='col s4 offset-s8 cancelarPin'>\
					Cancelar\
					</div>\
			    </div>\
			</div>\
			";
			
			return pin;
		}

		var pin = Array();
		var confirmaPin = Array();
		var tamanho=0;



		/*Evento para configuração ao clicar em ativar codigo PIN*/
		$(document).on("change", "#cadastrarPin", function(){

			modifica_tela("conteudoPin");
			$("#conteudoPin").html( telaDePin() );
			$(".tituloDoComando").html("Escreva sua senha PIN");

		});

		/*Evento para deletar um PIN do usuario*/
		$(document).on("tap", "#deletarPin", function(){
			if(isOnline() != 1){
				toast("Sem conexão com Internet.", 4000);
				return false;
			}
			//var page = prefix+"adx/mobile/professor/escrita/pin.php";
			var page = prefix+unidade+"/mobile/professor/escrita/pin.php";
			$.ajax({
					url: page,
					data: { 
						pin: pin.join(""),
						codUsuario: LOGIN.professor,
						controle: "delete"
					}, 
					dataType: "text",
					method: "post",
				}).done(function(data){
					if(data == "DELETADO"){
						pin = Array();
						confirmaPin = Array();
						tamanho=0;
						LOGIN.pin = null;
						localStorage.setItem("login", JSON.stringify(LOGIN));
						modifica_tela("conteudoInicial");
						toast("Senha PIN Removido.", 4000);
					}

				}).fail(function(a,b,c){
					console.log(a);
					console.log(b);
					console.log(c);
				});
			return false;
		});

		/*Evento para cancelar o processo de inserir um PIn*/
		$(document).on("tap",".cancelarPin", function(){
			pin = Array();
			confirmaPin = Array();
			tamanho=0;
			modifica_tela("conteudoConfig");
			$("#cadastrarPin").prop("checked", false);

		});

		/*Envento para salvar e enviar um PIN para o servidor*/
		$(document).on("tap", ".circle-number", function(){
			var valor = parseInt( $(this).attr("data-number") );
			console.log(valor);
			if(tamanho < 3){
				if(pin.length < 4){
					pin[tamanho] = valor;
				}else{
					confirmaPin[tamanho] = valor;
				}
				if(tamanho == 0){$('.primeiraBola').removeClass("mdi-image-panorama-fisheye").addClass("mdi-image-lens");}
				if(tamanho == 1){$('.segundaBola').removeClass("mdi-image-panorama-fisheye").addClass("mdi-image-lens");}
				if(tamanho == 2){$('.terceiraBola').removeClass("mdi-image-panorama-fisheye").addClass("mdi-image-lens");}
				tamanho++;
			}else if(tamanho == 3){
				if(pin.length < 4){
					pin[tamanho] = valor;
				}else{
					confirmaPin[tamanho] = valor;
				}
				$('.quartaBola').removeClass("mdi-image-panorama-fisheye").addClass("mdi-image-lens");
				if( $("#conteudoPinConfirma").css("display") != "block" ){
					modifica_tela("conteudoPinConfirma");
					$("#conteudoPinConfirma").html( telaDePin() );
					$(".tituloDoComando").html("Confirme sua senha PIN");
				}
				tamanho = 0;
			}
			if(pin.length == 4 && confirmaPin.length == 4){

				if( pin.join("") == confirmaPin.join("") ){

					//var page = prefix+"adx/mobile/professor/escrita/pin.php";
					var page = prefix+unidade+"/mobile/professor/escrita/pin.php";
					$.ajax({
							url: page,
							data: { 
								pin: md5( pin.join("") ),
								codUsuario: LOGIN.professor,
								controle: "inserir"
							}, 
							dataType: "text",
							method: "post",
						}).done(function(data){

							LOGIN.pin = data;
							localStorage.setItem("login", JSON.stringify(LOGIN));
							modifica_tela("conteudoInicial");
							toast("Senha PIN Cadastrado.", 4000);
							pin = Array();
							confirmaPin = Array();
							tamanho=0;

						}).fail(function(a,b,c){
							console.log(a);
							console.log(b);
							console.log(c);
						});

				}else{
					toast("A senha PIN não confirma", 10000);
					modifica_tela("conteudoConfig");
					$("#cadastrarPin").prop("checked", false);
					pin = Array();
					confirmaPin = Array();
					tamanho=0;
				}
			}
			return false;
		});
		

		$(document).on("change", "#colocarAsOpcoes", function(){
			var campo = "\
				<input id='camposDasDatas' name='insereDataAgendamento' type='date' class='datepicker'>\
				<label class='active'>Data do Agendamento</label>\
			";
			$("#inserirCampoDasDatas").html(campo);
			var valor = this.value;
			var option = $("#colocarAsOpcoes > option[value = "+valor+"]").html();
			if(option == "Selecione a Etapa"){
				$("#inserirCampoDasDatas").html("");
			}
			for(var i=0;i<ETAPA.length;i++){
				if(option == ETAPA[i].etapas){
					var diaInicioEtapa = parseInt(ETAPA[i].dataInicio.split("-")[2].replace(/^(0+)(\d)/g,"$2"));
					var mesInicioEtapa = parseInt(ETAPA[i].dataInicio.split("-")[1].replace(/^(0+)(\d)/g,"$2"));
					var anoInicioEtapa = parseInt(ETAPA[i].dataInicio.split("-")[0].replace(/^(0+)(\d)/g,"$2"));
					var dataInicioEtapaCompleta = new Date(anoInicioEtapa, mesInicioEtapa-1, diaInicioEtapa, 0, 0, 0, 0);

					var diaFimEtapa = parseInt(ETAPA[i].dataFim.split("-")[2].replace(/^(0+)(\d)/g,"$2"));
					var mesFimEtapa = parseInt(ETAPA[i].dataFim.split("-")[1].replace(/^(0+)(\d)/g,"$2"));
					var anoFimEtapa = parseInt(ETAPA[i].dataFim.split("-")[0].replace(/^(0+)(\d)/g,"$2"));
					var dataFimEtapaCompleta = new Date(anoFimEtapa, mesFimEtapa-1, diaFimEtapa, 0, 0, 0, 0);

					var diaLimiteEtapa = parseInt(ETAPA[i].dataLimite.split("-")[2].replace(/^(0+)(\d)/g,"$2"));
					var mesLimiteEtapa = parseInt(ETAPA[i].dataLimite.split("-")[1].replace(/^(0+)(\d)/g,"$2"));
					var anoLimiteEtapa = parseInt(ETAPA[i].dataLimite.split("-")[0].replace(/^(0+)(\d)/g,"$2"));
					var dataLimiteEtapaCompleta = new Date(anoLimiteEtapa, mesLimiteEtapa-1, diaLimiteEtapa, 0, 0, 0, 0);

					var input_get__min1 = $( '#camposDasDatas' ).pickadate({
				        min: [anoInicioEtapa,mesInicioEtapa-1,diaInicioEtapa],
				        max: [anoFimEtapa,mesFimEtapa-1,diaFimEtapa]
				    });
				}
			}
			return false;
		});



		/*Evento para enviar os avisos*/
		$(document).on("submit", "#enviaAvisosFormulario", function(){
			var codDisciplinaMensagem = $(this).find('select[name=turmaDaMensagem]'), codDisciplinaMensagem = codDisciplinaMensagem.val(); 
			var assuntoDaMensagem = $(this).find('input[name=conteudoAssuntoMensagem]'), assuntoDaMensagem = assuntoDaMensagem.val();
			var textoDaMensagem = $(this).find('textarea[name=conteudoTextoMensagem]'), textoDaMensagem = textoDaMensagem.val();
			var dataDoInicioMensagem = $(this).find('input[name=conteudoDataInicio]'), dataDoInicioMensagem = dataDoInicioMensagem.val();
			var dataDoFimMensagem = $(this).find('input[name=conteudoDataFim]'), dataDoFimMensagem = dataDoFimMensagem.val();
			

						
			if(assuntoDaMensagem == "" || textoDaMensagem == "" || dataDoInicioMensagem == "" || dataDoFimMensagem == ""){
				if(assuntoDaMensagem == ""){
					toast('Erro no preenchimento - Assunto!', 4000);
					$("#assuntoMensagem").css("-webkit-appearance","none");
					$("#assuntoMensagem").css("box-shadow","0px 0px 4px #FF0000");
					$("#assuntoMensagem").css("border-radius","5px");
				}
				else{
					$("#assuntoMensagem").css("box-shadow","#fff");
				}

				if(textoDaMensagem == ""){
					toast('Erro no preenchimento - Texto!', 4000);
					$("#avisoMensagem").css("-webkit-appearance","none");
					$("#avisoMensagem").css("box-shadow","0px 0px 4px #FF0000");
					$("#avisoMensagem").css("border-radius","5px");	
				}
				else{
					$("#avisoMensagem").css("box-shadow","#fff");
				}


				if(dataDoInicioMensagem == ""){
					toast('Erro no preenchimento - Data Início!', 4000);
					$("#primeiraData").css("-webkit-appearance","none");
					$("#primeiraData").css("box-shadow","0px 0px 4px #FF0000");
					$("#primeiraData").css("border-radius","5px");
				}

				if(dataDoFimMensagem == ""){
					toast('Erro no preenchimento - Data Final!', 4000);
					$("#segundaData").css("-webkit-appearance","none");
					$("#segundaData").css("box-shadow","0px 0px 4px #FF0000");
					$("#segundaData").css("border-radius","5px");
				}

				if(dataDoInicioMensagem != "" && dataDoFimMensagem != ""){
					$("#primeiraData").css("box-shadow","#fff");
					$("#segundaData").css("box-shadow","#fff");
				}
				return false;
			}
			else{ // se todos os campos estiverem preenchidos
				$("#assuntoMensagem").css("box-shadow","#fff");
				$("#avisoMensagem").css("box-shadow","#fff");
				var diaInicio = parseInt(dataDoInicioMensagem.split("/")[0].replace(/^(0+)(\d)/g,"$2"));
				var diaFim = parseInt(dataDoFimMensagem.split("/")[0].replace(/^(0+)(\d)/g,"$2"));
				var mesInicio = parseInt(dataDoInicioMensagem.split("/")[1].replace(/^(0+)(\d)/g,"$2"));
				var mesFim = parseInt(dataDoFimMensagem.split("/")[1].replace(/^(0+)(\d)/g,"$2"));
				var anoInicio = parseInt(dataDoInicioMensagem.split("/")[2]);
				var anoFim = parseInt(dataDoFimMensagem.split("/")[2]);

				var Inicio = new Date( anoInicio, (mesInicio-1), diaInicio, 0, 0, 0, 0);
				var Fim = new Date( anoFim, (mesFim-1), diaFim, 0, 0, 0, 0);
				

				if(Inicio > Fim){
					toast('Data Início é maior que Data Final', 4000);
					$("#primeiraData").css("-webkit-appearance","none");
					$("#primeiraData").css("box-shadow","0px 0px 4px #FF0000");
					$("#primeiraData").css("border-radius","5px");
					$("#segundaData").css("-webkit-appearance","none");
					$("#segundaData").css("box-shadow","0px 0px 4px #FF0000");
					$("#segundaData").css("border-radius","5px");
					return false;
				}else{
					$("#primeiraData").css("box-shadow","#fff");
					$("#segundaData").css("box-shadow","#fff");
				}
				

				if(listaAlunosMensagem == ""){
					if(codDisciplinaMensagem == 0){ //se o professor quiser enviar mensagem para todas as suas disciplinas
						enviaAviso(codDisciplinaMensagem,assuntoDaMensagem,textoDaMensagem,dataDoInicioMensagem,dataDoFimMensagem,listaAlunosMensagem = 1);				
					}
					else{
						enviaAviso(codDisciplinaMensagem,assuntoDaMensagem,textoDaMensagem,dataDoInicioMensagem,dataDoFimMensagem,listaAlunosMensagem = 0);			
					}
				}
				else{
					enviaAviso(codDisciplinaMensagem,assuntoDaMensagem,textoDaMensagem,dataDoInicioMensagem,dataDoFimMensagem,listaAlunosMensagem);
				}
				listaAlunosMensagem = [];
				modifica_tela("conteudoInicial");
				return false;
			}




		});

		/*Evento para enviar o formulario da frequencia das disciplinas*/
		$(document).on("submit", "#formModificaFrequencia", function(){
				var disciplina = $("#recebeDataSelecionada").attr('class');
				var dataSelecionada = $("#recebeDataSelecionada").text();
				var i = 0;
				dataSelecionada = dataSelecionada.split(": ")[1];
				
				var faltasAula1 = Array();
				var faltasAula2 = Array();
				var faltasAula3 = Array();
				var faltasAula4 = Array();


				var campoDosInput = $(".Aula").each(function(){
					if( $(this)[0].checked == true ){}

					else{

							if($(this).attr("id").split("_")[1] == "0"){
								var codAula = $(this).attr("id").split("_")[2];
								faltasAula1.push({"aluno":codAula});
							}
							else if($(this).attr("id").split("_")[1] == "1"){
								var codAula2 = $(this).attr("id").split("_")[2];
								faltasAula2.push({"aluno":codAula2});
							}
							else if($(this).attr("id").split("_")[1] == "2"){
								var codAula3 = $(this).attr("id").split("_")[2];
								faltasAula3.push({"aluno":codAula3});
							}
							else if($(this).attr("id").split("_")[1] == "3"){
								var codAula4 = $(this).attr("id").split("_")[2];
								faltasAula4.push({"aluno":codAula4});
							}

					}

				});

				alteraFrequencia(disciplina, dataSelecionada, faltasAula1, faltasAula2, faltasAula3, faltasAula4);
				toast('Frequencia Modificada com Sucesso!', 4000);
				modifica_tela("conteudoInicial");
				return false;
			});