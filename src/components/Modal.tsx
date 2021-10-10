import { DetailedHTMLProps, Dispatch, FC, HTMLAttributes, SetStateAction } from "react";
import ReactModal from "react-modal";
import { XCircleIcon } from '@heroicons/react/solid'
import { IconButton } from "./IconButton";
import { useColorMode } from "../hooks/useColorMode";

export type ModalProps = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> & {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}

export const Modal: FC<ModalProps> = ({
    isOpen,
    setIsOpen,
    children
}) => {
    const colorMode = useColorMode().mode;

    return (
        <ReactModal
            style={{
                overlay: {
                    backgroundColor: 'rgba(0,0,0,0)'
                },
                content: {
                    width: 'max-content',
                    height: 'max-content',
                    minHeight: '25%',
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0px 0px 50px rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgb(17, 24, 39)',
                    border: '0px',
                    borderRadius: '40px',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
            isOpen={isOpen}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
        >
            <div className="flex flex-row-reverse h-8">
                <IconButton
                    colorMode={colorMode}
                    Icon={XCircleIcon}
                    iconClassname="hover:h-6 h-5"
                    onClick={() => { setIsOpen(false) }} />

            </div>

            <div className="flex flex-col w-full h-full justify-center p-5 pb-8">
                {children}
            </div>


        </ReactModal >
    );
}