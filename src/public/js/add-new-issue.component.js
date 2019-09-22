const addNewIssueTemplate = document.createElement('template');
addNewIssueTemplate.innerHTML = `
<style>
    .issue-add-modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.4);
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: #fefefe;
        padding: 10px;
        border: 1px solid #888;
        width: 80%;
        max-width: 800px;
        height: 280px;
        display: flex;
        flex-direction: column;
    }

    .modal-close {
        color: #aaa;
        font-size: 28px;
        font-weight: bold;
        align-self: flex-end;
        cursor: pointer;
    }
    
    .modal-button {
        border-radius: 10px;
        border: 0;
        padding: 8px;
        color: white;
        font-size: 0.7rem;
        margin-right: 10px;
        cursor: pointer;
        min-width: 55px;
    }
    
    .confirm-button {
        margin-left: auto;
        margin-right: 0;
        background-color: dodgerblue;
        align-self: flex-end;
        margin-top: auto;
    }
    
    .confirm-button {
        background-color: dodgerblue;
        align-self: flex-end;
    }
    
    .add-button {
        position: fixed;
        bottom: 40px;
        right: 30px;
        padding: 0;
        border-width: 0;
        background-color: dodgerblue;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.8rem;
        color: white;
        outline: none;
    }
    
    label {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    
    .description {
        height: 100px;
    }
    
    .title, .description {
        border: lightgray 1px solid;
        border-radius: 5px;
    }
    
</style>
<div class="issue-add-modal">
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <label>Title</label>
    <input class="title">
    <label>Description</label>
    <textarea class="description"></textarea>
    <button class="modal-button confirm-button">Confirm</button>
  </div>
</div>
<button class="add-button">+</button>
`;

class IssueAddModalComponent extends HTMLElement {

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(addNewIssueTemplate.content.cloneNode(true));
        this._modalRef =  this._shadowRoot.querySelector('.issue-add-modal');
    }

    connectedCallback() {
        this._attachListeners();
    }

    _attachListeners() {
        const addButton = this._shadowRoot.querySelector('.add-button');
        const closeButton = this._shadowRoot.querySelector('.modal-close');
        const confirmButton = this._shadowRoot.querySelector('.confirm-button');
        addButton.addEventListener('click', () => {
            this._modalRef.style.display = 'flex';
        });

        closeButton.addEventListener('click', () => {
            this._clearInputs();
            this._modalRef.style.display = 'none';
        });

        confirmButton.addEventListener('click', () => {
            this._saveIssue();
            this._clearInputs();
            this._modalRef.style.display = 'none';
        });
    }

    _saveIssue() {
        const title = this._shadowRoot.querySelector('.title').value;
        const description = this._shadowRoot.querySelector('.description').value;
        const url = 'http://localhost:3000/issues';
        const body = JSON.stringify({status: "0", title: title, description: description});
        fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            }
        ).then(res => res.json())
         .then(issue => {
             this._renderIssue(issue);
         });
    }

    _clearInputs() {
        this._shadowRoot.querySelector('.title').value = '';
        this._shadowRoot.querySelector('.description').value = '';
    }

    _renderIssue(issue) {
        this.dispatchEvent(new CustomEvent("renderIssue", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: issue
        }));
    }
}

window.customElements.define('issue-add-modal', IssueAddModalComponent);