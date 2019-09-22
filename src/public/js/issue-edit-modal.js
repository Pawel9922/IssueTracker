const modalTemplate = document.createElement('template');
modalTemplate.innerHTML = `
<style>

    :host {
        display: none;
    }

    .issue-edit-modal {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);
    }

    .modal-content {
        background-color: #fefefe;
        margin: 100% auto;
        padding: 10px;
        border: 1px solid #888;
        width: 80%;
        line-height: 40px;
    }

    .modal-close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .modal-close:hover,
    .modal-close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
    
    .button-wrapper {
        display: flex;   
        margin-top: 20px;
        flex-wrap: wrap;
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
        justify-self: flex-end;
    }
    
    .modal-button[disabled] {
        display: none;
    }
    
    .modal-button:focus {
        outline: none;
    }
    
    .issue-close-button {
        background-color: #e85d5d;
    }
    
    .issue-pending-button {
        background-color: #3cc13c;
    }
    
    .confirm-button {
        background-color: dodgerblue;
    }
    
</style>
<div class="issue-edit-modal">
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <div class="modal-status"></div>
    <div class="button-wrapper">
        <button data-status="1" class="issue-pending-button modal-button issue-status-button">Pending</button>
        <button data-status="2" class="issue-close-button modal-button issue-status-button">Close</button>
        <button class="modal-button confirm-button">Confirm</button>
    </div>
  </div>
</div>
`;

const StatusEnum = {
    Open: '0',
    Pending: '1',
    Close: '2'
};

class IssueEditModal extends HTMLElement {
    _statusMap = new Map([[StatusEnum.Open, 'Open'], [StatusEnum.Pending, 'Pending'], [StatusEnum.Close, 'Close']]);
    _editedIssueId = '';
    _issueStatus = '';

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(modalTemplate.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this._editedIssueId = this.getAttribute('id');
        this._issueStatus = this.getAttribute('status');
        this._renderModalContent();
        this.style.display = 'block';
    }

    connectedCallback() {
        this._attachListeners();
    }

    _attachListeners() {
        const closeModalButton = this._shadowRoot.querySelector('.modal-close');
        const statusButtons = this._shadowRoot.querySelectorAll('.issue-status-button');
        const confirmButton = this._shadowRoot.querySelector('.confirm-button');
        closeModalButton.addEventListener('click', () => {
            this._closeEditModal();
        });
        statusButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const status = btn.dataset.status;
                this._changeIssueStatus(status);
            });
        });
        confirmButton.addEventListener('click', () => {
            this._saveChanges();
        });
    }

    _saveChanges() {
        const url = `http://localhost:3000/issues/${this._editedIssueId}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({status: this._issueStatus})
        })
    }

    _changeIssueStatus(status) {
        const statusElm = this._shadowRoot.querySelector('.modal-status');
        statusElm.textContent = `Issue status: ${this._statusMap.get(status)}`;
        this._issueStatus = status;
    }

    _closeEditModal() {
        this.style.display = "none";
    }

    _renderModalContent() {
        const statusElm = this._shadowRoot.querySelector('.modal-status');
        const status = this.getAttribute('status');
        statusElm.textContent = `Issue status: ${this._statusMap.get(this.getAttribute('status'))}`;

        if (status === StatusEnum.Open) {
            this._disableModalButton('[data-status="0"]');
        }

        if (status === StatusEnum.Pending) {
            this._disableModalButton('[data-status="0"]');
            this._disableModalButton('[data-status="1"]');
        }

        if (status === StatusEnum.Close) {
            this._disableModalButton('[data-status="0"]');
            this._disableModalButton('[data-status="1"]');
            this._disableModalButton('[data-status="2"]');
        }
    }

    _disableModalButton(selector) {
        const button = this._shadowRoot.querySelector(selector);
        button.setAttribute('disabled', 'disabled');
    }
}

window.customElements.define('issue-edit-modal', IssueEditModal);