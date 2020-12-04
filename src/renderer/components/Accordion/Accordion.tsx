import React, {useEffect, useRef} from "react";

interface IProps {
    isOpen: boolean;
    label: string;
    onClick: () => void;
}

export const Accordion: React.FC<IProps> = ({isOpen, onClick, label, children}) => {
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        if (ref.current) {
            ref.current.style.display = isOpen ? "block" : "none";
        }
    }, [isOpen, ref]);

    return (
        <>
            <h5 className={`accordion ${isOpen ? "active" : ""}`} onClick={onClick}>
                {label}
            </h5>
            <div className='panel' ref={ref}>
                {children}
            </div>
        </>
    );
};
