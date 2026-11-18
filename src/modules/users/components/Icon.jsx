const PATHS = {
    mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>),
    phone: <path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1-1 2.5c-4-.8-7.7-4.5-8.5-8.5L10 7 7 3Z" />,
    lock: (<><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>),
    user: (<><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>),
    wrench: <path d="M14.7 6.3a4.5 4.5 0 0 1-5.8 5.8l-5.7 5.7a1.4 1.4 0 0 0 2 2l5.7-5.7a4.5 4.5 0 0 0 5.8-5.8l-2.8 2.8-2.7-.7-.7-2.7 2.8-2.8a4.5 4.5 0 0 1 1.4 1.4Z" />,
    shield: (<><path d="M12 3 5 6v5c0 4.8 3 8 7 10 4-2 7-5.2 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>),
    plus: <path d="M12 5v14M5 12h14" />,
    edit: (<><path d="m14 5 5 5L8 21H3v-5L14 5Z" /><path d="m12 7 5 5" /></>),
    clipboard: (<><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 14h7" /></>),
    clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
    image: (<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 20" /></>),
    calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
    chevron: <path d="m9 18 6-6-6-6" />,
    pin: (<><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></>),
};

function Icon({ name, size = 18, className = '' }) {
    return (
        <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {PATHS[name]}
        </svg>
    );
}

export default Icon;