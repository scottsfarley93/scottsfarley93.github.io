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