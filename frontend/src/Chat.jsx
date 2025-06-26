import React, { useState } from "react";
import { Input, Button, List, Avatar, Spin } from "antd";
import { SunOutlined, MoonOutlined, ArrowUpOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Chat.css";

const Chat = ({ theme, toggleTheme }) => {
	const [messages, setMessages] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSendMessage = async () => {
		if (inputValue.trim() === "") return;

		const userMessage = { sender: "user", text: inputValue };
		setMessages((prevMessages) => [...prevMessages, userMessage]);
		setInputValue("");
		setLoading(true);

		try {
			// 백엔드 API 호출
			const response = await axios.post("http://localhost:5000/chat", {
				message: inputValue
			});

			const botMessage = { sender: "bot", text: response.data.response };
			setMessages((prevMessages) => [...prevMessages, botMessage]);
		} catch (error) {
			console.error("Error sending message:", error);
			const errorMessage = {
				sender: "bot",
				text: "메시지를 보내는 중 오류가 발생했습니다."
			};
			setMessages((prevMessages) => [...prevMessages, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={`chat-container theme-${theme}`}>
			<div className="chat-header">
				<Button
					icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
					onClick={toggleTheme}
					shape="circle"
				/>
			</div>
			<div className="chat-window">
				<List
					className="message-list"
					dataSource={messages}
					locale={{ emptyText: "오늘 할일은 무엇인가요?" }}
					renderItem={(item) => (
						<List.Item
							className={`message-item ${
								item.sender === "user" ? "user-message" : "bot-message"
							}`}
						>
							<List.Item.Meta
								avatar={<Avatar>{item.sender === "user" ? "U" : "B"}</Avatar>}
								description={item.text}
							/>
						</List.Item>
					)}
				/>
				{loading && (
					<div className="loading-spinner">
						<Spin />
					</div>
				)}
			</div>
			<div className="input-area">
				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onPressEnter={handleSendMessage}
					placeholder="메시지를 입력하세요..."
					disabled={loading}
				/>
				<Button
					onClick={handleSendMessage}
					loading={loading}
					shape="circle"
					icon={<ArrowUpOutlined />}
				/>
			</div>
		</div>
	);
};

export default Chat;
