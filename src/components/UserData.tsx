import React, { FormEvent, useEffect, useState } from "react"
import {
	Button,
	Container,
	FormControl,
	Input,
	InputLabel
} from "@material-ui/core"
import Api from "../services/Api"
import Loader from "./Loader"
import { DataGrid, ruRUGrid } from "@material-ui/data-grid"


export const UserData: React.FC = () => {
	const [userCount, setUserCount] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [data, setData] = useState([])
	const [error, setError] = useState({
		userCountError: false,
		networkError: false,
	})
	const headCells = [
		{ id: 0, field: "name", headerName: "Имя" ,  flex: 0.3 },
		{ id: 1, field: "gender", headerName: "Пол",  flex: 0.2 },
		{ id: 2, field: "email", headerName: "Email",  flex: 0.4 },
		{ id: 3, field: "delete", headerName: "Удалить", flex: 0.1 },
	]

	let updatedData = null

	useEffect(() => {
		if(localStorage.getItem("data") !== null) {
			setData(JSON.parse(localStorage.getItem("data") as string))
		}
	}, [])


	const handleForm = (event: FormEvent) => {
		event.preventDefault()
		setIsLoading(true)

		// sending data to backend
		Api.get(`?results=${userCount}`)
			.then(async (response) => {

				if (response.ok) {
					const { results } = await response.json()
					const sortedData = results.map((user: any, index: number) => {
						return {
							id: index,	name: user.name.title + " " + user.name.first + " " + user.name.last, email: user.email,
							gender: user.gender === "male" ? "мужской" : "женский", delete: "X" }
					})

					//save data
					setData(sortedData)
					localStorage.setItem("data", JSON.stringify(sortedData))

					setIsLoading(false)
				} else {
					setIsLoading(false)
					setError({ ...error, networkError: true })
				}
			})
			.catch(() => {
				setIsLoading(false)
				setError({ ...error, networkError: true })
			})
	}

	const handleInputCount = (event: any) => {
		if (isNaN(event.target.value)) {
			setUserCount(event.target.value)
			setError({ ...error, userCountError: true })
		}
		else {
			setUserCount(event.target.value)
			setError({ ...error, userCountError: false })
		}
	};

	const handleRowSelection = (selectedRow: any) => {
		updatedData = data.filter((row: any) => row.id as number !== selectedRow.data.id)
		localStorage.setItem("data", JSON.stringify(updatedData))
		setData(updatedData)
	};

	return (
		<Container maxWidth="sm">
			<form onSubmit={handleForm}>
				<FormControl fullWidth>
					<InputLabel htmlFor="username">Введите число пользователей</InputLabel>
					<Input
						id="username" value={userCount}
						onChange={handleInputCount} error={error.userCountError} required type="text" />
					{error.userCountError && <span style={{color: "red"}} >Пожалуйста введите только число</span>}
					<br />
					<Button disabled={error.userCountError} variant="outlined" color="primary" size="medium" type="submit">
						Получить
					</Button>
				</FormControl>
			</form>

			<br />
			{isLoading && <Loader />}
			<br />

			<DataGrid
				autoHeight columns={headCells} rows={data} onRowSelected={handleRowSelection}
				pageSize={10} localeText={ruRUGrid}  />
		</Container>
	)
}
