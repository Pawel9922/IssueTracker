
class Dashboard {

    _dashboardRef;
    _issues = [];

    constructor() {
        this._dashboardRef = document.querySelector('.dashboard');
        this.loadIssues();
        this.renderEditModal();
        this.attachListeners();
    }

    loadIssues() {
        const url = 'http://localhost:3000/issues';
        fetch(url)
            .then(res => res.json())
            .then(res => {
                this._issues = res;
                this.renderIssues(this._issues);
            })
    }

    attachListeners() {
        window.addEventListener('openModal', (evt) => {
            this.openEditModal(evt.detail.id);
        })
    }

    renderIssues(issues) {
        for (let i = 0; i < issues.length; i++) {
            const elm = document.createElement('issue-item');
            elm.setAttribute('title', issues[i].title);
            elm.setAttribute('description', issues[i].description);
            elm.setAttribute('status', issues[i].status);
            elm.setAttribute('id', issues[i]._id);
            this._dashboardRef.appendChild(elm);
        }
    }

    renderEditModal() {
        const modal = document.createElement('issue-edit-modal');
        this._dashboardRef.appendChild(modal);
    }

    openEditModal(id) {
        const issue = this._issues.find((issue => issue._id === id));
        const modal = document.querySelector('issue-edit-modal');
        modal.setAttribute('status', issue.status);
        modal.setAttribute('id', issue._id);
    }
}

const dashboard = new Dashboard();