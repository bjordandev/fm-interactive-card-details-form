class DirectTyping {
    constructor(input, target, typing, validatorRgp=null, nullValue="") {
        this.input = input;
        this.target = target;
        this.content = "";
        this.validator = validatorRgp;
        this.nullValue = nullValue;

        if (typing)
            this.typing = typing.bind(this); 

        this.input.addEventListener("input", e => {
            this.typing(this, e);
        })
    }


    typing(object, inputEvent) {
        const inputType = inputEvent.inputType;
        const data = inputEvent.data; 
    
        if (inputType === "deleteContentBackward") 
            object.content = object.content.slice(0, -1);
        else if (inputType === "insertText")
            object.content += data;

        if (object.content === "" || (object.validator && object.validator.test(object.content)))
            object.target.textContent = object.content;
    }
}

/* CONSTANTS */

const CCN_REGEX = new RegExp("^[0-9]{16,16}$");
const CVC_REGEX = new RegExp("^[0-9]{1,3}$");
const DATE_REGEX =  new RegExp("^[0-9]{1,2}$");
const MAX_MONTH = 12;
const MAX_YEAR = 99;
const CVC_ID = "cvc";
const CCN_ID = "ccn";
const NAME_ID = "name";
const MONTH_ID = "month";
const YEAR_ID = "year";

/* HELPERS */

const cvc = new DirectTyping(
    document.getElementById(CVC_ID),
    document.getElementById(`${CVC_ID}-card`),
    null,
    CVC_REGEX,
);

const name = new DirectTyping(
    document.getElementById(NAME_ID),
    document.getElementById(`${NAME_ID}-card`),
    null,
    new RegExp(".+")
);

const month = new DirectTyping(
    document.getElementById(MONTH_ID),
    document.getElementById(`${MONTH_ID}-card`),
    (object, inputEvent) => {
        const inputType = inputEvent.inputType;
        const data = inputEvent.data; 
    
        if (inputType === "deleteContentBackward") 
            object.content = object.content.slice(0, -1);
        else if (inputType === "insertText")
            object.content += data;

        if (object.content === "" || (object.validator && object.validator.test(object.content))) {
            if (object.content === "") object.target.textContent = "00";
            else if (Number.parseInt(object.content, 10) >= MAX_MONTH) {
                object.target.textContent = MAX_MONTH.toString();
                object.input.value = MAX_MONTH;
                object.content = MAX_MONTH.toString();
            } 
            else object.target.textContent = object.content; 
        }
    },
    DATE_REGEX
);

const year = new DirectTyping(
    document.getElementById(YEAR_ID),
    document.getElementById(`${YEAR_ID}-card`),
    (object, inputEvent) => {
        const inputType = inputEvent.inputType;
        const data = inputEvent.data; 
    
        if (inputType === "deleteContentBackward") 
            object.content = object.content.slice(0, -1);
        else if (inputType === "insertText")
            object.content += data;

        if (object.content === "" || (object.validator && object.validator.test(object.content))) {
            if (object.content === "") object.target.textContent = "00";
            else if (Number.parseInt(object.content, 10) >= MAX_YEAR) {
                object.target.textContent = MAX_YEAR.toString();
                object.input.value = MAX_YEAR;
                object.content = MAX_YEAR.toString();
            } 
            else object.target.textContent = object.content;
        }
    },
    DATE_REGEX
);

const ccn = new DirectTyping(
    document.getElementById(CCN_ID),
    document.getElementById(`${CCN_ID}-card`),
    (object, inputEvent) => {
        const inputType = inputEvent.inputType;
        const data = inputEvent.data; 
        const target = object.target; 
        const childs = [...target.children];
        let divider = childs.length;
        let length = object.content.length;


        if (inputType === "deleteContentBackward")
            object.content = object.content.slice(0, -1);
        else if (inputType === "insertText") {
            object.content += data;
            length = object.content.length;
        }
        
        if (object.content === "" || new RegExp("^[0-9]{1,16}$").test(object.content)) {
            for (let i = 0, j = 0 ; i < length; i += divider, j++) {
                let subString = object.content.substring(i, i + divider);
                childs[j].textContent = subString;
            }
        }
    },
   CCN_REGEX
);
    
const entries = [ cvc, name,  month, year, ccn];

document.getElementById("button").addEventListener("click", pointerEvent => {
    pointerEvent.preventDefault();

    let pass = true;

    for (let entry of entries) {
        if (entry.validator) {
            const content = entry.content;
            const validator = entry.validator;
            const test = validator.test(content);
            const input = entry.input;

            if (!test) {
                pass = false;
                console.log(input.name);
                const formSectionElement = 
                    (input.name !== "month" && input.name !== "year") 
                    ? input.parentNode : input.parentNode.parentNode;
                console.log(formSectionElement);
                formSectionElement.classList.add("form-section--error");
            }
        }
    }

    if (pass) { 
        let formElement = document.getElementById("form");
        let thankElement = formElement.nextElementSibling;

        formElement.classList.remove("steps--show");
        thankElement.classList.add("steps--show");
    }
});