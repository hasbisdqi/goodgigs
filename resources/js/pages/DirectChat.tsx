import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Video, MoreVertical, CheckCheck, FileText, Paperclip, Camera, Smile, Send } from 'lucide-react';

interface Message {
    id: number;
    type: 'sent' | 'received';
    text: string;
    time: string;
    date?: string;
    status?: string;
    attachment?: {
        name: string;
        size: string;
        type: string;
        icon: string;
    };
}

interface DirectChatProps {
    contact: {
        id: number;
        name: string;
        role: string;
        status: string;
        avatar: string;
    };
    messages: Message[];
}

export default function DirectChat({ contact, messages: initialMessages }: DirectChatProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim() === '') return;

        const newMsg: Message = {
            id: Date.now(),
            type: 'sent',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
        setIsTyping(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (!isTyping && e.target.value.length > 0) {
            setIsTyping(true);
        } else if (e.target.value.length === 0) {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-screen-xl mx-auto bg-background selection:bg-primary/20">
            <Head title={`GigConnect | Chat with ${contact.name}`} />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface shadow-sm h-20 flex items-center px-4 md:px-8 border-b border-outline-variant/10 shrink-0">
                <div className="flex items-center gap-4 w-full">
                    {/* Back Button */}
                    <Link href="/messages" className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95 text-on-surface">
                        <ArrowLeft size={28} />
                    </Link>

                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative w-11 h-11 shrink-0">
                            <img className="w-full h-full rounded-full object-cover" alt={contact.name} src={contact.avatar} />
                            {contact.status === 'Online' && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary-fixed-dim border-2 border-white rounded-full"></div>
                            )}
                        </div>
                        <div>
                            <h1 className="font-headline-md text-headline-md text-on-surface leading-tight">{contact.name}</h1>
                            <p className="font-label-sm text-label-sm text-on-surface-variant">
                                {contact.role} • {contact.status}
                            </p>
                        </div>
                    </div>

                    {/* Trailing Action */}
                    <div className="flex items-center gap-2">
                        <button className="hidden md:flex p-2 hover:bg-surface-container-high rounded-full transition-colors text-primary">
                            <Video size={24} />
                        </button>
                        <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface">
                            <MoreVertical size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
                {messages.map((msg, index) => {
                    const showDate = msg.date && (index === 0 || messages[index - 1].date !== msg.date);

                    return (
                        <React.Fragment key={msg.id}>
                            {showDate && (
                                <div className="flex justify-center">
                                    <span className="bg-surface-container-high px-4 py-1 rounded-full text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider">
                                        {msg.date}
                                    </span>
                                </div>
                            )}

                            {msg.type === 'received' ? (
                                /* Received Message */
                                <div className="flex flex-col items-start gap-1 max-w-[85%] md:max-w-[70%]">
                                    <div className="bg-gradient-to-br from-surface-container-low to-surface-container px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/20">
                                        <p className="font-body-md text-body-md text-on-surface">{msg.text}</p>
                                        
                                        {msg.attachment && (
                                            <div className="mt-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 flex items-center gap-3 cursor-pointer hover:bg-surface-bright transition-colors">
                                                <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error shrink-0">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="font-label-md text-label-md text-on-surface truncate">{msg.attachment.name}</p>
                                                    <p className="text-[10px] text-on-surface-variant uppercase">{msg.attachment.size} • {msg.attachment.type}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-label-sm text-outline px-1">{msg.time}</span>
                                </div>
                            ) : (
                                /* Sent Message */
                                <div className="flex flex-col items-end gap-1 ml-auto max-w-[85%] md:max-w-[70%]">
                                    <div className="bg-gradient-to-br from-primary-container to-primary px-4 py-3 rounded-2xl rounded-tr-none shadow-md">
                                        <p className="font-body-md text-body-md text-white">{msg.text}</p>
                                    </div>
                                    <div className="flex items-center gap-1 px-1">
                                        <span className="text-[11px] font-label-sm text-outline">{msg.time}</span>
                                        <CheckCheck size={14} className="text-primary" />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}

                {/* Typing Indicator */}
                <div className={`flex items-center gap-2 px-1 text-on-surface-variant transition-opacity duration-300 ${isTyping ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                    <span className="font-label-sm text-label-sm">You are typing...</span>
                </div>
                <div ref={messagesEndRef} />
            </main>

            {/* Bottom Message Input Bar */}
            <footer className="p-4 md:px-8 md:pb-8 bg-surface/80 backdrop-blur-md shrink-0">
                <div className="max-w-4xl mx-auto">
                    <div className="relative flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/40 rounded-full px-2 py-2 shadow-lg focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        {/* Attachments */}
                        <div className="flex items-center">
                            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant active:scale-90" title="Attach File">
                                <Paperclip size={20} />
                            </button>
                            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant active:scale-90" title="Take Photo">
                                <Camera size={20} />
                            </button>
                        </div>

                        {/* Input Field */}
                        <input 
                            className="flex-1 bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-outline-variant px-2 py-1 outline-none" 
                            placeholder="Type a message..." 
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />

                        {/* Emoji (Desktop) */}
                        <button className="hidden sm:flex p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant active:scale-90">
                            <Smile size={20} />
                        </button>

                        {/* Send Button */}
                        <button 
                            onClick={handleSend}
                            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform hover:brightness-110 group shrink-0"
                        >
                            <Send size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
