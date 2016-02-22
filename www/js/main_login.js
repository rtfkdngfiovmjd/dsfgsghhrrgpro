const VERSAO = "1.0";



//var prefix = "http://192.168.10.240/user/henrique/";
var prefix = "https://adx.doctum.edu.br/adx/unidades/";
//var prefix = "http://adx.doctum.edu.br/adx/unidades/adx_teste_ctga";

var LOGIN = JSON.parse(localStorage.getItem('login'));
var unidade;
if (LOGIN !== null) {
	unidade = LOGIN.unidade;
};


// VERIFICA SE O USUARIO ESTA CONECTADO
function isOnlineLogin(){

	//var page = prefix+"adx/mobile/professor/leitura/testeConecao.php"; //TESTE!!
	var page = prefix+unidade+"/mobile/professor/leitura/testeConecao.php"; //OFICIAL
	//var page = prefix+"/mobile/professor/leitura/testeConecao.php"; //teste basse de dados oficial
	var resultado = 0;
	$.ajax({
		url: page,
		data: {},
		dataType: "text",
		method: "post",
		async: false,
	}).done(function(dados){
		resultado = dados;
	}).fail(function(a,b,c){
		console.log(a);
		console.log(b);
		console.log(c);
	});
	return resultado;
}


// CRIA UM MODAL COM A ANIMACAO DE ESPERA
function esperaconectar(){
	var load = "\
	<div id='modalLogin' class='modal' style='color:rgba(84, 150, 252, 0.97); background: transparent; box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0); height: 30%;'>\
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

		$('#modalLogin').openModal({
			dismissible: false,
			opacity: .5,
		});
}

/* função para apresentar a interface de teclado para o usuarios colocar o PIN*/
function telaDePinLogin(){

			var tela = "\
			<div style='text-align:center;' class='tituloDoComando'></div>\
			<div style='margin-top:50px;'>\
				<div class='row quatroOpcoes'>\
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
							<div data-number='1' class='circle-number-login '>\
								1\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='2' class='circle-number-login '>\
								2\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='3' class='circle-number-login '>\
								3\
							</div>\
						</div>\
				    </div>\
				    <div class='row'>\
						<div class='col s4'>\
							<div data-number='4' class='circle-number-login '>\
								4\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='5' class='circle-number-login '>\
								5\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='6' class='circle-number-login '>\
								6\
							</div>\
						</div>\
				    </div>\
				    <div class='row'>\
						<div class='col s4'>\
							<div data-number='7' class='circle-number-login '>\
								7\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='8' class='circle-number-login '>\
								8\
							</div>\
						</div>\
						<div class='col s4'>\
							<div data-number='9' class='circle-number-login '>\
								9\
							</div>\
						</div>\
				    </div>\
				    <div class='row'>\
						<div class='col s4 offset-s4'>\
							<div data-number='0' class='circle-number-login '>\
								0\
							</div>\
						</div>\
				    </div>\
				</form>\
			</div>\
			";
			
			return tela;
		}

/*função que constroi a interface de verificar PIN*/
function verifica_pin(){
	var pin = Array();
	var tamanho=0;

	modifica_tela("VerificaPin");

	$("#VerificaPin").html( telaDePinLogin() );
	$("#nomeSecao").html("PIN");
	$(".tituloDoComando").html("Digite sua senha PIN");

}

/*evento para capturar e verificar se o numero PIN foi digitado corretamente*/
$(document).on("tap", ".circle-number-login", function (){	
	var valor = parseInt( $(this).attr("data-number") );
	console.log(valor);
	if(tamanho < 4){
		if(pin.length < 4){
			pin[tamanho] = valor;
		}
		if(tamanho == 0){$('.primeiraBola').removeClass("mdi-image-panorama-fisheye").addClass("mdi-image-lens");}
		if(tamanho == 1){$('.segundaBola').removeClass("mdi-image-panorama-fisheye").addClass("mdi-image-lens");}
		if(tamanho == 2){$('.terceiraBola').removeClass("mdi-image-panorama-fisheye").addClass("mdi-image-lens");}
		if(tamanho == 3){$('.quartaBola').removeClass("mdi-image-panorama-fisheye").addClass("mdi-image-lens");}
		tamanho++;
	}
	if(pin.length == 4){
		if(md5( pin.join("") ) == LOGIN.pin ){
			// alert("acertou");
			pin = Array();
			tamanho=0;

			modifica_tela("conteudoInicial");
			$("body").removeClass("comImg").addClass("semImg");
			if(isOnline(true) != 'erro versao'){
				if( device.platform == "iOS" ){
					$("nav").css("padding-top","20px").css("height", "70px");
				}
				INICIO();
				colocarNomeProfessor("html");
				esperaDisciplinas();
			}

		}else{
			pin = Array();
			tamanho=0;
			$('.primeiraBola').removeClass("mdi-image-lens").addClass("mdi-image-panorama-fisheye");
			$('.segundaBola').removeClass("mdi-image-lens").addClass("mdi-image-panorama-fisheye");
			$('.terceiraBola').removeClass("mdi-image-lens").addClass("mdi-image-panorama-fisheye");
			$('.quartaBola').removeClass("mdi-image-lens").addClass("mdi-image-panorama-fisheye");
			$( ".quatroOpcoes" ).effect( "shake", 800 );
			navigator.vibrate(500);
			//alert("errou");
		}
	}
	return false;
});

document.addEventListener("deviceready", onDeviceReady, false);

//$(document).ready(function(){
function onDeviceReady() {

	// if( device.platform == "iOS" ){
	// 	$("nav").css("padding-top","20px").css("height", "70px");
	// }

	if(LOGIN !== null){
	
		if (LOGIN.conectado === 'true') {
			if(LOGIN.pin === null){

				if( device.platform == "iOS" ){
					$("nav").css("padding-top","20px").css("height", "70px");
				}

				$('body').load("mobile/index.html", function(){
						$("body").removeClass("comImg").addClass("semImg");

						if(isOnline(true) != 'erro versao'){
							INICIO();
							colocarNomeProfessor("html");
							esperaDisciplinas();
						}
				});

			}
			else{
				//alert("Verificando PIN...");
				$('body').load("mobile/index.html", function(){
					verifica_pin();
				});
			}
			return false;
		}
		else{
			localStorage.clear();
		}
	
	}else{
		$('body').load("login.html", function(){
			$('select').material_select();
			$("body").removeClass("semImg").addClass("comImg");
		});
	}

	/*Evento para melhorar a usabilidade do switch da opção "Manter Conectado"*/
	$(document).on('touchstart','.switch',function(e){
		$(this.children[0]).click();
		e.stopPropagation();
		e.stopImmediatePropagation();
		return false;
	});

	/*evento para pegar o valor da unidade logo quando o usuário seleciona ele.*/
	$(document).on('change','#selecionarUnidade',function(){
		unidade = $(this).val();
	});

	/* Evento para funcionar a seta de todos os select */
	$(document).on('tap','.select-wrapper > i',function(e){
		$($(this).context.previousSibling).click();
		e.stopPropagation();
		e.stopImmediatePropagation();
	});	

	/*evento para enviar as informações de login e verificar a autenticidade do usuario*/
	$(document).on('submit','#formLogin',function() {



		var user = $(this).find('input[name=user]').val();
		var senha = $(this).find('input[name=senha]').val();
		unidade = $(this).find('select[name=selecionarUnidade]').val();
		var conectado = true;

		// if ( isOnlineLogin() == 0){
		// 	if( $('.toast').length != 1 ){
		// 		toast("Sem conexão com internet.", 3000);
		// 	}
		// 	return false;
		// }
		
		if(user == "" || senha == "" || unidade === null){
			if( $('.toast').length != 1 ){
				toast("Preencha todos os campos.", 4000);
			}
			return false;
		}else{
			esperaconectar();
			$.ajax({
			//url: prefix+"adx/mobile/professor/login.php",
			url: prefix+unidade+"/mobile/professor/login.php",
			//url: prefix+"/mobile/professor/leitura/testeConecao.php",
			data: {
				user: user,
				senha: senha,
				unidade: unidade,
				conectado: conectado,
			},
			dataType: "json",
			method: "post",
			}).done(function(dados){
				if(dados[0] == "erro"){
					console.log(dados);
					if( $('.toast').length != 1 ){
						toast("Login/Senha errada.", 4000);
					}
					$("#modalLogin").closeModal();
				}
				else{
					dados['unidade']=unidade;
					LOGIN=dados;
					localStorage.setItem('login',JSON.stringify(dados));
					
					if( device.platform == "iOS" ){
						$("nav").css("padding-top","20px").css("height", "70px");
					}

					$('body').load("mobile/index.html", function(){
						$("body").removeClass("comImg").addClass("semImg");
						if(isOnline(true) != 'erro versao'){
							INICIO();
							colocarNomeProfessor("html");
							esperaDisciplinas();
						}
					});
				}
			}).fail(function(a,b,c){
				console.log(a);
				console.log(b);
				console.log(c);
				if( $('.toast').length != 1 ){
					toast("Sem conexão com o Servidor.", 5000);
				}
				$("#modalLogin").closeModal();			
			});
		}
			return false;
	});
//});	
}