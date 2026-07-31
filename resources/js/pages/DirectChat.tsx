import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft, Video, MoreVertical, CheckCheck, 
    Paperclip, Camera, Smile, Send, FileText 
} from 'lucide-react';

interface Contact {
    id: number;
    name: string;
    title: string;
    status: string;
    avatar: string;
    is_online: boolean;
}

interface Attachment {
    name: string;
    size: string;
    type: string;
}

interface Message {
    id: number;
    text: string;
    time: string;
    is_sent: boolean;
    is_read?: boolean;
    attachment?: Attachment | null;
}

interface DirectChatProps {
    contact: Contact;
    messages: Message[];
}

export default function DirectChat({ contact, messages: initialMessages }: DirectChatProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const mainRef = useRef<HTMLElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTop = mainRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        setIsTyping(true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (newMessage.trim() === '') return;

        const newMsg: Message = {
            id: Date.now(),
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            is_sent: true,
            is_read: false
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
        setIsTyping(false);
    };

    return (
        <div className="flex flex-col h-screen max-w-screen-xl mx-auto bg-background selection:bg-primary/20">
            <Head title={`GigConnect | Chat with ${contact.name}`} />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface shadow-sm h-20 flex items-center px-4 md:px-8 border-b border-outline-variant/10">
                <div className="flex items-center gap-4 w-full">
                    {/* Back Button */}
                    <button 
                        onClick={() => window.history.back()}
                        className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95 text-on-surface"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    
                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative w-11 h-11">
                            <img 
                                className="w-full h-full rounded-full object-cover" 
                                alt={contact.name} 
                                src={contact.avatar}
                            />
                            {contact.is_online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary-fixed border-2 border-white rounded-full"></div>
                            )}
                        </div>
                        <div>
                            <h1 className="font-headline-md text-headline-md text-on-surface leading-tight">{contact.name}</h1>
                            <p className="font-label-sm text-label-sm text-on-surface-variant">
                                {contact.title} • {contact.status}
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
            <main 
                ref={mainRef}
                className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-outline-variant [&::-webkit-scrollbar-thumb]:rounded-full"
            >
                {/* Date Divider */}
                <div className="flex justify-center">
                    <span className="bg-surface-container-high px-4 py-1 rounded-full text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider">
                        Today
                    </span>
                </div>

                {/* Messages */}
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex flex-col gap-1 max-w-[85%] md:max-w-[70%] ${msg.is_sent ? 'items-end ml-auto' : 'items-start'}`}
                    >
                        <div 
                            className={`px-4 py-3 rounded-2xl shadow-sm border border-outline-variant/20 ${
                                msg.is_sent 
                                    ? 'bg-primary text-on-primary rounded-tr-none' 
                                    : 'bg-surface-container text-on-surface rounded-tl-none'
                            }`}
                        >
                            <p className="font-body-md text-body-md whitespace-pre-wrap">{msg.text}</p>
                            
                            {/* Attachment Mock */}
                            {msg.attachment && (
                                <div className="mt-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 flex items-center gap-3 cursor-pointer hover:bg-surface-bright transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-label-md text-label-md text-on-surface truncate">{msg.attachment.name}</p>
                                        <p className="text-[10px] text-on-surface-variant uppercase">{msg.attachment.size} • {msg.attachment.type}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-1 px-1">
                            <span className="text-[11px] font-label-sm text-outline">{msg.time}</span>
                            {msg.is_sent && msg.is_read && (
                                <CheckCheck size={14} className="text-primary" />
                            )}
                            {msg.is_sent && !msg.is_read && (
                                <CheckCheck size={14} className="text-outline" />
                            )}
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                <div 
                    className={`flex items-center gap-2 px-1 text-on-surface-variant transition-opacity duration-300 ${isTyping ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span className="font-label-sm text-label-sm">{contact.name} is typing...</span>
                </div>
            </main>

            {/* Bottom Message Input Bar */}
            <footer className="p-4 md:px-8 md:pb-8 bg-surface/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto">
                    <form 
                        onSubmit={handleSend}
                        className="relative flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/40 rounded-full px-2 py-2 shadow-lg focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                    >
                        {/* Attachments */}
                        <div className="flex items-center">
                            <button type="button" className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant active:scale-90" title="Attach File">
                                <Paperclip size={20} />
                            </button>
                            <button type="button" className="hidden sm:flex p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant active:scale-90" title="Take Photo">
                                <Camera size={20} />
                            </button>
                        </div>
                        
                        {/* Input Field */}
                        <input 
                            value={newMessage}
                            onChange={handleInput}
                            className="flex-1 bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-outline-variant px-2 py-1 outline-none" 
                            placeholder="Type a message..." 
                            type="text"
                        />
                        
                        {/* Emoji (Desktop) */}
                        <button type="button" className="hidden sm:flex p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant active:scale-90">
                            <Smile size={20} />
                        </button>
                        
                        {/* Send Button */}
                        <button 
                            type="submit"
                            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform hover:brightness-110 group flex-shrink-0"
                        >
                            <Send size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    );
}
