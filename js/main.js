if (location.protocol.startsWith('https')) {
	navigator.serviceWorker.register('service-worker.js')
	navigator.serviceWorker.onmessage = m => {
		console.info('Update found!')
		if (m?.data == 'update') location.reload(true)
	}
}

const regraItau = {
	28: 0,
	24: 1,
	20: 2,
	16: 3,
	13: 4,
	9: 5,
	5: 6,
	2: 7,
	0: 8
}

const params = new URLSearchParams(location.search)
var diasPresenciais = parseInt(params.get('dias_presenciais') || '8')
var diasAusentes = 0

function init() {
	document.querySelector('#diasPresenciais').value = diasPresenciais
	document.querySelector('#diasPresenciais').oninput = e => {
		diasPresenciais = parseInt(e.target.value)
		diasPresenciais <= 8 ? calcItau() : calc()
	}
	document.querySelector('#diasAusentes').oninput = e => {
		diasAusentes = parseInt(e.target.value)
		diasPresenciais <= 8 ? calcItau() : calc()
	}
}

function calcItau() {
	if (diasPresenciais <= 0 || isNaN(diasPresenciais) || isNaN(diasAusentes)) return refresh()
	Object.entries(regraItau)
	.sort((a, b) => {
		if (parseInt(a[0]) > parseInt(b[0])) return -1
		if (parseInt(a[0]) < parseInt(b[0])) return 1
		return 0
	})
	.some(el => {
		if (diasAusentes >= parseInt(el[0])) {
			refresh(el[1])
			return true
		}
	})
}

function calc() {
	if (diasPresenciais <= 0 || isNaN(diasPresenciais) || isNaN(diasAusentes)) return refresh()
	let diasRestantes = diasPresenciais - Math.round(diasPresenciais * diasAusentes / 30)
	if (diasRestantes <= 0) diasRestantes = diasPresenciais
	if (diasAusentes > 1 && diasRestantes >= diasPresenciais) return refresh(0)
	refresh(diasRestantes)
}

function refresh(dias) {
	if (dias == null || dias == undefined) document.querySelector('footer').innerHTML = ''
	else if (dias <= 0) document.querySelector('footer').innerHTML = `Você não precisa ir presencial`
	else document.querySelector('footer').innerHTML = `Você precisa ir presencial ${dias} vezes`
}

document.onreadystatechange = () => {
	if (document.readyState == 'complete') init()
}