const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        width: 95%;
    }

    .issue {
        box-sizing: border-box;
        min-height: 100px;
        max-height: 200px;
        margin: 2px 0;
        padding: 10px;
        background-color: lightgreen;
        border-radius: 5px;
    }

    .issue-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin: 5px 0 10px 0;
    }

    .issue-status-button {
        border-radius: 10px;
        border: 0;
        padding: 8px;
        color: white;
        font-size: 0.7rem;
        margin-right: 10px;
        cursor: pointer;
    }
    
    .issue-status-button:focus {
        outline: none;
    }

    .issue-content {
        font-size: 0.8rem;
    }
    
    .issue-status-close {
        background-color: #e85d5d;
    }
    
    .issue-status-pending {
        background-color: #3cc13c;
    }
    
    .issue-status-open {
        background-color: mediumslateblue;
    }
    
</style>
<div class="issue">
    <div class="issue-header">
        <div class="issue-header-content"></div>
        <button class="issue-status-button"></button>
    </div>
    <div class="issue-content">
        Issue
    </div>
</div>
`;

class IssueComponent extends HTMLElement {
    _statusMap = new Map([['0', 'Open'], ['1', 'Pending'], ['2', 'Closed']]);
    _statusClassMap = new Map([
        ['0', 'issue-status-open'], ['1', 'issue-status-pending'], ['2', 'issue-status-close']
    ]);

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['id', 'status'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateStatus();
    }

    connectedCallback() {
        this.renderIssue();
        this.attachListeners();
    }

    renderIssue() {
        const header = this._shadowRoot.querySelector('.issue-header-content');
        const description = this._shadowRoot.querySelector('.issue-content');
        header.textContent = this.getAttribute('title');
        description.textContent = this.getAttribute('description');
    }

    updateStatus() {
        const status = this._shadowRoot.querySelector('.issue-status-button');
        const statusAttr = this.getAttribute('status');
        status.classList.remove(this._statusClassMap.get('0'), this._statusClassMap.get('1'));
        status.classList.add(this._statusClassMap.get(statusAttr));
        status.textContent = this._statusMap.get(statusAttr);
    }

    attachListeners() {
        const openModalButton = this._shadowRoot.querySelector('.issue-status-button');
        openModalButton.addEventListener('click', () => {
            this.openEditModal();
        });
    }

    openEditModal() {
        this.dispatchEvent(new CustomEvent("openModal", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {id: this.getAttribute('id')}
        }));
    }
}

window.customElements.define('issue-item', IssueComponent);