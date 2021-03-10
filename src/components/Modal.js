import React, { useRef, useEffect } from 'react'
import { useSpring, animated } from 'react-spring';
import * as easings from 'd3-ease';
import '../assets/css/modal.css';
import closeBtn from '../assets/images/close-btn.svg';

const Modal = ({ showModal, setShowModal, includeCloseBtn, children }) => {
  useEffect(() => {
    if (showModal)
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    else
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
  }, [showModal]);

  const modalRef = useRef(); 
  const animationStyle = useSpring({
    config: {
      duration: 500,
      easing: easings.easeBackOut
    },
    opacity: showModal ? 1 : 0,
    transition: 'ease',
    transform: showModal ? `translateY(0%)` : `translateY(-100%)`
  });

  const closeModal = e => {
    if (modalRef.current === e.target)
      setShowModal(false);
  };

  return (
    <>
    { showModal && (
      <div className="modal" ref={modalRef} onClick={closeModal}>
        <animated.div style={animationStyle}>
          <div className="modal__body">
            { children }
            { includeCloseBtn && (
            <div className="modal__body--close"
              aria-label="Close modal"
              onClick={() => setShowModal(prev => !prev)}
            >
              <img className="modal__body--close__img" src={closeBtn} alt="Close modal" />
            </div>
            )}
          </div>
        </animated.div>
      </div>
    )}
    </>
  );
};

export default Modal;


