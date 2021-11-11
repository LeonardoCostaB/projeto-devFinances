const modal = {
    open () {
        document
        .querySelector ('.modal-overlay')
        .classList.add ('active')
    },
    close () {
        document
        .querySelector ('.modal-overlay')
        .classList.remove ('active')
    }
}

const Storage = {
    get () {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set (transaction) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transaction))
    }
}

const transaction = {
    all: Storage.get(),
    add (transactions) {
        transaction.all.push(transactions)
        app.reload()
    },

    remove (index) {
       
        transaction.all.splice (index, 1)
       
       app.reload ()
    },

    incomes () {
        let income = 0;
        // pegar todas as transaçoes
        transaction.all.forEach(transaction => {
            //se for maior que zero
            if (transaction.amount > 0) {
                 //somar uma variavel 
                income += transaction.amount;
                 //e retornar a variavel
            }
        })    
        return income;
    },

    expenses () {
        let expense = 0;
        transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        });    
        return expense;
    },

    total () {
        return transaction.incomes() + transaction.expenses()
    }

}

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),

    addTransaction (transaction, index) {
        const tr = document.createElement ('tr')
        tr.innerHTML = DOM.innerHTMLTransaction (transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild (tr)
    },

    innerHTMLTransaction (transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency (transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
        <img onclick="transaction.remove (${(index)})" src="assets/assets/minus.svg" alt="Remover transação">
        </td>
        `
        return html
    },

    updateBalance () {
        document
            .getElementById ('incomeDisplay')
            .innerHTML = Utils.formatCurrency(transaction.incomes()) 
        document
            .getElementById ('expenseDisplay')
            .innerHTML = Utils.formatCurrency(transaction.expenses())
        document
            .getElementById ('totalDisplay')
            .innerHTML = Utils.formatCurrency(transaction.total ())
    },

    cleartransactions () {
        DOM.transactionsContainer.innerHTML = ""
    }

}

const Utils = {
    formatAmount (value) {
        value = Number (value) * 100

      return Math.round(value)
    },

    formatDate (date) {
        const splittedDate = date.split ("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency (value) {
        const signal = Number (value) < 0 ? "-" : ""

        value = String (value).replace (/\D/g,"")
        
        value = Number (value) / 100

        value = value.toLocaleString ("pt-br", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
   
}

const form = {

// estou fazendo a interligação dos dados do html para o JS.

    description: document.querySelector ('input#description'),
    amount: document.querySelector ('input#amount'),
    date: document.querySelector ('input#date'),

// criando o retorno dos dados. Quando mais que um, posso usar as chaves.

    getValues () {
        return {
            description: form.description.value,
            amount: form.amount.value,
            date: form.date.value 
        }
    },

// verificando se todos as informações estão preenchidas
    
    validateField () {
        const { description, amount, date} = form.getValues()
        
    // verificando se os dados estão preenchidos e fazendo um caso não esteja preenchido
    
        if (description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "") {
                throw new Error ("Por favor, preencha todos os campos")
        }
    },

    
// formatando os dados para salvar
   
      formatValues() {
        let{ description, amount, date} = form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate (date)

        return {
            description,
            amount,
            date
        }
      },

 // salvar

      saveTransaction (transactions) {
          transaction.add(transactions)
      },

// apagar os dados do formulário

      clearFields () {
        form.description.value = ""
        form.amount.value = ""
        form.date.value = ""
      },

    submit (event) {
        event.preventDefault()

        try {

            form.validateField()
            const transaction = form.formatValues()
            form.saveTransaction (transaction)
            form.clearFields()
            // modal feche
            modal.close()

        } catch (Error) {
            alert (Error.message)
        }
    }
}

const app = {
    init () {
        
        transaction.all.forEach (DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(transaction.all)
    },

    reload () {

        DOM.cleartransactions() 

        app.init()
    }
}



app.init ()

