function carrega_configuracao (){

	if(LOGIN.pin === null){
		var ativa = "";
		var textoPin = "Esse método ativado poderá ser cancelo pelo usuário. Esse método gera uma camada de segurança a mais para o usuário.";
	}
	else{
		var ativa = "disabled checked";
		var textoPin = "\
		<p>Você já possui um PIN cadastrado. Caso queira modificar clique no botão abaixo \
			para excluir e criar um novo.\
		</p>\
		<input id='deletarPin' type='button' class='waves-effect waves-light btn red lighten-2' value='Deletar PIN'>\
		";
	}

	var ativar="\
	<div class='row center-align'>\
		<div class='col s6'>\
			<a class='Menu waves-effect waves btn-flat'><i class='mdi-navigation-arrow-back left'></i>VOLTAR</a>\
		</div>\
		<div class='col s6'>\
			<a class='Menu waves-effect waves btn-flat'><i class='mdi-action-home left'></i>INÍCIO</a>\
		</div>\
	</div>\
	<div style='border-top: 1px solid #e0e0e0;'></div>\
	<div class='row' style='margin-top:20px;'>\
      	<div class='col s8' style='font-size:15px; padding-top:3px;'>Cadastrar senha PIN</div>\
      	<div class='col s4'>\
      	<form>\
			<div class='switch'>\
				<label>\
					<input id='cadastrarPin' type='checkbox' "+ativa+">\
					<span class='lever'></span>\
				</label>\
			</div>\
		</form>\
      	</div>\
		<div style='margin-top:20px;' align='justify' class='col s12'>"+textoPin+"</div>\
	</div>\
	";
	$("#conteudoConfig").html(ativar);

	$(".Menu").click(function(){
		modifica_tela("conteudoInicial");
	});
}

