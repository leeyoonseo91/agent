import React, { useState } from "react";
import Chat from "./Chat";
import "./App.css";

function App() {
	const [theme, setTheme] = useState("dark"); // 기본 테마를 'dark'로 설정

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	return (
		<div className="App">
			<Chat theme={theme} toggleTheme={toggleTheme} />
		</div>
	);
}

export default App;
