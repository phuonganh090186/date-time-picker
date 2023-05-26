import React, { useRef } from "react";
import ReactDOM from "react-dom";
import "./style.scss";

interface Props {
  isShowing: boolean;
  toggle?: () => void;
  children?: React.ReactNode;
}

const Modal = ({ isShowing, children, toggle }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const clickOutSideModal = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (modalRef && !modalRef.current?.contains(event.target as Element)) {
      toggle?.();
    }
  };

  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div
            className="modal-wrapper"
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
            onClick={clickOutSideModal}
          >
            <div className="modal" ref={modalRef}>
              {children}
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default Modal;
