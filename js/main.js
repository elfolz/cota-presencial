if (location.protocol.startsWith('https')) {
	navigator.serviceWorker.register('service-worker.js')
	navigator.serviceWorker.onmessage = m => {
		console.info('Update found!')
		if (m?.data == 'update') location.reload(true)
	}
}

const params = new URLSearchParams(location.search)
const data = new Date()
const totalDiasMes = (new Date(data.getFullYear(), data.getMonth()+1, 0))?.getDate() || 30

var diasPresenciais = parseInt(params.get('dias_presenciais') || '8')
var diasAusentes = 0

function init() {
	document.querySelector('#diasPresenciais').value = diasPresenciais
	document.querySelector('#diasPresenciais').oninput = e => {
		diasPresenciais = parseInt(e.target.value)
		calc()
	}
	document.querySelector('#diasAusentes').oninput = e => {
		diasAusentes = parseInt(e.target.value)
		calc()
	}
}

function calc() {
	if (diasPresenciais <= 0 || isNaN(diasPresenciais) || isNaN(diasAusentes)) return document.querySelector('footer').innerHTML = ''
	let diasRestantes = diasPresenciais - Math.round(diasPresenciais * diasAusentes / totalDiasMes)
	if (diasRestantes <= 0) diasRestantes = diasPresenciais
	if (diasAusentes > 1 && diasRestantes >= diasPresenciais) return document.querySelector('footer').innerHTML = `Você não precisa ir presencial`
	document.querySelector('footer').innerHTML = `Você precisa ir presencial ${diasRestantes} vezes`
}

document.onreadystatechange = () => {
	if (document.readyState == 'complete') init()
}