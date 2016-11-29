console.log("Running main.js v1.0 as javascript front-end");
$(document).ready(function(){
	$(".portfolio-content").find(".carousel-caption").hide();
	$(".portfolio-content").mouseenter(function(){
		$(this).find(".carousel-caption").show();
	});
$(".portfolio-content").mouseleave(function(){
		$(this).find(".carousel-caption").hide();
	});

	$("#content1").click(function(e){
		$("#modal1").modal("toggle");
	});

	$("#content2").click(function(e){
		$("#modal2").modal("toggle");
	});

	$("#content3").click(function(e){
		$("#modal3").modal("toggle");
	});

	$("#content4").click(function(e){
		$("#modal4").modal("toggle");
	});
		$("#content5").click(function(e){
		$("#modal5").modal("toggle");
	});
		$("#content6").click(function(e){
		$("#modal6").modal("toggle");
	});
  $("#content7").click(function(e){
  $("#modal7").modal("toggle");
});
$("#content8").click(function(e){
$("#modal8").modal("toggle");
});

$("#ws_thumb1").click(function(){
  changeSource = $(this).attr('src');
  $("#ws_mainImage").attr('src', changeSource);
});
$("#ws_thumb2").click(function(){
  changeSource = $(this).attr('src');
  $("#ws_mainImage").attr('src', changeSource);
});
$("#ws_thumb3").click(function(){
  changeSource = $(this).attr('src');
  $("#ws_mainImage").attr('src', changeSource);
});

$("#pv_thumb1").click(function(){
  changeSource = $(this).attr('src');
  $("#pv_mainImage").attr('src', changeSource);
});
$("#pv_thumb2").click(function(){
  changeSource = $(this).attr('src');
  $("#pv_mainImage").attr('src', changeSource);
});
$("#pv_thumb3").click(function(){
  changeSource = $(this).attr('src');
  $("#pv_mainImage").attr('src', changeSource);
});


	$("#yose_thumb1").click(function(){
		changeSource = $(this).attr('src');
		$("#yosemite_mainImage").attr('src', changeSource);
	});
	$("#yose_thumb2").click(function(){
		changeSource = $(this).attr('src');
		$("#yosemite_mainImage").attr('src', changeSource);
	});
	$("#yose_thumb3").click(function(){
		changeSource = $(this).attr('src');
		$("#yosemite_mainImage").attr('src', changeSource);
	});

		$("#syria_thumb1").click(function(){
		changeSource = $(this).attr('src');
		$("#syria_mainImage").attr('src', changeSource);
	});
	$("#syria_thumb2").click(function(){
		changeSource = $(this).attr('src');
		$("#syria_mainImage").attr('src', changeSource);
	});
	$("#syria_thumb3").click(function(){
		changeSource = $(this).attr('src');
		$("#syria_mainImage").attr('src', changeSource);
	});



	$("#scandi_thumb1").click(function(){
		changeSource = $(this).attr('src');
		$("#scandi_mainImage").attr('src', changeSource);
	});
	$("#scandi_thumb2").click(function(){
		changeSource = $(this).attr('src');
		$("#scandi_mainImage").attr('src', changeSource);
	});
	$("#scandi_thumb3").click(function(){
		changeSource = $(this).attr('src');
		$("#scandi_mainImage").attr('src', changeSource);
	});

	$("#firesphere_thumb1").click(function(){
		changeSource = $(this).attr('src');
		$("#firesphere_mainImage").attr('src', changeSource);
	});
	$("#firesphere_thumb2").click(function(){
		changeSource = $(this).attr('src');
		$("#firesphere_mainImage").attr('src', changeSource);
	});
	$("#firesphere_thumb3").click(function(){
		changeSource = $(this).attr('src');
		$("#firesphere_mainImage").attr('src', changeSource);
	});


	$("#lab1_thumb1").click(function(){
		changeSource = $(this).attr('src');
		$("#lab1_mainImage").attr('src', changeSource);
	});
	$("#lab1_thumb2").click(function(){
		changeSource = $(this).attr('src');
		$("#lab1_mainImage").attr('src', changeSource);
	});
	$("#lab1_thumb3").click(function(){
		changeSource = $(this).attr('src');
		$("#lab1_mainImage").attr('src', changeSource);
	});
});
