const electron = require('electron')
const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow
let addWindow

app.on('ready', () => {
	mainWindow = new BrowserWindow({})
	mainWindow.loadURL(`file://${__dirname}/main.html`)
	
	mainWindow.on('closed', () => app.quit())

	const mainMenu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(mainMenu)
})

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add new todo'
	})
	addWindow.loadURL(`file://${__dirname}/add.html`)
	addWindow.on('closed', () => addWindow = null)
}

ipcMain.on('todoadded', (event, todo) => {
	mainWindow.webContents.send('todoadded', todo)
	addWindow.close()
})



const menuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Todo',
				click() { createAddWindow()	}
			}, 
			{
				label: 'Quit',
				accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click() { app.quit() }
			}
		]
	}
]

if (process.platform === 'darwin') menuTemplate.unshift({})

if (process.env.NODE_ENV !== 'production') menuTemplate.push({
	label: 'Developer',
	submenu: [
		{
			label: 'Toggle Developer Tools',
			accelerator: process.platform === 'darwin' ? 'Command+Option+I' : 'Ctrl+Shift+I',
			click(item, focusedWindow) {
				focusedWindow.toggleDevTools()
			}
		}
	]
})