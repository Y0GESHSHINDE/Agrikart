import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AiOutlineSend } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import Agri from "../../public/images/Krishi.png";
import Navbar from "../components/Navbar/Navbar";

const Krishi = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    const conversationId = localStorage.getItem("conversation_id");

    try {
      const response = await fetch(
        conversationId
          ? "https://rag-chatbot-agrikart.onrender.com/conversation/continue"
          : "https://rag-chatbot-agrikart.onrender.com/conversation/start",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: input,
            ...(conversationId && { conversation_id: conversationId }),
          }),
        }
      );

      const data = await response.json();
      if (!conversationId)
        localStorage.setItem("conversation_id", data.conversation_id);

      setMessages((prev) => [...prev, { text: data.answer, sender: "ai" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error: Please try again.", sender: "ai" },
      ]);
    }
    setIsTyping(false);
  };

  return (
    <>
      <Navbar />
      <div className="w-full  block place-items-center   bg-white">
        <div className="w-3/5 flex justify-center flex-col h-[85vh] overflow-hidden">
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="p-4  text-white text-center flex items-center justify-center">
              <img src={Agri} alt="Krishi AI" className="h-40 w-40 mr-2" />
              <h1 className="text-xl font-semibold">Krishi AI</h1>
            </div>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}>
                {msg.sender === "ai" && (
                  <img
                    src={Agri}
                    alt="AI"
                    className="w-8 h-8 mr-2 rounded-full"
                  />
                )}

                <div
                  className={`max-w-[75%] p-3 rounded-lg text-sm shadow-md ${
                    msg.sender === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}>
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <FaUserCircle size={32} className="text-green-600 ml-2" />
                )}
              </motion.div>
            ))}
            {isTyping && (
              <p className="text-gray-500 text-sm">Krishi AI is typing...</p>
            )}
          </div>
        </div>
        <div className=" w-3/5 justify-center p-4 border-t flex  items-center">
          <input
            type="text"
            className="flex-1  rounded-full w px-4 py-2  bg-gray-100 text-black  focus:ring-2 focus:ring-green-500"
            placeholder="Ask Krishi AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-3 bg-green-600 text-white p-2 rounded-full">
            <AiOutlineSend size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Krishi;
