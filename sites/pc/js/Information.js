// Information.js


function maximize(e) {

	Ghost.possess(document.getElementById(e.id.split('-')[0]));
	Ghost.visible(document.getElementById(e.id.split('-')[0] + '-Content'), true);
	Ghost.resize(document.getElementById(e.id.split('-')[0]));

	Ghost.visible(document.getElementById(e.id), false);
	Ghost.visible(document.getElementById(e.id.replace('Maximize', 'Minimize')), true);
}

function minimize(e) {

	Ghost.possess(document.getElementById(e.id.split('-')[0]));
	Ghost.visible(document.getElementById(e.id.split('-')[0] + '-Content'), false);
	Ghost.resize(document.getElementById(e.id.split('-')[0]));

	Ghost.visible(document.getElementById(e.id), false);
	Ghost.visible(document.getElementById(e.id.replace('Minimize', 'Maximize')), true);
}
