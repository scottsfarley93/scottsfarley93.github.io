$(document).ready(function(){
	var visionMenu = $("#vision-menu");
	var educationMenu = $("#education-menu");
	var techMenu = $("#tech-menu");
	var workMenu = $("#work-menu");
	var honorsMenu = $("#honors-menu");
	var leadershipMenu = $("#leadership-menu");
	var publicationsMenu = $("#publications-menu");
	var presentationsMenu = $("#presentations-menu");
	
	var visionY = $("#cv-vision").offset().top;
	var educationY = $("#cv-education").offset().top;
	var techY = $("#cv-tech").offset().top;
	var workY = $("#cv-work").offset().top;
	var honorsY = $("#cv-honors").offset().top;
	var leadershipY = $("#cv-leadership").offset().top;
	var publicationsY = $("#cv-publications").offset().top;
	var presentationsY = $("#cv-presentations").offset().top;
	

	$(window).scroll(function () {
	    var currentY = $(this).scrollTop();
	    //vision
		if (currentY >= visionY && currentY < educationY){
			visionMenu.addClass('active-menu');
			educationMenu.removeClass('active-menu');
			techMenu.removeClass('active-menu');
			workMenu.removeClass('active-menu');
			honorsMenu.removeClass('active-menu');
			leadershipMenu.removeClass('active-menu');
			publicationsMenu.removeClass('active-menu');
			presentationsMenu.removeClass('active-menu');
		}
		//education
		else if (currentY >= educationY  && currentY < techY){
			educationMenu.addClass('active-menu');
			visionMenu.removeClass('active-menu');
			techMenu.removeClass('active-menu');
			workMenu.removeClass('active-menu');
			honorsMenu.removeClass('active-menu');
			leadershipMenu.removeClass('active-menu');
			publicationsMenu.removeClass('active-menu');
			presentationsMenu.removeClass('active-menu');
			
		}
		//tech
		else if (currentY >= techY  && currentY < workY){
			techMenu.addClass('active-menu');
			visionMenu.removeClass('active-menu');
			educationMenu.removeClass('active-menu');
			workMenu.removeClass('active-menu');
			honorsMenu.removeClass('active-menu');
			leadershipMenu.removeClass('active-menu');
			publicationsMenu.removeClass('active-menu');
			presentationsMenu.removeClass('active-menu');

		}
		//work
		else if (currentY >= workY  && currentY < honorsY){
			workMenu.addClass('active-menu');
			educationMenu.removeClass('active-menu');
			visionMenu.removeClass('active-menu');
			techMenu.removeClass('active-menu');
			honorsMenu.removeClass('active-menu');
			leadershipMenu.removeClass('active-menu');
			publicationsMenu.removeClass('active-menu');
			presentationsMenu.removeClass('active-menu');
			
		}
		//honors
		else if (currentY >= honorsY  && currentY < leadershipY){
			honorsMenu.addClass('active-menu');
			educationMenu.removeClass('active-menu');
			techMenu.removeClass('active-menu');
			workMenu.removeClass('active-menu');
			visionMenu.removeClass('active-menu');
			leadershipMenu.removeClass('active-menu');
			publicationsMenu.removeClass('active-menu');
			presentationsMenu.removeClass('active-menu');
		
		}
		//leadership -->
		else if (currentY >= leadershipY && currentY <= (leadershipY * 1.1)){
			leadershipMenu.addClass('active-menu');
			educationMenu.removeClass('active-menu');
			techMenu.removeClass('active-menu');
			workMenu.removeClass('active-menu');
			honorsMenu.removeClass('active-menu');
			visionMenu.removeClass('active-menu');
			publicationsMenu.removeClass('active-menu');
			presentationsMenu.removeClass('active-menu');
		}
		else if (currentY >= (leadershipY * 1.1) ){
						publicationsMenu.addClass('active-menu');
						presentationsMenu.addClass('active-menu');
			educationMenu.removeClass('active-menu');
			techMenu.removeClass('active-menu');
			workMenu.removeClass('active-menu');
			honorsMenu.removeClass('active-menu');
			visionMenu.removeClass('active-menu');
			leadershipMenu.removeClass('active-menu');
		}


	
	});
	
});