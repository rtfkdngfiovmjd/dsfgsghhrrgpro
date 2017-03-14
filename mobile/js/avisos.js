function carrega_avisos (AGENDAMENTOS, ALUNOS){

		var disc = "\
		<div class='row center-align'>\
			<div class='col s6'>\
				<a class='Menu waves-effect waves btn-flat'><i class='mdi-navigation-arrow-back left'></i>VOLTAR</a>\
			</div>\
			<div class='col s6'>\
				<a class='Menu waves-effect waves btn-flat'><i class='mdi-action-home left'></i>INÍCIO</a>\
			</div>\
		</div>\
		<div>\
			<form id='enviaAvisosFormulario'>\
				<label>Selecione a turma</label>\
				<select name='turmaDaMensagem' id='opcoesAqui'>\
					<option value='' disabled selected>Selecione a turma</option>\
				</select>\
					<div id='addInfor'></div>\
			</form>\
		</div>\
		";
		$("#conteudoAvisos").html(disc);


		$(".Menu").click(function(){
			modifica_tela("conteudoInicial");
		});


	for(codigoDisciplinas in AGENDAMENTOS){
		var codDaDisciplina = AGENDAMENTOS[codigoDisciplinas];

		var listaDisciplina = "\
			<option value='"+codigoDisciplinas+"' >"+codDaDisciplina['nome']+"</option>\
		";
		$("#opcoesAqui").append(listaDisciplina);
	};
		var todos = "\
			<option value='0'>Todas as Turmas</option>\
			";
		$("#opcoesAqui").append(todos);


	$("#opcoesAqui").change(function(){
		$("#addInfor").html("");
		listar_alunos( $(this).val() );
	});

	$('select').material_select();

}

function listar_alunos (codDaDisciplinas){


	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();

	today = dd+'/'+mm+'/'+yyyy;
	if(codDaDisciplinas != 0){
		var selecionarAlunosEspecificos = "\
		<a class='modal-trigger' href='#modalSelecionarAlunos'>\
			<input class='with-gap' type='radio' id='checkAluno"+codDaDisciplinas+"'/>\
			<label for='checkAluno"+codDaDisciplinas+"'>Selecionar alunos</label>\
		</a>\
		";
	}
	else{
		var selecionarAlunosEspecificos = "";
	}

	var selectAlunos = "\
		<div class='row'>\
			"+selecionarAlunosEspecificos+"\
			<div id='modalParaSelecionarAlunos'></div>\
			<div id='contadorDeAlunos'></div>\
			<div class='input-field col s12'>\
				<input placeholder='Assunto da Mensagem' name='conteudoAssuntoMensagem' id='assuntoMensagem' type='text' class='validate'>\
				\
			<div>\
			<div class='input-field col s12'>\
				<i class='mdi-editor-mode-edit prefix'></i>\
				<textarea placeholder='Escreva sua Mensagem' name='conteudoTextoMensagem' id='avisoMensagem' class='materialize-textarea' name='avisoMensagem'></textarea>\
				\
			</div>\
			<div class='input-field col s6'>\
				<label class='active'>Data de Início</label>\
				<input type='date' class='datepicker' name='conteudoDataInicio' id='primeiraData' name='avisoDataInicial'>\
			</div>\
			<div class='input-field col s6'>\
				<label class='active'>Data Final</label>\
				<input type='date' class='datepicker' name='conteudoDataFim' id='segundaData' name='avisoDataFinal'>\
			</div>\
		</div>\
		<div class='row center-align'>\
			<button style='margin-bottom:0px' class='waves-effect waves-light light-blue btn voltarMenuAviso'>Cancelar</button>\
			<input type='submit' class='btn waves-effect waves-light light-blue inputDasNotas' value='Salvar' />\
		</div>\
	";
	$("#addInfor").append(selectAlunos);

	


/*Metodo para inicalizar as datas de inicio e fim da mensagem considerando seleções de datas a partir de Hoje();*/

	var input_get__min1 = $( '#primeiraData' ).pickadate({
	        min: [yyyy,mm,dd]
	    });
    var picker_get__min1 = input_get__min1.pickadate( 'picker' );
    picker_get__min1.get( 'min', 'yyyy/mm/dd' );


	var input_get__min = $( '#segundaData' ).pickadate({
	    min: [yyyy,mm,dd]
	});
    var picker_get__min = input_get__min.pickadate( 'picker' );
    picker_get__min.get( 'min', 'yyyy/mm/dd' );



	$(".voltarMenuAviso").click(function(){
		modifica_tela("conteudoInicial");
		return false;
	});
	$("#botaoEnviarMensagem").click(function(){	
		modifica_tela("conteudoInicial");
	});


	var alu = ALUNOS[codDaDisciplinas];
	var j=0;

	if(alu != undefined){

		$("#checkAluno"+codDaDisciplinas).change(function(){
			for(codAlunos in alu.alunos){
				alun = alu.alunos[codAlunos];
				var ListadeAlunos = "\
					<div id='modalSelecionarAlunos' class='modal'>\
						<div class='row'>\
							<div class='col s10'>\
								<h4 class='black-text'>Selecione</h4>\
							</div>\
							<div class='col s2' style='margin-top:7px;'>\
								<button style='font-size:large; padding:1px;' class='btn-flat waves-effect waves-teal modal-action modal-close black-text'><i class='mdi-navigation-close' style='font-size:2.3rem;'></i></button>\
							</div>\
						</div>\
						<div id='colocarAlunosAqui'>\
						</div>\
						<div class='center-align' style='margin-bottom: 20px;'>\
							<a href='#' class='waves-effect waves-light light-blue btn modal-action modal-close'>Fechar</a>\
						</div>\
					</div>\
				";
				$("#modalParaSelecionarAlunos").append(ListadeAlunos);

				modal_listar_alunos(alun, codAlunos, j);

				$("#selecionarAlunos_"+codAlunos).change(function(){
					if( $(this).is(":checked") ){
						j ++;
					}
					else{
						j --;
					}
					var contador = "<p> "+j+" alunos selecionados</p>";
					$("#contadorDeAlunos").html(contador);
				});
			};
		});
	}
}


var listaAlunosMensagem = Array(); //variavel global desse arquivo

function modal_listar_alunos(alun, codAlunos, j){
	var alunosLista = "\
		<div style='padding: 10px;'>\
			<input type='checkbox' id='selecionarAlunos_"+codAlunos+"'/>\
			<label for='selecionarAlunos_"+codAlunos+"'>"+alun['nome']+"</label>\
			<br />\
		</div>\
	";

	$("#colocarAlunosAqui").append(alunosLista);
	$('.modal-trigger').leanModal();

	$("#selecionarAlunos_"+codAlunos).click(function(){
		if( $(this).is(":checked") ){
			listaAlunosMensagem.push( ($(this).attr("id")).split("_")[1] );
			return (listaAlunosMensagem);
		}
		else{

			var index = listaAlunosMensagem.indexOf(($(this).attr("id")).split("_")[1]);
			listaAlunosMensagem.splice(index, 1);
			return (listaAlunosMensagem);
		}
	});
}
