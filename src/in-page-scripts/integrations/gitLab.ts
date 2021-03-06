﻿module Integrations {

    class GitLab implements WebToolIntegration {

        showIssueId = true;

        matchUrl = [
            '*://*/issues/*',
            '*://*/merge_requests/*'
        ];

        match(source: Source): boolean {
            return !!$$('.detail-page-description .title');
        }

        render(issueElement: HTMLElement, linkElement: HTMLElement) {

            linkElement.classList.add('btn');
            let header = $$('.detail-page-header');
            if (!header) {
                return;
            }

            // New design
            let issueButton = $$.visible('.issuable-actions .btn-grouped', header);
            if (issueButton) {
                linkElement.classList.add('btn-grouped');
                issueButton.parentElement.insertBefore(linkElement, issueButton);
                return;
            }

            // Old design
            let buttons = $$('.issue-btn-group', header);
            if (buttons) {
                linkElement.classList.add('btn-grouped');
                buttons.appendChild(linkElement);
            } else {
                linkElement.style.marginLeft = '1em';
                header.appendChild(linkElement);
            }
        }

        getIssue(issueElement: HTMLElement, source: Source): WebToolIssue {

            // https://gitlab.com/NAMESPACE/PROJECT/issues/NUMBER
            // https://gitlab.com/NAMESPACE/PROJECT/merge_requests/NUMBER
            let match = /^(.+)\/(issues|merge_requests)\/(\d+)$/.exec(source.path);

            if (!match) {
                return;
            }

            // match[3] is a 'NUMBER' from path
            let issueId = match[3];
            if (!issueId) {
                return;
            }

            let issueType = match[2];
            issueId = (issueType == 'merge_requests' ? '!' : '#') + issueId;

            let issueNameElement = $$.try('.detail-page-description .title');
            let issueName = issueNameElement.firstChild ? issueNameElement.firstChild.textContent : issueNameElement.textContent;
            if (!issueName) {
                return;
            }

            let projectNameNode = $$.findNode('.title .project-item-select-holder', Node.TEXT_NODE);

            let projectName = projectNameNode ?
                projectNameNode.textContent : // New design (both new and old navigation)
                $$.try('.title > span > a:nth-last-child(2)').textContent; // Old design

            let serviceType = 'GitLab';

            // match[1] is a 'https://gitlab.com/NAMESPACE/PROJECT' from path
            // cut '/NAMESPACE/PROJECT' from path
            let servicePath = match[1].split('/').slice(0, -2).join('/');
            servicePath = (servicePath) ? '/' + servicePath : '';

            let serviceUrl = source.protocol + source.host + servicePath;

            let issueUrl = $$.getRelativeUrl(serviceUrl, source.path);

            return { issueId, issueName, projectName, serviceType, serviceUrl, issueUrl };
        }
    }

    IntegrationService.register(new GitLab());
}