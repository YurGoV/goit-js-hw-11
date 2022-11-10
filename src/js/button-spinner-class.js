export class ButtonSpinner {
constructor (buttonRef) {
    this.buttonRef = buttonRef;
}

    start() {
        this.buttonRef.classList.add('button--loading');
        this.buttonRef.setAttribute("disabled", "");
    }

    stop() {
        this.buttonRef.classList.remove('button--loading');
        this.buttonRef.removeAttribute("disabled", "");
    }
  }



/*   css:
  .button {
    position: relative;
    padding: 8px 16px;
    background: #009579;
    border: none;
    outline: none;
    border-radius: 2px;
    cursor: pointer;
}

.button:active {
    background: #007a63;
}

.button__text {
    font: bold 20px 'Quicksand', san-serif;
    color: #ffffff;
    transition: all 0.2s;
}

.button--loading::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 4px solid transparent;
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: button-loading-spinner 1s ease infinite;
}
@keyframes button-loading-spinner {
    from {
        transform: rotate(0turn);
    }

    to {
        transform: rotate(1turn);
    }
} */

// https://dev.to/dcodeyt/create-a-button-with-a-loading-spinner-in-html-css-1c0h