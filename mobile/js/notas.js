function carrega_notas (disciplina){

	modifica_tela("disciplinasNotas");



	var disc = "\
	<div class='row center-align'>\
		<div class='col s6'>\
			<a class='voltarMenu1  waves-effect waves btn-flat'><i class='mdi-navigation-arrow-back left'></i>VOLTAR</a>\
		</div>\
		<div class='col s6'>\
			<a class='Menu waves-effect waves btn-flat'><i class='mdi-action-home left'></i>INÍCIO</a>\
		</div>\
	</div>\
	<div id='conteudoAg'>\
	</div>\
	";

	$("#disciplinasNotas").html(disc);
	$(".voltarMenu1").click(function(){
		modifica_tela("conteudoNotas");
	});
	$(".Menu").click(function(){
		modifica_tela("conteudoInicial");
	});

		var idNotas= $(disciplina).attr('id').split("_")[1];

		for(etapa in AGENDAMENTOS[idNotas].etapas){
			cod= AGENDAMENTOS[idNotas].etapas[etapa];
			etapaComEspaco = etapa.replace(" ","");//caso a secretaria insira espacos na descricao da ETAPA
			var imprimeEtapas = "\
				<h5>"+etapa+"</h5>\
				<div class='collection' id='entraAqui"+etapaComEspaco+"'></div>\
				\
			";
			$("#conteudoAg").append(imprimeEtapas);
			for(codigoAgendamento in cod){
				var cont = cod[codigoAgendamento];

				if( cont['data'] === null ){
					var semDisciplinas="\
						<div>\
							<p class='center-align'>ATENÇÃO</p>\
							<p class='center-align'>Professor(a) sem agendamentos associados.</p>\
						</div>\
					";
					$("#entraAqui"+etapaComEspaco).append(semDisciplinas);
				}
				
				//Caso um dos elemento forem deletados ele confere os compos do array
				//Esse elemento não é apresentado para o usuário
				else if(cont['tipo'] != "DELETE" || cont['data'] != "DELETE"){

					// controle de etapas que estao ativas
					for(var i=0; i<ETAPA.length;i++){
						if("0"+ETAPA[i].etapas == etapa){
							var dataEtapa = ETAPA[i].dataLimite;
							var finalEtapa = new Date( dataEtapa.split("-")[0], (dataEtapa.split("-")[1])-1, dataEtapa.split("-")[2], 0, 0, 0, 0 );
						}
					}


					var diaDoServidor = new Date( LOGIN.dia.split("-")[0], (LOGIN.dia.split("-")[1])-1, LOGIN.dia.split("-")[2], 0, 0, 0, 0 );				


					//CONTROLE DE ACESSO CASO AGENDAMENTO SER DO PI - NAO PODE EDITAR NOTAS
					if(cont['pi'] == "Sim" || diaDoServidor > finalEtapa){
						var link = "\
						<p style='color: #9e9e9e;' href='#' class='collection-item' data-idetapaNotas='"+etapa+"' data-idagendamentoNotas='"+codigoAgendamento+"' >\
							"+cont['descricao']+"\
							<i style='color: #9e9e9e;' class='secondary-content small mdi-content-send'></i>\
						</p>\
						";
					}
					else if(1 == 1){
						var link = "\
						<a href='#' class='collection-item verNotas' data-idetapaNotas='"+etapa+"' data-idagendamentoNotas='"+codigoAgendamento+"' >\
							"+cont['descricao']+"\
							<i class='secondary-content small mdi-content-send'></i>\
						</a>\
						";
					}

					var conteudoAgendamentos = " "+link+" ";
					$("#entraAqui"+etapaComEspaco).append(conteudoAgendamentos);
				}

			};
		};
		$(".verNotas").click(function(){

			modifica_tela("formNotas");

			carrega_edita_notas(idNotas,$(this).attr('data-idetapaNotas'),$(this).attr('data-idagendamentoNotas') );

			$(".voltarNotas").click(function(){
				modifica_tela("disciplinasNotas");
				return false;
			});
			$(".Menu").click(function(){
				modifica_tela("conteudoInicial");
			});
		});
}

function carrega_edita_notas(disciplina,etapa,codigoAgendamento){
	cont=AGENDAMENTOS[disciplina].etapas[etapa][codigoAgendamento];

	if(cont['nota'] == "" ||  cont['nota'] == "0" ||  cont['nota'] === "NULL" || cont['nota'] === null ){
		var textNota = "";
		var textAPS = "<p> Valor APS: "+cont['aps']+" horas </p>";
		var somenteAPS = 1;
		var somenteNota = 0; 
	}
	else if (cont['aps'] == "" ||  cont['aps'] == "0" ||  cont['aps'] == "NULL" || cont['aps'] === null){
		var textNota = "<p> Valor do Agendamento: "+cont['nota']+" pontos</p>";
		var textAPS = "";
		var somenteAPS = 0;
		var somenteNota = 1;
	}
	else{
		var textNota = "<p> Valor do Agendamento: "+cont['nota']+" pontos</p>";
		var textAPS = "<p> Valor APS: "+cont['aps']+" horas</p>";

		var somenteAPS = 1;
		var somenteNota = 1;
	}

	var formHead = "\
	<div class='row center-align'>\
		<div class='col s6'>\
			<a class='voltarNotas waves-effect waves btn-flat'><i class='mdi-navigation-arrow-back left'></i>VOLTAR</a>\
		</div>\
		<div class='col s6'>\
			<a class='Menu waves-effect waves btn-flat'><i class='mdi-action-home left'></i>INÍCIO</a>\
		</div>\
	</div>\
		<h5>Lista de Alunos</h5>\
		<p> Agendamento: "+cont['descricao']+"</p>\
		<p> Data de Entrega: "+cont['data']+"</p>\
		"+textNota+"\
		"+textAPS+"\
		<form id='formAlteraNota'>\
			<ul class='collection'>\
				<div id='formAqui'></div>\
			</ul>\
			<div style='margin-top:50px'></div>\
			<div style='right: 24px; margin-bottom: 0px;'>\
				<div class='row center-align alinharBotao'>\
					<button style='margin-bottom: 0px;' class='waves-effect waves-light light-blue btn voltarNotas'>Cancelar</button>\
					<input type='submit' class='btn waves-effect waves-light light-blue inputDasNotas' value='Salvar' />\
				</div>\
			</div>\
		</form>\
		<div id='preloader'></div>\
	</div>\
	";
	$("#formNotas").html(formHead);


	for(codAlunos in ALUNOS[disciplina].alunos){

		var situacaoNota = AGENDAMENTOS[disciplina].etapas[etapa][codigoAgendamento].nota;
		var situacaoAPS = AGENDAMENTOS[disciplina].etapas[etapa][codigoAgendamento].aps;


		var dadosAlunos = ALUNOS[disciplina].alunos[codAlunos];
		var grade = NOTAS[disciplina].notas[etapa][codigoAgendamento][codAlunos].nota;
		var valorAps = NOTAS[disciplina].notas[etapa][codigoAgendamento][codAlunos].aps;
		var stado = valorAps;

		
		if(stado == false || stado === null || stado == "NULL" || stado == "nao"){
			stado = "";
		}
		else {
			stado = "checked";
		};

		
		if(somenteNota == 1 && somenteAPS == 1){
			var formBody1 = "\
				<li class='collection-item center-align'>\
					<div class='row valign-wrapper'>\
						<div class='col s6'>"+dadosAlunos['nome']+"</div>\
						<div class='col s3'>\
								<div>\
									Nota:<input name='notaDoAluno' id='nota_"+codAlunos+"' class='NotaDeAlunos center-align' type='number' value='"+grade+"' step='any' />\
								</div>\
						</div>\
						<div class='col s3'>\
								<div class='center-align'>\
									APS:<input name='apsDoAluno_"+codAlunos+"' id='aps_"+codAlunos+"' type='checkbox' "+stado+"/>\
									<label for='aps_"+codAlunos+"'></label>\
								</div>\
						</div>\
					</div>\
				</li>\
			";
			$("#formAqui").append(formBody1);

		}
		else if( somenteNota == 0 && somenteAPS == 1 ){
			var formBody2 = "\
			<li class='collection-item center-align'>\
				<div class='row valign-wrapper'>\
					<div class='col s6'>"+dadosAlunos['nome']+"</div>\
						<div class='col s3 offset-s2'>\
							<div class='center-align'>\
								APS:<input name='apsDoAluno' id='test_"+codAlunos+"' class='ApsDosAlunos' type='checkbox' "+stado+"/>\
								<label for='test_"+codAlunos+"'></label>\
							</div>\
						</div>\
					</div>\
			</li>\
			";
			$("#formAqui").append(formBody2);

		}
		else if( somenteNota == 1 && somenteAPS == 0 ){
			var formBody3 = "\
				<li class='collection-item center-align'>\
					<div class='row valign-wrapper'>\
						<div class='col s6'>"+dadosAlunos['nome']+"</div>\
							<div class='col s3 offset-s2'>\
							<div>\
								Nota:<input id='soNota_"+codAlunos+"' name='soNotaDoAluno' class='NotaDeAlunos center-align' type='number' value='"+grade+"' step='any' />\
							</div>\
						</div>\
						</div>\
					</div>\
				</li>\
			";
			$("#formAqui").append(formBody3);
		}
	};
	
		$("#formAlteraNota").on("submit", function(){
				var valoresNotasEAps = Array();
				var valoresNotas = Array();
				var valoresAps = Array();
				var cod = Array();
				var Nota = Array();
				var Aps = Array();
				var input = Array();

				if(somenteNota == 1 && somenteAPS == 1){

					var campoDosInput = $(".NotaDeAlunos").each(function(){
						cod = $(this).attr("id").split("_")[1];
						Nota = $(this).val();
						Aps = $("#aps_"+cod).prop("checked");

						if(Nota == ""){
                        	Nota = 0;
                    	}
                    	if(Aps === true){
							Aps = "sim";
						}
						if(Aps === false){
						}

						if( $("#nota_"+cod).val() < 0){
							$(this).css("-webkit-appearance","none");
							$(this).css("box-shadow","0px 0px 4px #FF0000");
							$(this).css("border-radius","5px");
							estado = 1;

						}
						else{
							$(this).css("-webkit-appearance","none");
							$(this).css("box-shadow","#fff");
						}

						valoresNotasEAps.push({"codAluno":cod, "Notas":Nota, "APS":Aps});
						input.push( {inputs: $(this)} );
					});
					if(estado != 1){
						var result = alteraNota(disciplina,etapa,codigoAgendamento, cod,valoresNotasEAps, controle=1, input);
						if(result !== false){
							modifica_tela("conteudoInicial");
							toast('Notas Modificadas!', 4000);
						}
					}
					else{
						toast("Erro Notas - Menor que zero.", 4000);
						return false;
					}

				}
				else if(somenteNota == 0 && somenteAPS == 1){
					var campoDosInput = $(".ApsDosAlunos").each(function(){
						cod = $(this).attr("id").split("_")[1];
						Nota = "NULL";
						Aps = $("#test_"+cod).prop("checked");
						if(Aps === true){
							Aps = "sim";
						}
						else{
							Aps = "nao";
						}

						valoresAps.push({"codAluno":cod, "Notas":Nota, "APS":Aps});

					});
						alteraNota(disciplina,etapa,codigoAgendamento, cod,valoresAps,controle=2);
						modifica_tela("conteudoInicial");
						toast('Notas Modificadas!', 4000);

				}
				else if(somenteNota == 1 && somenteAPS == 0){
					var estado = 0;
					var campoDosInput = $(".NotaDeAlunos").each(function(){

						cod = $(this).attr("id").split("_")[1];
						Nota = $(this).val();
						if(Nota == "" || Nota === null){
                        	Nota = "0";
                    	}
						Aps = "NULL";

						if( $("#soNota_"+cod).val() < 0){
							$(this).css("-webkit-appearance","none");
							$(this).css("box-shadow","0px 0px 4px #FF0000");
							$(this).css("border-radius","5px");
							estado = 1;

						}
						else{
							$(this).css("-webkit-appearance","none");
							$(this).css("box-shadow","#fff");
						}
						valoresNotas.push({"codAluno":cod, "Notas":Nota, "APS":Aps});
						
						input.push( {inputs: $(this)} );
						
					});
					if(estado != 1){
						var retorno = alteraNota(disciplina,etapa,codigoAgendamento, cod,valoresNotas,controle=3, input);
						if(retorno !== false){
							modifica_tela("conteudoInicial");
							toast('Notas Modificadas!', 4000);
						}
					}
					else{
						toast("Erro Notas - Menor que zero.", 4000);
						return false;
					}
				}


				
				return false;
			});

}