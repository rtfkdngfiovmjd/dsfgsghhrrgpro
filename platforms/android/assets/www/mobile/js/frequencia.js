

function carrega_frequencia (disciplina){
	
	modifica_tela("selecionaData");
	codDisciplina = $(disciplina).attr('id').split("_")[1];
	

	var today = new Date();
	var dd = ("0" + today.getDate()).slice(-2);
	var mm = ("0" + (today.getMonth() + 1)).slice(-2); //January is 0!
	var yyyy = today.getFullYear();

	today = dd+'/'+mm+'/'+yyyy;

	var calendario = "\
	<div style='margin: 50% 30px;'>\
		<strong>Escolha a data:</strong>\
		<input id='demo__api-get--value' type='text' class='datepicker' value='"+today+"'>\
		<button class='waves-effect waves-light light-blue btn center-align voltarMenu'>Voltar</button>\
		<button id='button__api-get--value' class='waves-effect waves-light light-blue btn center-align irChamada' type='submit'>Entrar</button>\
	</div>\
	";

	$("#selecionaData").html(calendario);

		var dts = Array();
		for(cod in DATAS[codDisciplina]){
			dts.push(DATAS[codDisciplina][cod].datas);
		}
		dts.unshift(true);
		var dt = $('.datepicker').pickadate({

			disable: dts

		});


	$(".voltarMenu").click(function(){
		modifica_tela("conteudoFrequencia");
	});

	$(document).on("tap", ".irChamada", function(){
		//$(".picker__holder").hide(); NAO SEI PQ TINHA ISSO


		var idFrequencia= $(disciplina).attr('id').split("_")[1];
		var button_get__value = $( '#button__api-get--value' );
		var input_get__value = $( '#demo__api-get--value' ).pickadate();
		var picker_get__value = input_get__value.pickadate( 'picker' );
		var dataSelecionada = picker_get__value.get('value', 'dd/mm/yyyy');

		if(dataSelecionada === null || dataSelecionada == ""){
			if( $('.toast').length != 1 ){
				toast("Selecione uma data.");
			}
			return false;
		}

		for(dataDeAula in FREQUENCIA[idFrequencia].datas){
			var controle = 0;
			if(dataSelecionada == dataDeAula){
				controle = 0;
				break;
			}
			else{
				controle = 1;
			}
		}


		// controle de etapas que estao ativas
		var dataEtapa1 = ETAPA[0].dataLimite;
		var finalEtapa1 = new Date( dataEtapa1.split("-")[0], (dataEtapa1.split("-")[1])-1, dataEtapa1.split("-")[2], 23, 59, 59, 0 );
		var dataInicioEtapa1 = ETAPA[0].dataInicio;
		var inicioEtapa1 = new Date( dataInicioEtapa1.split("-")[0], (dataInicioEtapa1.split("-")[1])-1, dataInicioEtapa1.split("-")[2], 0, 0, 0, 0 );
		var dataFimEtapa1 = ETAPA[0].dataFim;
		var fimEtapa1 = new Date( dataFimEtapa1.split("-")[0], (dataFimEtapa1.split("-")[1])-1, dataFimEtapa1.split("-")[2], 0, 0, 0, 0 );

		var dataEtapa2 = ETAPA[1].dataLimite;
		var finalEtapa2 = new Date( dataEtapa2.split("-")[0], (dataEtapa2.split("-")[1])-1, dataEtapa2.split("-")[2], 23, 59, 59, 0 );
		var dataInicioEtapa2 = ETAPA[1].dataInicio;
		var inicioEtapa2 = new Date( dataInicioEtapa2.split("-")[0], (dataInicioEtapa2.split("-")[1])-1, dataInicioEtapa2.split("-")[2], 0, 0, 0, 0 );
		var dataFimEtapa2 = ETAPA[1].dataFim;
		var fimEtapa2 = new Date( dataFimEtapa2.split("-")[0], (dataFimEtapa2.split("-")[1])-1, dataFimEtapa2.split("-")[2], 0, 0, 0, 0 );

		var dataEtapa3 = ETAPA[2].dataLimite;
		var finalEtapa3 = new Date( dataEtapa3.split("-")[0], (dataEtapa3.split("-")[1])-1, dataEtapa3.split("-")[2], 23, 59, 59, 0 );
		var dataInicioEtapa3 = ETAPA[2].dataInicio;
		var inicioEtapa3 = new Date( dataInicioEtapa3.split("-")[0], (dataInicioEtapa3.split("-")[1])-1, dataInicioEtapa3.split("-")[2], 0, 0, 0, 0 );
		var dataFimEtapa3 = ETAPA[2].dataFim;
		var fimEtapa3 = new Date( dataFimEtapa3.split("-")[0], (dataFimEtapa3.split("-")[1])-1, dataFimEtapa3.split("-")[2], 0, 0, 0, 0 );



		var diaDeHoje = new Date();

		var dataSelecionada2 = new Date( dataSelecionada.split("/")[2], (dataSelecionada.split("/")[1])-1, dataSelecionada.split("/")[0], 0, 0, 0, 0 );

		
		if(dataSelecionada2 < fimEtapa1){
			if(diaDeHoje > finalEtapa1){
				if(dataSelecionada2 > inicioEtapa2){}
				else{
					if( $('.toast').length != 1 ){
						toast("Data está bloqueada pela etapa.", 4000);
					}
					return false;
				}
			}
		}
		else if(dataSelecionada2 < fimEtapa2){
			if(diaDeHoje > finalEtapa2){
				if(dataSelecionada2 > inicioEtapa3){}
				else{
					if( $('.toast').length != 1 ){
						toast("Data está bloqueada pela etapa.", 4000);
					}
					return false;
				}
			}
		}
		else if(dataSelecionada2 < fimEtapa3){
			if(diaDeHoje > finalEtapa3){
				if( $('.toast').length != 1 ){
					toast("Data está bloqueada pela etapa.", 4000);
				}
				return false;
			}
		}





		if(controle == 1){
			if( $('.toast').length != 1 ){
				toast("Professor não possui aula nesse dia.", 4000);
			}
			return false;
		}

		modifica_tela("chamada");
		var listaDeAlunoChamada = "\
			<form id='formModificaFrequencia'>\
				<div class='row center-align'>\
					<div class='col s6'>\
						<a href='#' class='voltarcalendario waves-effect waves btn-flat'><i class='mdi-navigation-arrow-back left'></i>VOLTAR</a>\
					</div>\
					<div class='col s6'>\
						<a class='voltaMenuInicial waves-effect waves btn-flat'><i class='mdi-action-home left'></i>INÍCIO</a>\
					</div>\
				</div>\
				<h5>Lista de Alunos</h5>\
				<p>Disciplina: "+$(disciplina).html()+"</p>\
				<p id='recebeDataSelecionada' class='"+$(disciplina).attr('id').split("_")[1]+"'></p>\
					<div class='row'>\
						<div class='col s7'>\
							<strong>Nome dos alunos</strong>\
						</div>\
						<div class='col s5'>\
							<strong>Encontros</strong>\
						</div>\
					</div>\
				<ul class='collection' id='aqui2'>\
				</ul>\
				<div style='margin-top:50px'></div>\
				<div style='right: 24px; margin-bottom: 0px;'>\
				<div class='row center-align alinharBotao'>\
					<button style='margin-bottom: 0px;' class='waves-effect waves-light light-blue btn voltarcalendario'>Cancelar</button>\
					<input style='margin-bottom: 0px' type='submit' class='btn waves-effect waves-light light-blue' value='Salvar' />\
				</div>\
			</div>\
			</form>\
		";
		$("#chamada").html(listaDeAlunoChamada);



		$(".voltaMenuInicial").click(function(){
			modifica_tela("conteudoInicial");
		});
		



		var mostraData = "Data: "+dataSelecionada;
		$("#recebeDataSelecionada").html(mostraData);


		var alunoss= ALUNOS[idFrequencia].alunos;
		var faltasFrequencia = Array();

		for(cod in FREQUENCIA[idFrequencia].datas[dataSelecionada]){
			faltasFrequencia.push(FREQUENCIA[idFrequencia].datas[dataSelecionada][cod]);
		};

		var arrayAluno = [];
		var x = 0;

		var lista = "\
			<li class='collection-item retiraEspacoFrequencia'>\
				<div id='colocarItemAqui'>\
				</div>\
			</li>\
		";
		$("#aqui2").append(lista);


		for(codalunoss in alunoss){
			var infoAluno = alunoss[codalunoss];
			var itemFrequencia = "\
			<div class='row marginAbaixo'>\
				<div class='col s7 retiraEspacoFrequencia'>"+infoAluno['nome']+"</div>\
					<div id='colocarcheckbox"+codalunoss+"' class='col s5 retiraEspacoFrequencia'>\
					</div>\
				</div>\
			</div>\
			";
			$("#colocarItemAqui").append(itemFrequencia);

				for(var y=0; y < DATAS[idFrequencia][dataSelecionada].qtd; y++ ){
					var check = "\
					<input type='checkbox' class='Aula' id='aula_"+y+"_"+codalunoss+"' checked = 'checked' />\
					<label class='retiraEspacoFrequenciaChecked' for='aula_"+y+"_"+codalunoss+"'></label>\
					";
					$("#colocarcheckbox"+codalunoss+"").append(check);
				};

			arrayAluno[x] = codalunoss;
			x++;
		};
		descobre_faltas(faltasFrequencia, arrayAluno);

			
		$(".voltarcalendario").click(function(){
			modifica_tela("conteudoFrequencia");
			return false;
		});
	});


}

/* Função descobre_faltas() que após a impressão de todos os alunos da disciplina seleciona quem esta ausente.
	
	pega um array dos alunos que possuem faltas
	pega o codigo de todos os alunos da disciplina
	
	ele irá dar presença para todos menos aos alunos que possuem falta
	irá selecionar o id='aula1-'+codigoDoAluno e dar falta nele se ele estiver na lista de faltas
*/
function descobre_faltas(faltasFrequencia, arrayAluno){
	// console.log("falta 01", faltasFrequencia[0], "falta 02",faltasFrequencia[1], "arrya de Aluno",arrayAluno);
	
	for(var i = 0; i < arrayAluno.length; i++) {
		for (var h = 0; h < faltasFrequencia.length; h++) {

			for (var j = 0; j < faltasFrequencia[h].length; j++) {
				if(faltasFrequencia[h][j] == arrayAluno[i] ){
					$("#aula_"+h+"_"+arrayAluno[i]).attr("checked", false);
				}
			};

		};

	};
}