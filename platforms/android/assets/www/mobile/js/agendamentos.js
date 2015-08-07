function carrega_agendamentos(disciplina) {


			modifica_tela("conteudoInterno");
			

			var string3 = "\
				<div class='row center-align'>\
					<div class='col s4'>\
						<a class='voltar1 waves-effect waves btn-flat'><i class='mdi-navigation-arrow-back left'></i>VOLTAR</a>\
					</div>\
					<div class='col s4'>\
						<a class='Menu waves-effect waves btn-flat'><i class='mdi-action-home left'></i> INÍCIO</a>\
					</div>\
					<div class='col s4'>\
						<a class='waves-effect waves btn-flat' id='addAgendamento'><i class='mdi-content-add left'></i>NOVO</a>\
					</div>\
				</div>\
				<div>\
					<h6 id='aquiDisciplina'></h6>\
					<table class='striped '>\
							<thead>\
								<tr>\
									<th>Etapa</th>\
									<th>Descrição</th>\
									<th>Data</th>\
								</tr>\
							</thead>\
							<tbody id='coisas'>\
							</tbody>\
					</table>\
					<div class='modalDosElementosAgendamento'></div>\
				</div>\
				";

			$("#conteudoInterno").html(string3);

			$(".voltar1").click(function(){
				modifica_tela("conteudoAgendamentos");
			});
			$(".Menu").click(function(){
				modifica_tela("conteudoInicial");
			});

			$("#addAgendamento").click(function(){


				modifica_tela("conteudoAddAgendamento");
				
				cont['online'] = "Não";
				var codigoDeDisciplina = $(disciplina).attr("id").split("_")[1];

				var conteudoAdd = "\
				<div class='row center-align'>\
					<div class='col s6'>\
						<a class='voltar3 waves-effect waves btn-flat'><i class='mdi-navigation-arrow-back left'></i>VOLTAR</a>\
					</div>\
					<div class='col s6'>\
						<a class='Menu waves-effect waves btn-flat'><i class='mdi-action-home left'></i>INÍCIO</a>\
					</div>\
				</div>\
				<div>\
					<h5 style='padding-left:10px;'>Adicionar Agendamento</h5>\
					\
					<div class='row'>\
						<form class='col s12' action='#' id='addAgendamentoFormulario'>\
							<div class='divider'></div>\
							<div class='input-field col s12'>\
								<select id='colocarAsOpcoes' name='insereEtapaAgendamento'>\
									<option value='0'>Selecione a Etapa</option>\
								</select>\
							</div>\
							<div class='input-field col s12'>\
								<textarea id='camposDasDescricoes' name='insereDescricaoAgendamento' class='input-field materialize-textarea'></textarea>\
								<label for='textarea'>Descrição do Agendamento</label>\
							</div>\
							<div class='col s12'>\
								<label>Tipo de Agendamento</label>\
								<select class='inserirSelecionarTipo' name='insereTipoAgendamento'>\
									<option value='0'>Avaliação</option>\
									<option value='1'>Teste</option>\
									<option value='2'>Trabalho Teórico</option>\
									<option value='3'>Trabalho Prático</option>\
									<option value='4'>Trabalho de Campo</option>\
									<option value='5'>Exercício em Classe</option>\
									<!--<option value='6'>Exame especial</option>-->\
									<option value='7'>APS</option>\
								<select>\
							</div>\
							<div class='entregaNotass'></div>\
							<div class='entrega'>\
								<div class='col s6'>\
									Entrega Online:\
								</div>\
								<div class='col s6' style='margin-bottom: 10px;'>\
									<div class='switch '>\
										<label>\
											Não\
											<input name='insereOnlineAgendamento' type='checkbox' class='SelecionarHoras' name='SelecionarHoras'>\
											<span class='lever'></span>\
											Sim\
										</label>\
									</div>\
								</div>\
							</div>\
							<div class='row'>\
								<div class='input-field col s6 lugarDoCampoNota'>\
									<input id='camposDasNotas' name='insereNotaAgendamento' type='number' class='validate'>\
									<label for='formNotas'>Nota</label>\
								</div>\
								<div class='aps input-field col s6'>\
									<input id='camposDasAps' name='insereApsAgendamento' type='number' class='validate'>\
									<label for='formAps'>APS</label>\
								</div>\
							</div>\
							<div class='row'>\
								<div id='inserirCampoDasDatas' class='input-field col s6'>\
									\
								</div>\
								<div class='horasAPS input-field col s6'>\
									<input id='camposDasHoras' name='insereHoraAgendamento' type='time' value='23:59'>\
									<label class='active'>Horas</label>\
								</div>\
							</div>\
							<div class='row'>\
								<div class='input-field col s12 center-align'>\
									<button class='waves-effect waves-light voltar3 light-blue btn'>Cancelar</button>\
									<input type='submit' class='btn waves-effect waves-light light-blue' value='Salvar' />\
								</div>\
							</div>\
							\
						</form>\
				</div>\
				";
				$("#conteudoAddAgendamento").html(conteudoAdd);
				// escondendo os campos que nao fazem parte de defaul: Avaliação
				$(".entrega").hide();
				$(".aps").hide();
				
				
				$('.timepicker').pickatime();
				if(cont['online'] == "Não"){
					$(".horasAPS").hide();
				}

				$('.SelecionarHoras').on('change',function(){
					$(".horasAPS").toggle();
				});


				/*codigo para inserir o valor das etapas ativas quando adicionar o agendamento*/
					var dataEtapa1 = ETAPA[0].dataLimite;
					var finalEtapa1 = new Date( dataEtapa1.split("-")[0], (dataEtapa1.split("-")[1])-1, dataEtapa1.split("-")[2], 0, 0, 0, 0 );

					var dataEtapa2 = ETAPA[1].dataLimite;
					var finalEtapa2 = new Date( dataEtapa2.split("-")[0], (dataEtapa2.split("-")[1])-1, dataEtapa2.split("-")[2], 0, 0, 0, 0 );

					var dataEtapa3 = ETAPA[2].dataLimite;
					var finalEtapa3 = new Date( dataEtapa3.split("-")[0], (dataEtapa3.split("-")[1])-1, dataEtapa3.split("-")[2], 0, 0, 0, 0 );
				

					var diaDoServidor = new Date( LOGIN.dia.split("-")[0], (LOGIN.dia.split("-")[1])-1, LOGIN.dia.split("-")[2], 0, 0, 0, 0 );				



					if(diaDoServidor > finalEtapa1){
						var opcao1 = "\
							<option id='1etapa' disabled value='1'>"+ETAPA[0].etapas+" ("+ETAPA[0].valorDaEtapa+" pontos) -Travado</option>\
						";
						$("#colocarAsOpcoes").append(opcao1);
					}else{
						var opcao1 = "\
							<option id='1etapa' value='1'>"+ETAPA[0].etapas+" ("+ETAPA[0].valorDaEtapa+" pontos)</option>\
						";
						$("#colocarAsOpcoes").append(opcao1);
					}



					if(diaDoServidor > finalEtapa2){
						var opcao2 = "\
							<option id='2etapa' disabled value='2'>"+ETAPA[1].etapas+" ("+ETAPA[1].valorDaEtapa+" pontos) -Travado</option>\
						";
						$("#colocarAsOpcoes").append(opcao2);
					}else{
						var opcao2 = "\
							<option id='2etapa' value='2'>"+ETAPA[1].etapas+" ("+ETAPA[1].valorDaEtapa+" pontos)</option>\
						";
						$("#colocarAsOpcoes").append(opcao2);
					}



					if(diaDoServidor > finalEtapa3){
						var opcao3 = "\
							<option id='3etapa' disabled value='3'>"+ETAPA[2].etapas+" ("+ETAPA[2].valorDaEtapa+" pontos) -Travado</option>\
						";
						$("#colocarAsOpcoes").append(opcao3);
					}else{
						var opcao3 = "\
							<option id='3etapa' value='3'>"+ETAPA[2].etapas+" ("+ETAPA[2].valorDaEtapa+" pontos)</option>\
						";
						$("#colocarAsOpcoes").append(opcao3);
						
					}
						

				$("#addAgendamentoFormulario").on("submit", function(){


					var etapaAgendamento = $(this).find('select[name=insereEtapaAgendamento]'), etapaAgendamento = etapaAgendamento.val(); 

					for(var i=0; i< ETAPA.length; i++){
						if(etapaAgendamento == ETAPA[i].etapas[0]){
							var stringEtapa = ETAPA[i].etapas; // encontra qual e a etapa selecionada
							var total = ETAPA[i].valorDaEtapa;
							var totalPI = (ETAPA[i].valorDaEtapa) - (ETAPA[i].valorPI); // total de pontos dentro de uma etapa que o professor pode postar
							var numeroDaEtapa = i;
						}
					}
					var onlineAgendamento = $(this).find('input[name=insereOnlineAgendamento]'), onlineAgendamento = onlineAgendamento.prop("checked");
					if(onlineAgendamento == true){onlineAgendamento = "Sim";}
					else onlineAgendamento = "Nao";
					var descricaoAgendamento = $(this).find('textarea[name=insereDescricaoAgendamento]'), descricaoAgendamento = descricaoAgendamento.val();
					
					var tipoAgendamento = $(this).find('select[name=insereTipoAgendamento]'), tipoAgendamento = tipoAgendamento.val();
					var notaAgendamento = $(this).find('input[name=insereNotaAgendamento]'), notaAgendamento = notaAgendamento.val();
					var apsAgendamento = $(this).find('input[name=insereApsAgendamento]'), apsAgendamento = apsAgendamento.val();
					
					var dataAgendamento = $(this).find('input[name=insereDataAgendamento]'), dataAgendamento = dataAgendamento.val();
					
					var horaAgendamento = false;
					if(onlineAgendamento == "Sim"){
						var horaAgendamento = $(this).find('input[name=insereHoraAgendamento]'), horaAgendamento = horaAgendamento.val();
					}



					if( descricaoAgendamento != ""){
						$("#camposDasDescricoes").css("-webkit-appearance","none");
						$("#camposDasDescricoes").css("box-shadow","#fff");
					}
					if( notaAgendamento != "" || notaAgendamento != 0){
						$("#camposDasNotas").css("-webkit-appearance","none");
						$("#camposDasNotas").css("box-shadow","#fff");
					}
					if( apsAgendamento != "" || apsAgendamento != 0 ){
						$("#camposDasAps").css("-webkit-appearance","none");
						$("#camposDasAps").css("box-shadow","#fff");
					}	
					if( dataAgendamento != ""){
						$("#camposDasDatas").css("-webkit-appearance","none");
						$("#camposDasDatas").css("box-shadow","#fff");
					}




					// verifica se o usuario conseguiu selecionar uma etapa travada. Em dispositivos antigos
					// do android o app seleciona uma etapa travada por padrao ....
					var valor1 = $("#1etapa").html();
					var valor2 = $("#2etapa").html();
					var valor3 = $("#3etapa").html();

					
					
					if((valor1.search("-Travado") != -1 && stringEtapa == valor1) || stringEtapa === undefined){
						toast("Selecione uma etapa disponível.", 5000);
						return false;
					}
					else if(valor2.search("-Travado") != -1 && stringEtapa == valor2){
						toast("Selecione uma etapa disponível.", 5000);
						return false;
					}
					else if(valor3.search("-Travado") != -1 && stringEtapa == valor3){
						toast("Selecione uma etapa disponível.", 5000);
						return false;
					}


					var somaEtapa = 0;
					var somaAPS = 0;
					// VERIFICA SE AS HORAS DE APS EXEDE O VALOR JA POSTADO PELO PROFESSOR
					for(valorDaEtapa in AGENDAMENTOS[codigoDeDisciplina].etapas){
						for(ag in AGENDAMENTOS[codigoDeDisciplina].etapas[valorDaEtapa]){
							if(AGENDAMENTOS[codigoDeDisciplina].etapas[valorDaEtapa][ag].aps != "DELETE"){
								somaAPS = somaAPS + parseInt(AGENDAMENTOS[codigoDeDisciplina].etapas[valorDaEtapa][ag].aps);
							}
						}
					}
					// VERIFICA SE A NOTA DO AGENDAMENTO EXCEDE O VALOR MÁXIMO DA ETAPA
					for(agenda in AGENDAMENTOS[codigoDeDisciplina].etapas["0"+stringEtapa]){
						if(AGENDAMENTOS[codigoDeDisciplina].etapas["0"+stringEtapa][agenda].nota != "DELETE"){
							if(AGENDAMENTOS[codigoDeDisciplina].etapas["0"+stringEtapa][agenda].pi != "Sim"){
								if(AGENDAMENTOS[codigoDeDisciplina].etapas["0"+stringEtapa][agenda].nota !== null){
									somaEtapa = somaEtapa + parseInt(AGENDAMENTOS[codigoDeDisciplina].etapas["0"+stringEtapa][agenda].nota);
								}
							}
						}
					}
					if((somaAPS + parseInt(apsAgendamento))  > parseInt(AGENDAMENTOS[codigoDeDisciplina].chAPS) ){
						toast("Erro - APS excede o valor de horas", 4000);
						return false;
					}
					if( (somaEtapa + parseInt(notaAgendamento))  > total ){
						toast("Erro - Nota excede o valor da etapa", 4000);
						$("#camposDasNotas").css("-webkit-appearance","none");
						$("#camposDasNotas").css("box-shadow","0px 0px 4px #FF0000");
						$("#camposDasNotas").css("border-radius","5px");
						return false;
					}
					if(AGENDAMENTOS[codigoDeDisciplina].pi === true){

						if( parseInt(etapaAgendamento) == 1){
							if( (somaEtapa + parseInt(notaAgendamento)) > totalPI ){
								toast("Erro - Nota excede o valor da etapa", 4000);
								$("#camposDasNotas").css("-webkit-appearance","none");
								$("#camposDasNotas").css("box-shadow","0px 0px 4px #FF0000");
								$("#camposDasNotas").css("border-radius","5px");
								return false;
							}
						}else if( parseInt(etapaAgendamento) == 2){
							if( (somaEtapa + parseInt(notaAgendamento)) > totalPI ){
								toast("Erro - Nota excede o valor da etapa", 4000);
								$("#camposDasNotas").css("-webkit-appearance","none");
								$("#camposDasNotas").css("box-shadow","0px 0px 4px #FF0000");
								$("#camposDasNotas").css("border-radius","5px");
								return false;
							}
						}else if( parseInt(etapaAgendamento) == 3){
							if( (somaEtapa + parseInt(notaAgendamento)) > totalPI ){
								toast("Erro - Nota excede o valor da etapa", 4000);
								$("#camposDasNotas").css("-webkit-appearance","none");
								$("#camposDasNotas").css("box-shadow","0px 0px 4px #FF0000");
								$("#camposDasNotas").css("border-radius","5px");
								return false;
							}
						}
						else{
							$("#camposDasAps").css("-webkit-appearance","none");
							$("#camposDasAps").css("box-shadow","#fff");
							$("#camposDasNotas").css("-webkit-appearance","none");
							$("#camposDasNotas").css("box-shadow","#fff");
						}

					}
					

					// VERIFICA TODOS OS CAMPOS DO FORMULARIO
					if( (descricaoAgendamento == "") 
					|| 
						( (notaAgendamento == "" || notaAgendamento == 0 || notaAgendamento < 0) && (apsAgendamento == "" || apsAgendamento == 0 || apsAgendamento < 0) )
					||
						(dataAgendamento == "")
					){
						if(onlineAgendamento == "Sim"){
							if(horaAgendamento == ""){
								toast('Erro no preenchimento - Horas!', 4000);
								$("#camposDasHoras").css("-webkit-appearance","none");
								$("#camposDasHoras").css("box-shadow","0px 0px 4px #FF0000");
								$("#camposDasHoras").css("border-radius","5px");
							}
						}
						if(descricaoAgendamento == ""){
							toast('Erro no preenchimento - Descrição!', 4000);
							$("#camposDasDescricoes").css("-webkit-appearance","none");
							$("#camposDasDescricoes").css("box-shadow","0px 0px 4px #FF0000");
							$("#camposDasDescricoes").css("border-radius","5px");
							//return false;
						}
						else{
							$("#camposDasDescricoes").css("-webkit-appearance","none");
							$("#camposDasDescricoes").css("box-shadow","#fff");
						}

						if( (notaAgendamento == "" || notaAgendamento == 0 || notaAgendamento < 0) && (apsAgendamento == "" || apsAgendamento == 0 || apsAgendamento < 0) ){
							if(notaAgendamento == "" || notaAgendamento == 0 || notaAgendamento < 0){
								toast('Erro no preenchimento - Notas!', 4000);
								$("#camposDasNotas").css("-webkit-appearance","none");
								$("#camposDasNotas").css("box-shadow","0px 0px 4px #FF0000");
								$("#camposDasNotas").css("border-radius","5px");
								if(apsAgendamento == "" || apsAgendamento == 0 || apsAgendamento < 0){
									toast('Erro no preenchimento - APS!', 4000);
									$("#camposDasAps").css("-webkit-appearance","none");
									$("#camposDasAps").css("box-shadow","0px 0px 4px #FF0000");
									$("#camposDasAps").css("border-radius","5px");
									//return false;
								}
								//return false;
							}
							else{
								$("#camposDasAps").css("-webkit-appearance","none");
								$("#camposDasNotas").css("-webkit-appearance","none");
								$("#camposDasAps").css("box-shadow","#fff");
								$("#camposDasNotas").css("box-shadow","#fff");
							}	
						}
						else{
							$("#camposDasAps").css("-webkit-appearance","none");
							$("#camposDasNotas").css("-webkit-appearance","none");
							$("#camposDasAps").css("box-shadow","#fff");
							$("#camposDasNotas").css("box-shadow","#fff");
						}


						if(dataAgendamento == "" || dataAgendamento == "00/00/0000"){
							toast('Erro no preenchimento - Data!', 4000);
							$("#camposDasDatas").css("-webkit-appearance","none");
							$("#camposDasDatas").css("box-shadow","0px 0px 4px #FF0000");
							$("#camposDasDatas").css("border-radius","5px");
							//return false;
						}
						else{
							$("#camposDasDatas").css("-webkit-appearance","none");
							$("#camposDasDatas").css("box-shadow","#fff");
						}
						return false;
					}
					var dia = parseInt(dataAgendamento.split("/")[0].replace(/^(0+)(\d)/g,"$2"));
					var mes = parseInt(dataAgendamento.split("/")[1].replace(/^(0+)(\d)/g,"$2"));
					var ano = parseInt(dataAgendamento.split("/")[2]);
					var Data = new Date( ano, (mes-1), dia, 0, 0, 0, 0);

					var dataServidor = ETAPA[numeroDaEtapa].dataFim;
					var diaServ = parseInt(dataServidor.split("-")[2].replace(/^(0+)(\d)/g,"$2"));
					var mesServ = parseInt(dataServidor.split("-")[1].replace(/^(0+)(\d)/g,"$2"));
					var anoServ = parseInt(dataServidor.split("-")[0]);
					var DataServidor2 = new Date( anoServ, (mesServ-1), diaServ, 0, 0, 0, 0);




					if(Data > DataServidor2){
						toast("Data não disponível na etapa.", 5000);
						$("#camposDasDatas").css("-webkit-appearance","none");
						$("#camposDasDatas").css("box-shadow","0px 0px 4px #FF0000");
						$("#camposDasDatas").css("border-radius","5px");
						return false;
					}else{

						insereAgendamento(codigoDeDisciplina,stringEtapa,onlineAgendamento,descricaoAgendamento,tipoAgendamento,notaAgendamento,apsAgendamento,dataAgendamento,horaAgendamento);
						modifica_tela("conteudoInicial");
						toast('Agendamento Inserido!', 5500);
						return false;
					}

				});
				






				$('select').material_select(); //inicializando o seletor de opções.
				
				$(".voltar3").click(function(){
					modifica_tela("conteudoInterno");
					return false;
				});
				$(".Menu").click(function(){
					modifica_tela("conteudoInicial");
				});			
			});

			var idAgendamentos= $(disciplina).attr('id').split("_")[1];

			for(etapa in AGENDAMENTOS[idAgendamentos].etapas){
				cod= AGENDAMENTOS[idAgendamentos].etapas[etapa];
				for(codigoAgendamento in cod){
						var cont = cod[codigoAgendamento]; // variavel que contem o conteudo de cada topico do agendamento
						var labelEtapa = etapa;
						etapa = etapa.toString();
						if( cont['data'] === null ){
							var semDisciplinas="\
								<div>\
									<p class='center-align'>ATENÇÃO</p>\
									<p class='center-align'>Professor(a) sem agendamentos associados.</p>\
								</div>\
							";
							$("#coisas").append(semDisciplinas);
						}
						//Caso um dos elemento dorem deletados ele confere os compos do array
						//Esse elemento não é apreswentado para o usuário
						else if(cont['tipo'] != "DELETE" || cont['data'] != "DELETE"){

							/*controle de etapas que estao ativas*/
							for(var i=0; i<ETAPA.length;i++){
								if("0"+ETAPA[i].etapas == etapa){
									var dataEtapa = ETAPA[i].dataLimite;
									var finalEtapa = new Date( dataEtapa.split("-")[0], (dataEtapa.split("-")[1])-1, dataEtapa.split("-")[2], 0, 0, 0, 0 );
								}
							}


							var diaDoServidor = new Date( LOGIN.dia.split("-")[0], (LOGIN.dia.split("-")[1])-1, LOGIN.dia.split("-")[2], 0, 0, 0, 0 );				

						
							//CONTROLE DE ACESSO CASO AGENDAMENTO SER DO PI
							if(cont['pi'] == "Sim" || diaDoServidor > finalEtapa){
								var linkEditar = "href='#' style='color: #9e9e9e;'";
								var linkExcluir = "href='#' style='color: #9e9e9e;'";
							}
							else{
								var linkEditar = "href='#' class='verEditar' data-idagendamento='"+codigoAgendamento+"'' data-idetapa='"+etapa+"'";
								var linkExcluir = "href='#modalDeletar"+codigoAgendamento+"' class='verDeletar modal-trigger'";
							}
							var string2 = "\
								<tr class='etapaLinha dropdown-button' data-activates='dropdown_"+codigoAgendamento+"'>\
									<td class='controleCores'>"+labelEtapa.replace('Etapa','')+"</td>\
									<td><a >"+cont['descricao']+"</a>\
										<ul data-agendamento='"+codigoAgendamento+"' id='dropdown_"+codigoAgendamento+"' class='dropdown-content'>\
										\
											<li><a href='#modalVer"+codigoAgendamento+"' class='verDetalhes modal-trigger'>Ver Detalhes</a></li>\
											<li class='divider'></li>\
											<li><a "+linkEditar+" >Editar</a></li>\
											<li class='divider'></li>\
											<li><a "+linkExcluir+" >Excluir</a></li>\
										</ul>\
									</td>\
									<td>"+cont['data']+"</td>\
									<td>\
										<i class='icon-ellipsis-vert'></i>\
									</td>\
								</tr>\
							";
							$("#coisas").append(string2);
							$("#aquiDisciplina").html(cod);
						}


						//tratamento do campo APS do agendamento
						var contAPS = cont['aps'];
						if(contAPS == false){
							contAPS = "Não existe APS nesse agendamento";
						}
						else{
							contAPS = cont['aps']+" horas";	
						}
						//tratamento do campos horas do agendamento
						if(cont['hora'] === null || cont['hora'] == "" || cont['hora'] == "false" || cont['hora'] == "NULL"){
							var camposDeHoras = "<p>Não possui Entrega On-line</p>";
						}
						else{
							var camposDeHoras = " - "+cont['hora']+" horas";
						}
						//tratamento do campos nota do agendamento
						if(cont['nota'] === null || cont['nota'] == "" || cont['nota'] == 0){
							var camposDeNotas = "Não existe nota nesse Agendamento."
						}
						else{
							var camposDeNotas = cont['nota']+" Pontos";
						}
						//tratamento do tipo do agendamento
						if(cont['tipo'] == 0){
							var camposDeTipo = "Avaliação";
						}
						else if(cont['tipo'] == 1){
							var camposDeTipo = "Teste";
						}
						else if(cont['tipo'] == 2){
							var camposDeTipo = "Trabalho Teórico";
						}
						else if(cont['tipo'] == 3){
							var camposDeTipo = "Trabalho Prático";
						}
						else if(cont['tipo'] == 4){
							var camposDeTipo = "Trabalho de Campo";
						}
						else if(cont['tipo'] == 5){
							var camposDeTipo = "Exercício em Classe";
						}
						else if(cont['tipo'] == 7){
							var camposDeTipo = "APS";
						}
						else{
							var camposDeTipo = cont['tipo'];	
						}
						
						var msgVer = "\
						<div id='modalVer"+codigoAgendamento+"' class='modal modal-fixed-footer '>\
							<div class='row'>\
								<div class='col s10'>\
									<h4 class='black-text'>Detalhes</h4>\
								</div>\
								<div class='col s2' style='margin-top:7px;'>\
									<button style='font-size:large; padding:1px;' class='btn-flat waves-effect waves-teal modal-action modal-close black-text'><i class='mdi-navigation-close' style='font-size:2.3rem;'></i></button>\
								</div>\
							</div>\
							<ul class='collection with-header'>\
						        <li class='collection-header' style='border-bottom: 0px;'><h5>DESCRIÇÃO</h5></li>\
						        <li class='collection-item'>"+cont['descricao']+"</li>\
						        <li class='collection-header' style='border-bottom: 0px;'><h5>TIPO</h5></li>\
						        <li class='collection-item'>"+camposDeTipo+"</li>\
						        <li class='collection-header' style='border-bottom: 0px;'><h5>NOTA</h5></li>\
						        <li class='collection-item'>"+camposDeNotas+"</li>\
						        <li class='collection-header' style='border-bottom: 0px;'><h5>APS</h5></li>\
						        <li class='collection-item'>"+contAPS+"</li>\
						        <li class='collection-header' style='border-bottom: 0px;'><h5>Data/Hora de Entrega</h5></li>\
						        <li class='collection-item'>"+cont['data']+" "+camposDeHoras+"</li>\
						    </ul>\
						</div>\
						";

						var msgDeletar = "\
						<div id='modalDeletar"+codigoAgendamento+"' class='modal'>\
							<div class='modal-content'>\
								<h5>Deletar</h5>\
								\
								<p>Tem certeza que deseja deletar \""+cont['descricao']+"\" ?</p>\
								\
								<div class='center-align'>\
									<button data-disciplina ='"+idAgendamentos+"' data-idDaEtapa = '"+etapa+"' data-idDoAgendamento = '"+codigoAgendamento+"' class='deletarSim waves-effect waves-light btn modal-action modal-close light-blue'>Sim</button>\
									<button class='waves-effect waves-light btn modal-action modal-close light-blue'>Não</button>\
								</div>\
							</div>\
						</div>\
						";
						
						$(".modalDosElementosAgendamento").append(msgVer);
						$(".modalDosElementosAgendamento").append(msgDeletar);
						$('.modal-trigger').leanModal();


				};
			};

			$(".verEditar").click(function(){
				modifica_tela("conteudoEditarAgendamentos");
				
											
				carrega_edita_agendamento(idAgendamentos,$(this).attr('data-idetapa'),$(this).attr('data-idagendamento'));

				$(".voltar2").click(function(){
					modifica_tela("conteudoInterno");
					return false;
				});
				$(".Menu").click(function(){
					modifica_tela("conteudoInicial");
				});


				var option = this.getAttribute('data-idetapa').replace(/^(0+)(\d)/g,"$2");;

				

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

					var inicializaCalendario = $( '#editaCamposDasDatas' ).pickadate({
				        min: [anoInicioEtapa,mesInicioEtapa-1,diaInicioEtapa],
				        max: [anoFimEtapa,mesFimEtapa-1,diaFimEtapa]
				    });
				}
			}

				$('select').material_select(); //inicializando o seletor de opções.
			});
			
			$('.dropdown-button').dropdown({
		      inDuration: 0,
		      outDuration: 0,
		      constrain_width: false, // Does not change width of dropdown to that of the activator
		      hover: false, // Activate on click
		      alignment: 'right', // Aligns dropdown to left or right edge (works with constrain_width)
		      gutter: '15', // Spacing from edge
		      belowOrigin: false // Displays dropdown below the button
		    });
}

	// A FUNCAO DE DELETAR ESTA NO main.js

function carrega_deleta_agendamento(idDisciplina,idEtapa,idAgenda){


	for(idAluno in NOTAS[idDisciplina].notas[idEtapa][idAgenda]){
		if(NOTAS[idDisciplina].notas[idEtapa][idAgenda][idAluno].nota === null &&
			NOTAS[idDisciplina].notas[idEtapa][idAgenda][idAluno].aps === null
		){
			var controleExclusao = 1;
		}
		else{
			var controleExclusao = 2;
		}
	};
	//console.log(controleExclusao);
	if(controleExclusao == 1){
		excluiAgendamento (idDisciplina,idEtapa,idAgenda);
		modifica_tela("conteudoInicial");
		toast('Agendamento Excluído!', 4000);
	}
	else if(controleExclusao == 2){
		toast("Erro - Agendamento já possui notas.",4000);
	}
}


function carrega_edita_agendamento(disciplina,etapa,codigoAgendamento) {
	cont=AGENDAMENTOS[disciplina].etapas[etapa][codigoAgendamento];

	if(cont['online'] == "Sim"){
		var contOnline = "checked";
	}

	if(cont['hora'] === null || cont['hora'] == "" || cont['hora'] == "false"){
		var hora = "23:59";
	}
	else{
		var hora = cont['hora'];
	}
	

	if(cont['tipo'] == "Avaliação" || cont['tipo'] == 0){
		var selecionarTipo0 = "selected";
	}
	else if(cont['tipo'] == "Teste" || cont['tipo'] == 1){
		var selecionarTipo1 = "selected";
	}
	else if(cont['tipo'] == "Trabalho teórico" || cont['tipo'] == 2){
		var selecionarTipo2 = "selected";
	}
	else if(cont['tipo'] == "Trabalho Prático" || cont['tipo'] == 3){
		var selecionarTipo3 = "selected";
	}
	else if(cont['tipo'] == "Trabalho de campo" || cont['tipo'] == 4){
		var selecionarTipo4 = "selected";
	}
	else if(cont['tipo'] == "Exercício em classe" || cont['tipo'] == 5){
		var selecionarTipo5 = "selected";
	}
	else if(cont['tipo'] == "APS" || cont['tipo'] == 7){
		var selecionarTipo7 = "selected";
	}
		
	var msgEditar = "\
	<div class='row center-align'>\
		<div class='col s6'>\
			<a class='voltar2 waves-effect waves btn-flat'><i class='mdi-navigation-arrow-back left'></i>VOLTAR</a>\
		</div>\
		<div class='col s6'>\
			<a class='Menu waves-effect waves btn-flat'><i class='mdi-action-home left'></i>INÍCIO</a>\
		</div>\
	</div>\
	<div id='modalEditar"+codigoAgendamento+"'>\
				<div>\
					<h5 style='padding-left:10px; margin-bottom:10px;'>Detalhes - Editar</h5>\
					\
					<div class='row'>\
						<form data-etapa='"+etapa+"' class='col s12' id='formAlteraAgendamento' method='POST'>\
							<div style='margin-bottom:15px;' class='divider'></div>\
							<div id='editaCampoDescricao' class='input-field col s12'>\
								<textarea name='descricaoAgendamento' id='textarea"+codigoAgendamento+"' class='materialize-textarea'>"+cont['descricao']+"</textarea>\
								<label class='active' for='textarea"+codigoAgendamento+"'>Descrição do Agendamento</label>\
							</div>\
							<label>Tipo de Agendamento</label>\
							<select class='modificarSelecionarTipo' name='selecaoTipoAgendamento'>\
								<option value='0' "+selecionarTipo0+">Avaliação</option>\
								<option value='1' "+selecionarTipo1+">Teste</option>\
								<option value='2' "+selecionarTipo2+">Trabalho Teórico</option>\
								<option value='3' "+selecionarTipo3+">Trabalho Prático</option>\
								<option value='4' "+selecionarTipo4+">Trabalho de Campo</option>\
								<option value='5' "+selecionarTipo5+">Exercício em Classe</option>\
								<!--<option value='6'>Exame especial</option>-->\
								<option value='7' "+selecionarTipo7+">APS</option>\
							<select>\
							<div style='margin-bottom:10px;' class='entregaNotasModifica'></div>\
							<div style='margin-bottom:10px;' class='entregaModifica'>\
								<div class='col s6'>\
									Entrega Online:\
								</div>\
								<div class='col s6' style='margin-bottom: 10px;'>\
									<div class='switch '>\
										<label>\
											Não\
											<input name='onlineAgendamento' type='checkbox' "+contOnline+" class='SelecionarHoras'>\
											<span class='lever'></span>\
											Sim\
										</label>\
									</div>\
								</div>\
							</div>\
							<div class='row'>\
								<div id='editaCamposDasNotas' class='lugarDoCampoNota input-field col s6'>\
									<input name='notaDoAgendamento' id='formNotas"+codigoAgendamento+"' type='number' class='validate' value='"+cont['nota']+"'>\
									<label class='active' for='formNotas"+codigoAgendamento+"'>Nota</label>\
								</div>\
								<div id='editaCamposDasAps' class='aps input-field col s6'>\
									<input name='apsDoAgendamento' id='formAps"+codigoAgendamento+"' type='number' class='validate' value='"+cont['aps']+"'>\
									<label class='active' for='formAps"+codigoAgendamento+"'>APS</label>\
								</div>\
							</div>\
							<div class='row'>\
								<div class='input-field col s6'>\
									<input id='editaCamposDasDatas' name='dataDoAgendamento' type='date' class='datepicker' value='"+cont['data']+"' data-value='"+cont['data']+"'>\
									<label class='active'>Data do Agendamento</label>\
								</div>\
								<div class='horasAPS input-field col s6'>\
									<input id='editaCamposDasHoras' name='horaDoAgendamento' type='time' value='"+hora+"'>\
									<label class='active'>Horas</label>\
								</div>\
							</div>\
							<div class='row'>\
								<div class='input-field col s12 center-align'>\
									<button class='btn waves-effect waves-light voltar2 light-blue'>Cancelar</button>\
									<input type='submit' class='btn waves-effect waves-light light-blue' value='Salvar' />\
								</div>\
							</div>\
							\
						</form>\
				</div>\
	</div>\
	";
	$("#conteudoEditarAgendamentos").html(msgEditar);

	if(cont['tipo'] == "Avaliação" || cont['tipo'] == 0){
		$(".aps").hide();
		$(".entregaModifica").hide();
		$(".apsEntrega").hide();
		$(".horasAPS").hide();
	}
	else if(cont['tipo'] == "Teste" || cont['tipo'] == 1){
		$(".aps").hide();
		$(".apsEntrega").hide();
	}
	else if(cont['tipo'] == "Trabalho teórico" || cont['tipo'] == 2){
		$(".aps").hide();
		$(".apsEntrega").hide();
	}
	else if(cont['tipo'] == "Trabalho Prático" || cont['tipo'] == 3){
		$(".aps").hide();
		$(".apsEntrega").hide();
	}
	else if(cont['tipo'] == "Trabalho de campo" || cont['tipo'] == 4){
		$(".aps").hide();
		$(".apsEntrega").hide();
	}
	else if(cont['tipo'] == "Exercício em classe" || cont['tipo'] == 5){
		$(".aps").hide();
		$(".apsEntrega").hide();
	}
	else if(cont['tipo'] == "APS" || cont['tipo'] == 7){
		var valeNotaModifica = "\
		<div class='apsEntrega'>\
			<div class='col s6'>\
			Vale nota:\
			</div>\
			<div class='col s6'>\
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
		$(".entregaNotasModifica").html(valeNotaModifica);
		$(".entregaModifica").hide();
		if(cont['nota'] > 0){
			$(".valeNota").click();
		}
		else if(cont['nota'] == 0){
			$(".lugarDoCampoNota").hide();
			
		}
	}


	$('.timepicker').pickatime();
	if(cont['online'] == "Nao" || cont['online'] == "Não" || cont['online'] == false){
		$(".horasAPS").hide();
	}
	$('.SelecionarHoras').on('change',function(){
		
		$(".horasAPS").toggle();
	});

	$("#formAlteraAgendamento").on("submit", function(){

		var onlineAgendamento = $(this).find('input[name=onlineAgendamento]'), onlineAgendamento = onlineAgendamento.prop("checked");
		if(onlineAgendamento == true){onlineAgendamento = "Sim";}
		else onlineAgendamento = "Nao";
		var descricaoAgendamento = $(this).find('textarea[name=descricaoAgendamento]'), descricaoAgendamento = descricaoAgendamento.val();
		var tipoAgendamento = $(this).find('select[name=selecaoTipoAgendamento]'), tipoAgendamento = tipoAgendamento.val();
		var notaAgendamento = $(this).find('input[name=notaDoAgendamento]'), notaAgendamento = notaAgendamento.val();
		var apsAgendamento = $(this).find('input[name=apsDoAgendamento]'), apsAgendamento = apsAgendamento.val();
		var dataAgendamento = $(this).find('input[name=dataDoAgendamento]'), dataAgendamento = dataAgendamento.val();
		var horaAgendamento = false;
		if(onlineAgendamento == "Sim"){
			var horaAgendamento = $(this).find('input[name=horaDoAgendamento]'), horaAgendamento = horaAgendamento.val();
		}

		//VERIFICA CASO QUE O PROFESSOR ALTERE A NOTA DO AGENDAMENTO DEPOIS DE TER POSTADO NOTA
		for(codAlu in NOTAS[disciplina].notas[etapa][codigoAgendamento]){
			if(NOTAS[disciplina].notas[etapa][codigoAgendamento][codAlu].nota !== null ||
				NOTAS[disciplina].notas[etapa][codigoAgendamento][codAlu].aps !== null
				){
				
				if(notaAgendamento == AGENDAMENTOS[disciplina].etapas[etapa][codigoAgendamento].nota){
					$("#formNotas"+codigoAgendamento).css("-webkit-appearance","none");
					$("#formNotas"+codigoAgendamento).css("box-shadow","#fff");
				}
				else{
					toast('Erro - Já existe notas postadas', 4000);
					$("#formNotas"+codigoAgendamento).css("-webkit-appearance","none");
					$("#formNotas"+codigoAgendamento).css("box-shadow","0px 0px 4px #FF0000");
					$("#formNotas"+codigoAgendamento).css("border-radius","5px");
					return false;
				}
				if(apsAgendamento == AGENDAMENTOS[disciplina].etapas[etapa][codigoAgendamento].aps){
					$("#formAps"+codigoAgendamento).css("-webkit-appearance","none");
					$("#formAps"+codigoAgendamento).css("box-shadow","#fff");
				}
				else{
					toast('Erro - Já existe APS postada', 4000);
					$("#formAps"+codigoAgendamento).css("-webkit-appearance","none");
					$("#formAps"+codigoAgendamento).css("box-shadow","0px 0px 4px #FF0000");
					$("#formAps"+codigoAgendamento).css("border-radius","5px");
					return false;
				}
			}
			else{
				$("#formNotas"+codigoAgendamento).css("-webkit-appearance","none");
				$("#formAps"+codigoAgendamento).css("-webkit-appearance","none");
				$("#formNotas"+codigoAgendamento).css("box-shadow","#fff");
				$("#formAps"+codigoAgendamento).css("box-shadow","#fff");
			}
		};


		// VERIFICA TODOS OS CAMPOS DO FORMULARIO
		if( (descricaoAgendamento == "") 
		|| 
			( (notaAgendamento == "" || notaAgendamento == 0 || notaAgendamento < 0) && (apsAgendamento == "" || apsAgendamento == 0 || apsAgendamento < 0) )
		||
			(dataAgendamento == "")
		){
			if(onlineAgendamento == "Sim"){
				if(horaAgendamento == "" || horaAgendamento == "false"){
					toast('Erro no preenchimento - Horas!', 4000);
					$("#editaCamposDasHoras").css("-webkit-appearance","none");
					$("#editaCamposDasHoras").css("box-shadow","0px 0px 4px #FF0000");
					$("#editaCamposDasHoras").css("border-radius","5px");
				}
			}
			if(descricaoAgendamento == ""){
				toast('Erro no preenchimento - Descrição!', 4000);
				$("#textarea"+codigoAgendamento).css("-webkit-appearance","none");
				$("#textarea"+codigoAgendamento).css("box-shadow","0px 0px 4px #FF0000");
				$("#textarea"+codigoAgendamento).css("border-radius","5px");
				//return false;
			}
			else{
				$("#textarea"+codigoAgendamento).css("-webkit-appearance","none");
				$("#textarea"+codigoAgendamento).css("box-shadow","#fff");
			}

			if( (notaAgendamento == "" || notaAgendamento == 0 || notaAgendamento < 0) && (apsAgendamento == "" || apsAgendamento == 0 || apsAgendamento < 0) ){
				if(notaAgendamento == "" || notaAgendamento == 0 || notaAgendamento < 0){
					toast('Erro no preenchimento - Notas!', 4000);
					$("#formNotas"+codigoAgendamento).css("-webkit-appearance","none");
					$("#formNotas"+codigoAgendamento).css("box-shadow","0px 0px 4px #FF0000");
					$("#formNotas"+codigoAgendamento).css("border-radius","5px");
					if(apsAgendamento == "" || apsAgendamento == 0 || apsAgendamento < 0){
						toast('Erro no preenchimento - APS!', 4000);
						$("#formAps"+codigoAgendamento).css("-webkit-appearance","none");
						$("#formAps"+codigoAgendamento).css("box-shadow","0px 0px 4px #FF0000");
						$("#formAps"+codigoAgendamento).css("border-radius","5px");
						//return false;
					}
					//return false;
				}
				else{
					$("#formNotas"+codigoAgendamento).css("-webkit-appearance","none");
					$("#formAps"+codigoAgendamento).css("-webkit-appearance","none");
					$("#formNotas"+codigoAgendamento).css("box-shadow","#fff");
					$("#formAps"+codigoAgendamento).css("box-shadow","#fff");
				}	
			}
			else{
				$("#formNotas"+codigoAgendamento).css("-webkit-appearance","none");
				$("#formAps"+codigoAgendamento).css("-webkit-appearance","none");
				$("#formNotas"+codigoAgendamento).css("box-shadow","#fff");
				$("#formAps"+codigoAgendamento).css("box-shadow","#fff");
			}


			if(dataAgendamento == "" || dataAgendamento == "00/00/0000"){
				toast('Erro no preenchimento - Data!', 4000);
				$("#editaCamposDasDatas").css("-webkit-appearance","none");
				$("#editaCamposDasDatas").css("box-shadow","0px 0px 4px #FF0000");
				$("#editaCamposDasDatas").css("border-radius","5px");
				//return false;
			}
			else{
				$("#editaCamposDasDatas").css("-webkit-appearance","none");
				$("#editaCamposDasDatas").css("box-shadow","#fff");
			}
			return false;
		}



		alteraAgendamento(disciplina,etapa,codigoAgendamento, onlineAgendamento,descricaoAgendamento,tipoAgendamento,notaAgendamento,apsAgendamento,dataAgendamento,horaAgendamento );
		modifica_tela("conteudoInicial");
		toast('Agendamento Modificado!', 5500);
		return false;

	});
}
