// Information.js


function maximize(e) {

	minimizeAll(e);

	Ghost.possess(document.getElementById(e.id.split('-')[0]));
	Ghost.visible(document.getElementById(e.id.split('-')[0] + '-Content'), true);
	Ghost.resize(document.getElementById(e.id.split('-')[0]), true);

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

function minimizeAll(e) {

	let sections = document.getElementsByTagName('SECTION');

	for(let i = 1; i < sections.length; i++) {

		if(e.id.split('-')[0] != sections[i].id && document.getElementById(sections[i].id + '-Content').style.display != 'none') minimize(document.getElementById(sections[i].id + '-Minimize'));
	}
}
