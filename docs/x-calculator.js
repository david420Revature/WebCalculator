const template = document.getElementById("x-calculator")

const equals = (x,y) => y
const add = (x,y) => x + y
const subtract = (x,y) => x - y
const multiply = (x,y) => x * y
const divide = (x,y) => (x - (x % y)) / y

class Calculator extends HTMLElement {
    #shadow
    #digits
    #screen
    #clear
    #backspace
    #negate
    #add
    #subtract
    #multiply
    #divide
    #equals
    #acc
    #mode
    #overwrite
    // could use big integer to handle larger numbers
    // should make screen viewport default to a full right scroll
    constructor() {
        super()
        this.#shadow = this.attachShadow({mode: "closed"})
        this.#shadow.appendChild(template.content.cloneNode(true))
        // buttons should be reordered on the calculator using css
        this.#digits = Array.from(this.#shadow.querySelectorAll(
            "#digits > li > button:not(#clear, #negate, #backspace)"
        )).sort((cur, other) => Number(cur.textContent) - Number(other.textContent))
        this.#screen = this.#shadow.querySelector("#screen")
        this.#clear = this.#shadow.querySelector("#clear")
        this.#negate = this.#shadow.querySelector("#negate")
        this.#add = this.#shadow.querySelector("#add")
        this.#subtract = this.#shadow.querySelector("#subtract")
        this.#multiply = this.#shadow.querySelector("#multiply")
        this.#divide = this.#shadow.querySelector("#divide")
        this.#equals = this.#shadow.querySelector("#equals")
        this.#backspace = this.#shadow.querySelector("#backspace")

        this.clear()
        this.#digits.forEach(digit => {
            const value = Number(digit.textContent)
            digit.addEventListener("click", () => {
                this.#screen.textContent += value
            })
        })
        this.#negate.addEventListener("click", () => {
            // if negating an empty calculator, an extra 0 is appended
            this.#screen.textContent = -1 * Number(this.#screen.textContent)
        })
        this.#clear.addEventListener("click", this.clear.bind(this))
        this.#backspace.addEventListener("click", () => {
            this.#screen.textContent = this.#screen.textContent.substr(
                0,
                this.#screen.textContent.length - 1
            )
        })

        this.#equals.addEventListener("click", () => {
            this.#acc = this.#mode(this.#acc, Number(this.#screen.textContent))
            this.#screen.textContent = this.#acc
            this.#mode = equals
        })
        this.#add.addEventListener("click", () => {
            this.#acc = this.#mode(this.#acc, Number(this.#screen.textContent))
            this.#screen.textContent = ""
            this.#mode = add
        })
        this.#subtract.addEventListener("click", () => {
            this.#acc = this.#mode(this.#acc, Number(this.#screen.textContent))
            this.#screen.textContent = ""
            this.#mode = subtract
        })
        this.#multiply.addEventListener("click", () => {
            this.#acc = this.#mode(this.#acc, Number(this.#screen.textContent))
            this.#screen.textContent = ""
            this.#mode = multiply
        })
        this.#divide.addEventListener("click", () => {
            this.#acc = this.#mode(this.#acc, Number(this.#screen.textContent))
            this.#screen.textContent = ""
            this.#mode = divide
        })
    }

    clear() {
        this.#acc = 0
        this.#screen.textContent = ""
        this.#mode = add
    }
}

customElements.define("x-calculator", Calculator)