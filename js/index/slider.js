var SelectSlider = 1;
 //the light
var sliderImage1 = new neverModules.modules.slider({targetId: "sliderDemo1",
												  sliderCss: "imageSlider1",
												  barCss: "imageBar1",
												  min: 0,
												  max: 255,
												  hints: "move the slider"
												  });
sliderImage1.onstart  = function () {
	SelectSlider = 1;
	event.srcElement.setCapture();
}

sliderImage1.onchange = function () {
	document.getElementById("light").value =  sliderImage1.getValue(0);
}


sliderImage1.onfinish = function () {
	document.getElementById("light").value =  sliderImage1.getValue();
	if( SelectSlider == 1 )
	{
		SendSetVideoParam();
	}
}

sliderImage1.create();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// the constract
var sliderImage2 = new neverModules.modules.slider({targetId: "sliderDemo2",
												  sliderCss: "imageSlider1",
												  barCss: "imageBar1",
												  min: 0,
												  max: 255,
												  hints: "move the slider"
												 
												  });
sliderImage2.onstart  = function () {
	event.srcElement.setCapture();
	SelectSlider = 1;
}

sliderImage2.onchange = function (){
	document.getElementById("contrast").value =  sliderImage2.getValue(0);
}

sliderImage2.onfinish = function () 
{
	document.getElementById("contrast").value =  sliderImage2.getValue();
	if( SelectSlider == 1 )
	{
		SendSetVideoParam();
	}
}

sliderImage2.create();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// the saturation
var sliderImage3 = new neverModules.modules.slider({targetId: "sliderDemo3",
												  sliderCss: "imageSlider1",
												  barCss: "imageBar1",
												  min: 0,
												  max: 255,
												  hints: "move the slider"
												
												  });
sliderImage3.onstart  = function () {
	SelectSlider = 1;
	event.srcElement.setCapture();
}

sliderImage3.onchange = function (){
	document.getElementById("saturation").value =  sliderImage3.getValue();
 
}

sliderImage3.onfinish = function () {
	document.getElementById("saturation").value =  sliderImage3.getValue();
	if( SelectSlider == 1 )
	{
		SendSetVideoParam();
	}
}

sliderImage3.create();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// the color
var sliderImage4 = new neverModules.modules.slider({targetId: "sliderDemo4",
												  sliderCss: "imageSlider1",
												  barCss: "imageBar1",
												  min: 0,
												  max: 255,
												  hints: "move the slider"
											 
												  });
sliderImage4.onstart  = function ()
{
	event.srcElement.setCapture();
	SelectSlider = 1;
}

sliderImage4.onchange = function () 
{
	document.getElementById("color").value =  sliderImage4.getValue(0);

}

sliderImage4.onfinish = function () 
{
	document.getElementById("color").value =  sliderImage4.getValue();
	if( SelectSlider == 1 )
	{
		SendSetVideoParam();
	}
}
sliderImage4.create();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//锐度
var sliderImage5 = new neverModules.modules.slider({targetId: "sliderDemo5",
											  sliderCss: "imageSlider1",
											  barCss: "imageBar1",
											  min: 0,
											  max: 255,
											  hints: "move the slider"
										 
											  });
sliderImage5.onstart  = function ()
{
	event.srcElement.setCapture();
	SelectSlider = 1;
}

sliderImage5.onchange = function () 
{
	document.getElementById("Acutance").value =  sliderImage5.getValue(0);
}

sliderImage5.onfinish = function () 
{
	document.getElementById("Acutance").value =  sliderImage5.getValue();
	if( SelectSlider == 1 )
	{
	 	SendSetVideoParam();
	}
}
sliderImage5.create();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// the trans type
var sliderImage6 = new neverModules.modules.slider({targetId: "sliderDemo6",
												  sliderCss: "imageSlider2",
												  barCss: "imageBar1",
												  min: 0,
												  max: 5000,
												  hints: ""
												  });
sliderImage6.onstart  = function ()
{
	event.srcElement.setCapture();
	SelectSlider = 1;
}

sliderImage6.onchange = function () 
{
	
}

sliderImage6.onfinish = function () 
{
//event.srcElement.releaseCapture();  
if( SelectSlider == 1 )
{
	try
	{
		var iTime = sliderImage6.getValue(0);
		PlayCtrl.SetBufferTime(iTime);
	}
	catch(err)
	{
		
	}
}
}
sliderImage6.create();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


