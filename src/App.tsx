import React from "react"
import "./App.css"
import { UserData } from "./components/UserData"

function App() {
	return (
		<div className="App">
			<header>
				<h1>Данные пользователей</h1>
			</header>
			<UserData />
		</div>
	)
}

export default App
