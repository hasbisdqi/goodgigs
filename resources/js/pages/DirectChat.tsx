import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ChevronLeft, MoreVertical, Phone, Video, Send, Paperclip, Smile } from 'lucide-react';

interface Contact {
    id: number;
    name: string;
    role: string;
    status: string;
    avatar: string;
}

interface Message {
    id: number;
    type: 'sent' | 'received';
    text: string;
    time: string;
    date: string;
    status: 'read' | 'delivered';
}

interface DirectChatProps {
    contact: Contact;
    messages: Message[];
}

export default function DirectChat({ contact, messages }: DirectChatProps) {
    const { auth } = usePage().props as any;
    const [chatMessages, setChatMessages] = useState<Message[]>(messages);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        setChatMessages(messages);
    }, [messages]);

    useEffect(() => {
        if (!auth?.user?.id || !(window as any).Echo) return;

        const channelName = `chat.${auth.user.id}`;
        const channel = (window as any).Echo.private(channelName);

        channel.listen('.ChatMessageSent', (e: any) => {
            if (e.messageData && e.messageData.sender_id === contact.id) {
                setChatMessages((prev) => [...prev, e.messageData]);
            }
        });

        return () => {
            (window as any).Echo.leave(channelName);
        };
    }, [auth?.user?.id, contact.id]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.message.trim()) return;

        post(`/messages/${contact.id}`, {
            preserveScroll: true,
            onSuccess: () => reset('message'),
        });
    };

    return (
        <div className="bg-background text-on-background font-body-md h-screen flex flex-col">
            <Head title={`Chat with ${contact.name}`} />

            {/* TopAppBar */}
            <header className="bg-surface flex items-center justify-between px-4 h-16 shadow-sm z-50 shrink-0">
                <div className="flex items-center gap-3">
                    <Link href="/messages" className="p-2 -ml-2 rounded-full hover:bg-surface-container active:scale-95 transition-all text-on-surface">
                        <ChevronLeft size={24} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30">
                                <img className="w-full h-full object-cover" src={contact.avatar} alt={contact.name} />
                            </div>
                            {contact.status === 'Online' && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-surface rounded-full"></div>
                            )}
                        </div>
                        <div>
                            <h1 className="font-label-lg text-label-lg font-bold text-on-surface leading-tight">{contact.name}</h1>
                            <p className="font-label-sm text-label-sm text-on-surface-variant leading-tight">{contact.role}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">

                    <button className="p-2 rounded-full hover:bg-surface-container active:scale-95 transition-all text-on-surface-variant">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>

            {/* Chat Canvas */}
            <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-surface-container-lowest">
                {chatMessages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                        <p className="text-on-surface-variant mb-2">No messages yet.</p>
                        <p className="text-label-sm text-on-surface-variant">Send a message to start the conversation.</p>
                    </div>
                ) : (
                    chatMessages.map((msg, index) => {
                        const showDate = index === 0 || chatMessages[index - 1].date !== msg.date;
                        return (
                            <React.Fragment key={msg.id}>
                                {showDate && (
                                    <div className="flex justify-center my-4">
                                        <span className="bg-surface-container-low px-3 py-1 rounded-full text-label-sm text-on-surface-variant shadow-sm border border-outline-variant/20">
                                            {msg.date}
                                        </span>
                                    </div>
                                )}
                                <div className={`flex flex-col ${msg.type === 'sent' ? 'items-end' : 'items-start'}`}>
                                    <div 
                                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm ${
                                            msg.type === 'sent' 
                                            ? 'bg-primary text-on-primary rounded-tr-sm' 
                                            : 'bg-surface-container text-on-surface rounded-tl-sm'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap word-break">{msg.text}</p>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 px-1 opacity-70">
                                        <span className="text-[11px] font-label-sm text-on-surface-variant">{msg.time}</span>
                                        {msg.type === 'sent' && (
                                            <span className="text-[11px] font-label-sm text-on-surface-variant ml-1">
                                                {msg.status === 'read' ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Message Input Area */}
            <footer className="bg-surface border-t border-outline-variant/30 px-4 py-3 shrink-0">
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                    <button type="button" className="p-2.5 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors shrink-0">
                        <Paperclip size={24} />
                    </button>
                    <div className="flex-1 bg-surface-container-low rounded-3xl flex items-center px-4 min-h-[48px] border border-outline-variant/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                        <input
                            type="text"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none outline-none py-3 text-on-surface placeholder:text-on-surface-variant/70 focus:ring-0"
                            autoComplete="off"
                        />
                        <button type="button" className="p-2 -mr-2 text-on-surface-variant hover:text-primary transition-colors shrink-0">
                            <Smile size={20} />
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        disabled={processing || !data.message.trim()}
                        className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 hover:brightness-110"
                    >
                        <Send size={20} className="ml-1" />
                    </button>
                </form>
            </footer>
        </div>
    );
}
