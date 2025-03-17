import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AiOutlineSend } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa"; // User Icon
import Agri from "../../public/images/Krishi.png"; // Krishi logo (for AI messages & header)
import Navbar from "./../components/Navbar/Navbar";

const Krishi = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "This is a sample AI response!", sender: "ai" },
      ]);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="flex container lg:px-40 xl:px-60 md:p-10 mx-auto flex-col h-screen">
        {/* Header with Krishi Logo */}
        <div className="p-4 text-black text-xl font-semibold text-center md:-mt-10 flex justify-center">
          <img src={Agri} alt="Krishi Logo" className="h-48 -mb-10 "  />
        </div>

        {/* Chat Container */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end space-x-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}>
              {/* AI (Krishi) Icon */}
              {msg.sender === "ai" && (
                <img src={Agri} alt="Krishi AI" className="w-14  rounded-full" />
              )}

              {/* Chat Message */}
              <div
                className={`max-w-xs px-4 py-2  rounded-lg shadow-md ${
                  msg.sender === "user"
                    ? "bg-green-500 text-white ml-auto"
                    : "bg-white text-gray-900 mr-auto"
                }`}>
                {msg.text}
              </div>

              {/* User Icon */}
              {msg.sender === "user" && <FaUserCircle size={32} className="text-gray-600" />}
            </motion.div>
          ))}
        </div>

        {/* Input Field */}
        <div className="p-4 bg-white flex items-center border-t sticky bottom-0 w-full">
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
            placeholder="Ask Krishi AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700">
            <AiOutlineSend size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Krishi;
