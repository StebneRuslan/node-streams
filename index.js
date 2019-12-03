const fs = require('fs')
const { Transform } = require('stream')

function createFile() {
	for(let i = 0; i < 10000; i++) {
		fs.appendFile('file.txt', 'Lorem Ipsum is simply dummy. text of the. (12312312125136754890-346523) printing and typesetting industry. 123123123121236787907658345 \n', () => {
			console.log(`step: ${i}`)
		})
	}
}
function readFile(path, encoding) {
	const stream = fs.createReadStream(path, { encoding })
	stream.on('data', (data) => {
		console.log(data)
	})
}
function writeFile(path, chunk, encoding) {
	const writable = fs.createWriteStream(path, { encoding, flags: 'a' })
	writable.end(chunk)
}

function toUpperCase() {
	const toUpperCase = new Transform({
		encoding: 'utf8',
		transform(chunk, encoding, callback) {
			const data = chunk.toString().toUpperCase()
			callback(null, data)
		}
	});
	toUpperCase.on('data', (chunk) => console.log(chunk))
	return toUpperCase
}
function removeDigits() {
	const writable = fs.createWriteStream('./digits.txt', {encoding: 'utf8', flags: 'a' })
	const removeDigits = new Transform({
		encoding: 'utf8',
		transform(chunk, encoding, callback) {
			writable.write(`${chunk.toString().match(/\d+/g).join('')}, date: ${new Date().toISOString()}, name: Ruslan\n`)
			const data = chunk.toString().replace(/\d/g, '')
			callback(null, data)
		}
	});
	removeDigits.on('data', (chunk) => console.log(chunk))
	return removeDigits
}
function capitalize() {
	const capitalize = new Transform({
		encoding: 'utf8',
		transform(chunk, encoding, callback) {
			const data = chunk.toString().split(/\.[ \n]+/g).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join('. ')
			callback(null, data)
		}
	});
	capitalize.on('data', (chunk) => console.log(chunk))
	return capitalize
}

createFile()
readFile('./file.txt', 'utf8')
writeFile('./file.txt', 'test string \n', 'utf8')

const stream = fs.createReadStream('./file.txt')
stream
	.pipe(removeDigits())
	.pipe(capitalize())
	.pipe(toUpperCase())
