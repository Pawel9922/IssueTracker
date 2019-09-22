const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        width: 95%;
    }

    .issue {
        box-sizing: border-box;
        min-height: 100px;
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
    
    .issue-header-content {
        width: 90%;
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

    .description {
        font-size: 0.8rem;
        overflow: hidden;
        width: 90%;
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
    
    .overflow-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
</style>
<div class="issue">
    <div class="issue-header">
        <div class="issue-header-content overflow-text"></div>
        <button class="issue-status-button"></button>
    </div>
    <div class="description"></div>
</div>
`;

class IssueComponent extends HTMLElement {


    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this._initVariables();
    }

    static get observedAttributes() {
        return ['id', 'status'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this._updateStatus();
    }

    connectedCallback() {
        this._renderIssue();
        this._attachListeners();
    }

    _initVariables() {
        this._statusMap = new Map([[StatusEnum.Open, 'Open'], [StatusEnum.Pending, 'Pending'], [StatusEnum.Closed, 'Closed']]);
        this._statusClassMap = new Map([
            [StatusEnum.Open, 'issue-status-open'], [StatusEnum.Pending, 'issue-status-pending'], [StatusEnum.Closed, 'issue-status-close']
        ]);
    }

    _renderIssue() {
        const header = this._shadowRoot.querySelector('.issue-header-content');
        const description = this._shadowRoot.querySelector('.description');
        header.textContent = this.getAttribute('title');
        description.textContent = this.getAttribute('description');
    }

    _updateStatus() {
        const status = this._shadowRoot.querySelector('.issue-status-button');
        const statusAttr = this.getAttribute('status');
        status.classList.remove(this._statusClassMap.get(StatusEnum.Open), this._statusClassMap.get(StatusEnum.Pending));
        status.classList.add(this._statusClassMap.get(statusAttr));
        status.textContent = this._statusMap.get(statusAttr);

        statusAttr !== StatusEnum.Closed
            ? status.style.cursor = 'pointer'
            : status.style.cursor = 'default';
    }

    _attachListeners() {
        const openModalButton = this._shadowRoot.querySelector('.issue-status-button');
        openModalButton.addEventListener('click', () => {
            if (this.getAttribute('status') !== StatusEnum.Closed) {
                this._openEditModal();
            }
        });
    }

    _openEditModal() {
        this.dispatchEvent(new CustomEvent("openModal", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {id: this.getAttribute('id')}
        }));
    }
}

window.customElements.define('issue-item', IssueComponent);