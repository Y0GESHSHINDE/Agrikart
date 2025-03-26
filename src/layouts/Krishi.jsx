import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AiOutlineSend } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import Agri from "../../public/images/Krishi.png";
import Navbar from "../components/Navbar/Navbar";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

const Krishi = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Clear conversation_id when component mounts (page loads/reloads)
    localStorage.removeItem("conversation_id");
  }, []);

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
          ? "http://127.0.0.1:5000/conversation/continue"
          : "http://127.0.0.1:5000/conversation/start",
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
      console.log(data);
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
      <div className="w-full flex justify-center bg-gray-50 min-h-[90vh]">
        <div className="w-4/5 flex justify-center flex-col h-[85vh] overflow-hidden bg-white shadow-lg rounded-lg my-4">
          <div
            ref={chatContainerRef}
            className="flex-1 p-6 overflow-y-auto space-y-4"
          >
            <div className="p-6 text-center flex flex-col items-center justify-center mb-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <img
                src={Agri}
                alt="Krishi AI"
                className="h-32 w-32 mr-2 drop-shadow-md"
              />
              <h1 className="text-2xl font-bold text-green-800">Krishi AI</h1>
              <p className="text-green-600 mt-2">
                Your agricultural knowledge assistant
              </p>
            </div>

            {messages.length === 0 && (
              <div className="text-center p-6 border border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-500">
                  Ask me anything about agriculture, farming, or crops!
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <img
                    src={Agri}
                    alt="AI"
                    className="w-10 h-10 mr-2 rounded-full border-2 border-green-100"
                  />
                )}

                <div
                  className={`max-w-[75%] p-4 rounded-2xl text-md mb-2 shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={solarizedlight}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                {msg.sender === "user" && (
                  <FaUserCircle size={30} className="text-green-600 ml-2" />
                )}
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex items-center">
                <img
                  src={Agri}
                  alt="AI"
                  className="w-10 h-10 mr-2 rounded-full border-2 border-green-100"
                />
                <div className="bg-gray-100 px-4 py-2 rounded-xl shadow-sm inline-flex">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                  <span
                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-200">
          <div className="max-w-3xl mx-auto flex items-center">
            <input
              type="text"
              className="flex-1 rounded-full px-5 py-3 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white border border-gray-300"
              placeholder="Ask Krishi AI something about agriculture..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              className={`ml-3 ${
                isTyping || !input.trim()
                  ? "bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              } text-white p-3 rounded-full transition-colors duration-200 shadow-md mr-20`}
            >
              <AiOutlineSend size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Krishi;
