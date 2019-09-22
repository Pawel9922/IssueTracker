
class Dashboard {

    _dashboardRef;
    _issues = [];
    _issueElmMap = new Map();

    constructor() {
        this._dashboardRef = document.querySelector('.dashboard');
        this._loadIssues();
        this._renderEditIssueModal();
        this._renderAddNewIssueModal();
        this._attachListeners();
    }

    _loadIssues() {
        const url = 'http://localhost:3000/issues';
        fetch(url)
            .then(res => res.json())
            .then(issues => {
                this._renderIssues(issues);
            })
    }

    _attachListeners() {
        window.addEventListener('openModal', (evt) => {
            this._openEditIssueModal(evt.detail.id);
        });

        window.addEventListener('renderIssue', (evt) => {
            this._createIssue(evt.detail);
        });

        window.addEventListener('changeIssueStatus', (evt) => {
            this._changeIssueStatus(evt.detail);
        })
    }

    _renderIssues(issues) {
        for (let i = 0; i < issues.length; i++) {
            this._createIssue(issues[i]);
        }
    }

    _createIssue(issue) {
        const elm = document.createElement('issue-item');
        elm.setAttribute('title', issue.title);
        elm.setAttribute('description', issue.description);
        elm.setAttribute('status', issue.status);
        elm.setAttribute('id', issue._id);
        this._issues.push(issue);
        this._issueElmMap.set(issue._id, elm);
        this._dashboardRef.appendChild(elm);
    }

    _renderEditIssueModal() {
        const modal = document.createElement('issue-edit-modal');
        this._dashboardRef.appendChild(modal);
    }

    _renderAddNewIssueModal() {
        const modal = document.createElement('issue-add-modal');
        this._dashboardRef.appendChild(modal);
    }

    _openEditIssueModal(id) {
        const issue = this._issues.find((issue => issue._id === id));
        const modal = document.querySelector('issue-edit-modal');
        modal.setAttribute('status', issue.status);
        modal.setAttribute('id', issue._id);
    }

    _changeIssueStatus(data) {
        const issue = this._issues.find((issue => issue._id === data.id));
        issue.status = data.status;
        const issueElm = this._issueElmMap.get(data.id);
        issueElm.setAttribute('status', data.status);
    }
}

const dashboard = new Dashboard();